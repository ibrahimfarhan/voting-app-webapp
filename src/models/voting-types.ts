import { User } from "./user";

export interface WebSocketMessage<T> {
  action: string
  data?: T
}

export type Votes = { [k: string]: number };

export type ToggleResultsDisplayMessage = { votes: Votes, show: boolean }

export interface MemberInMessage {
  id: string
  username: string
}

export interface ShowCurrentMembersMessage {
  sessionModerator: MemberInMessage
  currentMembers: MemberInMessage[]
}

export interface VotingWebSocket extends WebSocket {
  state: VotingSessionState
}

export interface VotingSessionState {
  sessionModerator?: string
  currentUserIsSessionModerator?: boolean
  currentSubject?: string
  memberVotes?: { [username: string]: number },
  members?: { [id: string]: MemberInMessage }
  actionSenders?: ActionSenders
  isRunning?: boolean
  loading?: boolean
  resultsAreShown?: boolean
  lockedOption?: number
}

export interface ActionHandlerParams {
  msg: WebSocketMessage<any>,
  setState: React.Dispatch<VotingSessionState>,
  conn: VotingWebSocket,
  currentUser: User
};

export enum Actions {
  submitVote = 'submitVote',
  toggleResultsDisplay = 'toggleResultsDisplay',
  closeSession = 'closeSession',
  displaySubject = 'displaySubject',
  reset = 'reset',
  changeModerator = 'changeModerator'
}

export type ActionHandler = (params: ActionHandlerParams) => void;
export type ActionSenders = { [key in Actions]: (arg?: any) => void }