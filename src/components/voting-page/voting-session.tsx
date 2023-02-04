import Button from '@material-ui/core/Button';
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import useCombinedState from "../../hooks/use-combined-state";
import { VotingSessionState } from "../../models/voting-types";
import { User } from "../../models/user";
import { RootState, TeamsState } from "../../models/state-types";
import ShowFirstChild from "../utils/show-first-child";
import styles from './voting-session.module.scss';
import EditableOnClick from "../utils/editable-on-click";
import ConfirmationDialog from "../utils/confirmation-dialog";
import { getCssClasses, showAlert } from "../../utils/utils";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import VotingResults from "./voting-results";
import Loading from "../utils/loading";
import callApi from '../../api/call-api';
import teamApi from '../../api/team';
import { indicativeVotingOptions, initVotingSessionConn, votingOptions } from '../../realtime/voting-connection';
import Team from '../../models/team';
import { RiAdminLine, RiAdminFill } from 'react-icons/ri';

interface TeamState {
  team?: Team
  loadingTeam?: boolean
  teamApiError?: string
}

const initialState: VotingSessionState = {
  sessionModerator: '',
  currentUserIsSessionModerator: false,
  currentSubject: '',
  members: {},
  memberVotes: {},
  isRunning: true,
  resultsAreShown: false
};

const votesUiMap = new Map<number | null, string | JSX.Element>([
  [indicativeVotingOptions.voted, <CheckCircleIcon classes={{ root: styles.icon }} />],
  [indicativeVotingOptions.unknown, '?'],
  [indicativeVotingOptions.initial, '']
]);

const getVoteInUi = (vote: number | null) => {
  const text = votesUiMap.get(vote);
  if (text && typeof text !== 'string') return text;
  return (
    <p className={styles['number-wrapper']}>
      <span className={Number(vote) >= 10 ? styles.number : styles.number + ' ' + styles['number-sm']}>{text === undefined ? vote : text}</span>
    </p>
  );
};

const VotingSession = () => {

  const dispatch = useDispatch();
  const { teamId } = useParams<{ [key: string]: string; }>();
  const history = useHistory();

  const { data: teams } = useSelector<RootState, TeamsState>(state => state.teams);
  const [{ team, loadingTeam }, setTeamState] = useCombinedState<TeamState>({});

  useEffect(() => {
    if (teams && teams[teamId]) {
      setTeamState({ team: teams[teamId], loadingTeam: false });
      return;
    }
    callApi(teamApi.getUrl(teamId))
      .then((res) => {
        setTeamState({ loadingTeam: false, team: res });
      })
      .catch(() => {
        setTeamState({ loadingTeam: false, teamApiError: 'Error while fetching team' });
      });
  }, [teamId]);

  const user = useSelector<RootState, User>(state => state.user.data as User);

  const [state, setState] = useCombinedState(initialState);

  const {
    memberVotes = {},
    members = {},
    sessionModerator = '',
    actionSenders,
    isRunning,
    currentUserIsSessionModerator = false,
    loading = true,
    currentSubject = '',
    resultsAreShown,
    lockedOption,
  } = state;

  useEffect(() => {
    if (!isRunning) {
      showAlert(dispatch, {
        type: 'error',
        content: 'Voting ended by moderator',
      });
      history.push('/');
      return;
    }
    const initialConn = initVotingSessionConn(teamId, initialState, setState, user);
    return () => {
      if (initialConn) initialConn.close();
    };
  }, [isRunning]);


  if (!loading && !isRunning && !actionSenders) {
    showAlert(dispatch, {
      type: 'error',
      content: 'Already Joined'
    });
    history.push('/');
    return null;
  }

  if (loading || loadingTeam || !actionSenders || !team) return <Loading />;

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (resultsAreShown) return;
    setState({ lockedOption: indicativeVotingOptions.initial });
    actionSenders?.submitVote(+e.currentTarget.id);
  };

  const handleEndVoting = () => history.push('/');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles['team-name-wrapper']} title={team.name}>
          <strong className={styles['team-name']}>{team.name}</strong>
        </div>
        <div className={styles.subject}>
          <EditableOnClick
            onSubmit={(subject) => actionSenders.displaySubject(subject)}
            disableEdit={!currentUserIsSessionModerator}
            initialText={currentSubject}
            validationRules={{ maxLength: 200 }}
            placeholder={currentUserIsSessionModerator ? 'Enter Voting Subject' : 'Voting Subject'}
          />
        </div>
        <div className={styles['admin-btns']}>
          <ShowFirstChild inCase={currentUserIsSessionModerator}>
            <Fragment>
              <Button
                variant="outlined" color="primary"
                onClick={() => actionSenders.reset()}>
                Reset
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={actionSenders.toggleResultsDisplay}>
                {resultsAreShown ? 'Hide' : 'Show'} Results
              </Button>
              <ConfirmationDialog
                renderTrigger={({ open }) => (
                  <Button variant="contained" color="secondary" onClick={open}>End</Button>
                )}
                action={handleEndVoting}
                title={`Are you sure you want to end voting for ${team.name} ?`}
                acceptText="Yes"
                cancelText="Cancel"
              />
            </Fragment>
            <Button variant="contained" color="secondary" onClick={handleEndVoting}>Leave</Button>
          </ShowFirstChild>
        </div>

      </div>
      <div className={styles.body}>
        <div className={styles['members-container']}>
          <div className={styles.admin}>
            <div className={styles.moderator} title={members[sessionModerator]?.username}>
              <strong>Moderator: {members[sessionModerator]?.username}</strong>
            </div>
          </div>
          <div className={styles.members}>
            {[...Object.keys(memberVotes).map(k => (
              <div key={k} className={styles.member}>
                <p className={styles['name-container']} title={members[k].username}>
                  {
                    currentUserIsSessionModerator
                    &&
                    <span className={styles['admin-icon']}>
                      {k === sessionModerator ?
                        <RiAdminFill title="Current Moderator" />
                        :
                        <ConfirmationDialog
                          renderTrigger={({ open }) => (
                            <RiAdminLine title="Make Moderator" onClick={open} />
                          )}
                          action={() => actionSenders?.changeModerator(k)}
                          title={`Are you sure you want to make ${members[k].username} the moderator?`}
                          acceptText="Yes"
                          cancelText="Cancel"
                        />
                      }
                    </span>
                  }
                  <span className={styles.name}>{members[k].username}</span>
                </p>
                {getVoteInUi(memberVotes[k])}
              </div>
            ))]}
          </div>
        </div>
        <div className={styles.cards}>
          {votingOptions.map(o => (
            <div
              key={o}
              className={lockedOption === o ? getCssClasses(styles, 'card', 'selected-card') : styles.card}
              id={o.toString()}
              onClick={handleCardClick}>{o}</div>
          ))}
          <div
            key='?'
            className={lockedOption === indicativeVotingOptions.unknown ?
              getCssClasses(styles, 'card', 'special-card', 'selected-card')
              :
              getCssClasses(styles, 'card', 'special-card')
            }
            id={indicativeVotingOptions.unknown.toString()} onClick={handleCardClick}>
            ?
          </div>

        </div>
        <div className={styles.results}>
          <div className={styles.stats}>
            <strong>Voted: {Object
              .values(memberVotes)
              .filter(v => v && v !== indicativeVotingOptions.initial)
              .length
            }</strong>
            <strong>Joined: {Object.keys(members).length}</strong>
          </div>
          <ShowFirstChild inCase={Boolean(resultsAreShown)}>
            <VotingResults memberVotes={memberVotes} />
          </ShowFirstChild>
        </div>
      </div>
    </div>
  );
};

export default VotingSession;