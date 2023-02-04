import { ActionHandler, ActionSenders, Votes, MemberInMessage, ShowCurrentMembersMessage, Actions, WebSocketMessage, ToggleResultsDisplayMessage } from '../models/voting-types';
import votingUrl from "../api/voting";
import { VotingSessionState, VotingWebSocket } from "../models/voting-types";
import { User } from "../models/user";

/*------------------------------------- General Settings -------------------------------------*/

export const votingOptions = [1, 2, 3, 5, 8, 13, 21, 34, 55];
export const indicativeVotingOptions = {
  voted: -1,
  unknown: -2,
  initial: 0
};

/*------------------------------------- Action Handlers -------------------------------------*/

const closeSession: ActionHandler = ({ conn }) => {
  conn.close();
};

const showNewMember: ActionHandler = ({ msg, setState, conn }) => {

  const newMember = msg.data as MemberInMessage;
  const memberVotes = { ...conn.state.memberVotes };
  const members = { ...conn.state.members, [newMember.id]: newMember }
  memberVotes[newMember.id] = indicativeVotingOptions.initial;
  setState({ memberVotes, members });
};

const removeLeavingMember: ActionHandler = ({ msg, conn, setState }) => {

  const leavingMember = msg.data as MemberInMessage;
  const memberVotes = { ...conn.state.memberVotes };
  const members = { ...conn.state.members };
  delete memberVotes[leavingMember.id];
  delete members[leavingMember.id]

  setState({ memberVotes, members });
};

const showCurrentMembers: ActionHandler = ({ msg, setState, currentUser }) => {

  const { sessionModerator, currentMembers } = msg.data as ShowCurrentMembersMessage;
  const membersOnTop = currentUser.id === sessionModerator.id
    ? { [sessionModerator.id]: indicativeVotingOptions.initial }
    : ({
      [currentUser.id]: indicativeVotingOptions.initial,
      [sessionModerator.id]: indicativeVotingOptions.initial
    });

  const members = currentMembers
    .reduce((agg, m) => Object
      .assign(agg, { [m.id]: m }), { [sessionModerator.id]: sessionModerator });

  setState({
    sessionModerator: sessionModerator.id,
    members,
    memberVotes: currentMembers
      .reduce((agg, m) => m.id === currentUser.id
        ? agg
        : ({ ...agg, [m.id]: indicativeVotingOptions.initial }), membersOnTop),
    loading: false
  });
};

const sessionCreated: ActionHandler = ({ setState, currentUser }) => {
  setState({
    sessionModerator: currentUser.id,
    currentUserIsSessionModerator: true,
    loading: false,
    memberVotes: { [currentUser.id]: indicativeVotingOptions.initial },
    members: { [currentUser.id]: currentUser }
  });
};

const displaySubject: ActionHandler = ({ msg, setState, conn }) => {
  const currentSubject = msg.data as string;
  const newState: VotingSessionState = {};
  if (currentSubject !== conn.state.currentSubject) newState.currentSubject = currentSubject;
  setState(newState);
};

const reset: ActionHandler = ({ setState, conn }) => {
  const newState: VotingSessionState = {
    memberVotes: Object
      .keys(conn.state.memberVotes || {})
      .reduce((agg, k) => (Object.assign({}, agg, { [k]: indicativeVotingOptions.initial })), {}),
    lockedOption: indicativeVotingOptions.initial,
    resultsAreShown: false
  };
  setState(newState);
};

const toggleResultsDisplay: ActionHandler = ({ msg, setState, conn, currentUser }) => {

  const { votes = {}, show = false } = msg.data as ToggleResultsDisplayMessage || {};
  const currentMemberVotes = conn.state.memberVotes || {}
  const memberVotes: Votes = {};

  Object.keys(currentMemberVotes).forEach(k => {
    if (show) {
      memberVotes[k] = votes[k];
    } else {
      memberVotes[k] = k === currentUser.id
        || !currentMemberVotes[k]
        ? currentMemberVotes[k] || indicativeVotingOptions.initial
        : indicativeVotingOptions.voted
    }
  });

  setState({ memberVotes, resultsAreShown: show });
};

const showVote: ActionHandler = ({ msg, conn, setState, currentUser }) => {

  const vote = msg.data as Votes;
  const memberVotes = Object.assign({}, conn.state.memberVotes, vote);
  const newState: VotingSessionState = { memberVotes };
  if (vote[currentUser.id]) newState.lockedOption = vote[currentUser.id];
  setState(newState);
};

const changeModerator: ActionHandler = ({ msg, conn, setState, currentUser }) => {
  const newModeratorId = msg.data as string;
  const newState: VotingSessionState = {
    memberVotes: Object
      .keys(conn.state.memberVotes || {})
      .reduce((agg, k) => (Object.assign({}, agg, { [k]: indicativeVotingOptions.initial })), {}),
    lockedOption: indicativeVotingOptions.initial,
    resultsAreShown: false,
    sessionModerator: newModeratorId,
    currentUserIsSessionModerator: currentUser.id === newModeratorId
  };
  setState(newState);
};

const actionHandlers: { [key: string]: ActionHandler } = {
  closeSession,
  showNewMember,
  removeLeavingMember,
  showCurrentMembers,
  sessionCreated,
  displaySubject,
  toggleResultsDisplay,
  showVote,
  reset,
  changeModerator
};

/*------------------------------------- Action Senders -------------------------------------*/

const createSubmitVoteSender = (conn: VotingWebSocket) => (msg: number) => {
  conn.send(JSON.stringify({ action: Actions.submitVote, data: msg }));
};

const createToggleResultsDisplaySender = (conn: VotingWebSocket) => () => conn.send(JSON.stringify({ action: Actions.toggleResultsDisplay }));

const createCloseSessionSender = (conn: VotingWebSocket) => () => conn.send(JSON.stringify({ action: Actions.closeSession }));

const createDisplaySubjectSender = (conn: VotingWebSocket) => (subject: string) => {
  conn.send(JSON.stringify({ action: Actions.displaySubject, data: subject }));
};

const createResetSender = (conn: VotingWebSocket) => () => conn.send(JSON.stringify({ action: Actions.reset }));

const createChangeModeratorSender = (conn: VotingWebSocket) => (newModeratorId: string) => {
  conn.send(JSON.stringify({ action: Actions.changeModerator, data: newModeratorId }));
};

const createActionSenders = (conn: VotingWebSocket): ActionSenders => ({
  [Actions.submitVote]: createSubmitVoteSender(conn),
  [Actions.toggleResultsDisplay]: createToggleResultsDisplaySender(conn),
  [Actions.closeSession]: createCloseSessionSender(conn),
  [Actions.displaySubject]: createDisplaySubjectSender(conn),
  [Actions.reset]: createResetSender(conn),
  [Actions.changeModerator]: createChangeModeratorSender(conn)
});

/*------------------------------------- Initialize Connection -------------------------------------*/

export const initVotingSessionConn = (teamId: string, initialState: VotingSessionState, setState: React.Dispatch<VotingSessionState>, currentUser: User): VotingWebSocket | null => {

  const conn = new WebSocket(`${votingUrl}/${teamId}`) as VotingWebSocket;

  // Give the connection access to the latest state in case a handler needs it.
  conn.state = initialState;
  const modifiedSetState = (value: VotingSessionState) => {
    conn.state = { ...conn.state, ...value };
    setState(value);
  }

  conn.onopen = () => {
    modifiedSetState({ actionSenders: createActionSenders(conn), loading: true })
  }

  conn.onmessage = ev => {
    const msg = JSON.parse(ev.data);

    if (Array.isArray(msg)) {

      const messages = msg as WebSocketMessage<any>[];
      messages.forEach(m => {
        if (actionHandlers[m?.action]) actionHandlers[m.action]({ msg: m, setState: modifiedSetState, conn, currentUser })
      });

    } else {

      const message = msg as WebSocketMessage<any>;
      if (actionHandlers[msg?.action]) actionHandlers[msg.action]({ msg: message, setState: modifiedSetState, conn, currentUser });
    }
  };

  conn.onclose = () => {
    modifiedSetState({ ...initialState, isRunning: false, loading: false });
  };

  conn.onerror = (e) => {
    conn.close();
  }

  return conn;
};
