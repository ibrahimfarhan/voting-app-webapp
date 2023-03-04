import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { User } from '../../models/user';
import { Button } from '@material-ui/core';
import ShowFirstChild from '../utils/show-first-child';
import styles from './members-table.module.scss';
import CustomTable, { StyledTableCell } from '../utils/custom-table';
import Team from '../../models/team';
import callApi from '../../api/call-api';
import teamApi from '../../api/team';
import { useDispatch } from 'react-redux';
import { removeMember } from '../../redux/actions/team';
import ConfirmationDialog from '../utils/confirmation-dialog';
import { relocateElementToStart, showAlert } from '../../utils/utils';
import { useState } from 'react';
import Popup from '../utils/popup';

export interface MembersTableProps {
  allMembers: User[]
  isAdmin?: boolean
  adminIds: { [key: string]: boolean }
  teamId: string
  currentUser: User
}

const emptyTableMessage = 'There are no members in this team.'
const MembersTable = ({ allMembers: members, isAdmin, adminIds, teamId, currentUser }: MembersTableProps) => {

  const [variableAdminIds, setAdminIds] = useState(adminIds);
  const currentUserIndex = members.findIndex(m => m.id === currentUser.id);
  relocateElementToStart(members, currentUserIndex);
  const dispatch = useDispatch();
  const handleToggleRole = (userId: string) => {
    const wasAdmin = variableAdminIds[userId];
    callApi(teamApi.toggleRole, {
      method: 'PATCH',
      body: JSON.stringify({ userId, teamId })
    })
      .then(() => {
        const newAdminIds = { ...variableAdminIds };
        if (wasAdmin) delete newAdminIds[userId];
        else newAdminIds[userId] = true;
        setAdminIds(newAdminIds);
      })
      .catch(() => {
        showAlert(dispatch, { type: 'error', content: 'Error while changing user role' });
      })
  };

  const handleRemoveMember = (userId: string) => {
    dispatch(removeMember({ userId, teamId, wasAdmin: variableAdminIds[userId] }))
  };

  return (
    <div className={styles.wrapper}>
      <CustomTable isEmpty={members.length === 0} emptyTableMessage={emptyTableMessage}>
        <TableHead>
          <TableRow>
            <StyledTableCell key="username" align="left"><strong>Username</strong></StyledTableCell>
            <StyledTableCell key="role" align="left"><strong>Role</strong></StyledTableCell>
            <ShowFirstChild inCase={Boolean(isAdmin)}>
              <StyledTableCell key="actions" align="left"><strong>Actions</strong></StyledTableCell>
            </ShowFirstChild>
          </TableRow>
        </TableHead>
        <TableBody>
          {members.map(m => (
            <TableRow key={m.username || m.name}>
              <StyledTableCell key="username">{m.username || m.name}</StyledTableCell>
              <StyledTableCell key="role" align="left">{variableAdminIds[m.id] ? 'Admin' : 'Member'}</StyledTableCell>
              <ShowFirstChild inCase={Boolean(isAdmin)}>
                <StyledTableCell key="actions" align="left">
                  <ShowFirstChild inCase={m.id !== currentUser.id}>
                    <>
                      <Button
                        classes={{ root: 'mr-3' }} variant="contained" color="primary"
                        onClick={() => handleToggleRole(m.id)}
                      >
                        Toggle Role</Button>
                      <ConfirmationDialog
                        renderTrigger={({ open }) => (
                          <Button
                            classes={{ root: 'mr-3' }} variant="contained" color="secondary"
                            onClick={open}
                          >
                            Remove</Button>
                        )}
                        action={() => handleRemoveMember(m.id)}
                        title={`Are you sure you want to remove ${m.username}?`}
                        acceptText="Yes"
                        cancelText="Cancel"
                      />
                    </>
                    <p className={styles.you}>YOU</p>
                  </ShowFirstChild>
                </StyledTableCell>
              </ShowFirstChild>
            </TableRow>
          ))}
        </TableBody>
      </CustomTable>
    </div>
  );
};

export default MembersTable;
