import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import useReduxAction from "../../hooks/use-redux-action";
import { RootState, TeamsState, UserState } from "../../models/state-types";
import { deleteTeam, getTeam, updateTeam } from "../../redux/actions/team";
import EditableOnClick from "../utils/editable-on-click";
import IconButton from "@material-ui/core/IconButton";
import MembersTable from "./members-table";
import validationRules, { getValidationMessage } from "../../models/validation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import Popup from "../utils/popup";
import DeleteIcon from '@material-ui/icons/Delete';
import ShowFirstChild from "../utils/show-first-child";
import Loading from "../utils/loading";
import styles from "./team-details.module.scss";
import ConfirmationDialog from '../utils/confirmation-dialog';
import callApi from "../../api/call-api";
import teamApi from "../../api/team";
import useCombinedState from "../../hooks/use-combined-state";
import Team from "../../models/team";
import { Button, Checkbox, FormControlLabel, FormGroup } from "@material-ui/core";
import { arrayToObj } from "../../utils/utils";
import { useForm } from "react-hook-form";
import TeamForm from "../main-page/team-form";

interface TeamState {
  team?: Team
  loading?: boolean
  teamApiError?: string
}

const TeamDetails = () => {

  const history = useHistory();
  const dispatch = useDispatch();
  const { teamId } = useParams<{ [key: string]: string; }>();
  const [{ team, loading = true }, setTeamState] = useCombinedState<TeamState>({});
  useEffect(() => {
    callApi(teamApi.getUrl(teamId))
      .then((res) => {
        setTeamState({ loading: false, team: res });
      })
      .catch(() => {
        setTeamState({ loading: false, teamApiError: 'Error while fetching team' });
      });
  }, [teamId]);

  const { data: currentUser, loading: loadingUser } = useSelector<RootState, UserState>(state => state.user);

  if (loading || loadingUser || !currentUser) return <Loading />;

  if (!team) {
    history.push('/');
    return null;
  }

  const { admins = [], members = [] } = team;
  const adminIds = arrayToObj(admins, 'id');
  const isAdmin = adminIds[currentUser?.id || ''];
  const membersForTable = admins.concat(members);

  return (
    <div className={styles.team}>
      <h3 className={styles.title}>General</h3>
      <div className={styles['form-wrapper']}>
        <TeamForm className={styles['team-form']} type='update' team={team} isAdmin={isAdmin} />
      </div>
      <h3 className={styles.title}>Members</h3>
      <MembersTable
        teamId={team.id}
        allMembers={membersForTable || []}
        adminIds={adminIds}
        isAdmin={isAdmin}
        currentUser={currentUser}
      />
    </div >
  );
};

export default TeamDetails;