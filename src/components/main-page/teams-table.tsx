import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Button, Dialog, DialogTitle, IconButton, withStyles } from '@material-ui/core';
import Team from '../../models/team';
import VisibilityIcon from '@material-ui/icons/Visibility';
import callApi from '../../api/call-api';
import teamApi from '../../api/team';
import { useHistory } from 'react-router';
import useCombinedState from '../../hooks/use-combined-state';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import styles from './teams-table.module.scss';
import { useState } from 'react';
import CheckIcon from '@material-ui/icons/CheckCircle';
import { useDispatch } from 'react-redux';
import { joinPublicTeam, leaveTeam } from '../../redux/actions/team';
import CustomTable, { StyledTableCell } from '../utils/custom-table';
import TeamInvite from '../utils/team-invite';
import ConfirmationDialog from '../utils/confirmation-dialog';
import ShowFirstChild from '../utils/show-first-child';

export interface TeamsTableProps {
  teams: Team[];
}

const emptyTableMessage = 'No Teams Found';
const TeamsTable = ({ teams }: TeamsTableProps) => {

  const history = useHistory();
  const dispatch = useDispatch();

  const [invitePromise, setInvitePromise] = useState<Promise<any> | null>(null);

  const getInvitationLink = (teamId: string) => {
    setInvitePromise(callApi(teamApi.getInvitationLinkUrl(teamId), { method: 'POST' }));
  };

  const handleJoinButton = (clickedTeamId: string) => {
    dispatch(joinPublicTeam(clickedTeamId));
  };

  return (
    <CustomTable className={styles.table} isEmpty={teams.length === 0} emptyTableMessage={emptyTableMessage}>
      <TableBody>
        {teams.map(t => (
          <TableRow key={t.name}>
            <StyledTableCell key="name" align="left">{t.name}</StyledTableCell>
            <StyledTableCell key="actions" align="center">
              <ShowFirstChild inCase={Boolean(t.currentUserIsJoined)}>
                <>
                  <Button classes={{ root: 'mr-3' }} variant="contained" color="primary" onClick={() => history.push(`voting/${t.id}`)}>
                    Start Voting
                  </Button>
                  <Button
                    classes={{ root: 'mr-3' }}
                    variant="outlined" color="primary"
                    onClick={() => getInvitationLink(t.id)}>
                    Invite
                  </Button>
                  <ConfirmationDialog
                    renderTrigger={({ open }) => (
                      <Button
                        classes={{ root: 'mr-3' }} variant="contained" color="secondary"
                        onClick={open}
                      >
                        Leave
                      </Button>
                    )}
                    action={() => dispatch(leaveTeam(t.id))}
                    title={`Are you sure you want to leave team ${t.name}?`}
                    acceptText="Yes"
                    cancelText="Cancel"
                  />
                </>
                <>
                  <Button
                    classes={{ root: 'mr-3' }}
                    variant="contained" color="primary"
                    onClick={() => handleJoinButton(t.id)}>
                    Join
                  </Button>
                </>
              </ShowFirstChild>
              <IconButton onClick={() => history.push(`team/${t.id}`)}>
                <VisibilityIcon />
              </IconButton>
            </StyledTableCell>
          </TableRow>
        ))}
      </TableBody>
      <TeamInvite invitePromise={invitePromise} />
    </CustomTable>
  );
};

export default TeamsTable;
