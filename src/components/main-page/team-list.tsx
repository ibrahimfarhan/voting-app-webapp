import useReduxAction from "../../hooks/use-redux-action";
import { changeSelectedTeamsType, getMyTeams, getPublicNonJoinedTeams } from "../../redux/actions/team";
import { RootState, TeamsState } from "../../models/state-types";
import { useDispatch, useSelector } from "react-redux";
import { User } from "../../models/user";
import styles from './team-list.module.scss';
import AddIcon from '@material-ui/icons/Add';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useState } from "react";
import TeamForm from "./team-form";
import TeamsTable from "./teams-table";
import Loading from "../utils/loading";
import TabPanel from '../utils/tab-panel';

const actionsMap = {
  joined: getMyTeams,
  nonJoined: getPublicNonJoinedTeams
};

const tabsMap: { [key: string]: string | number } = {
  0: 'joined',
  1: 'nonJoined',
  'joined': 0,
  'nonJoined': 1
};

const TeamList = () => {

  const dispatch = useDispatch();

  const [addFormIsOpen, setAddFormIsOpen] = useState(false);

  const handleTabSwitch = (selectedIndex: number = 0) => {
    if (selectedTeamsType === tabsMap[selectedIndex]) return;
    dispatch(changeSelectedTeamsType(selectedIndex === 0 ? 'joined' : 'nonJoined'));
  };

  const { selectedTeamsType = 'joined' } = useSelector<RootState, TeamsState>(state => state.teams);
  const { data, error, loading, loadingSelectedTeams = true } = useReduxAction<TeamsState>({
    action: actionsMap[selectedTeamsType],
    selector: state => state.teams,
    effectDeps: [selectedTeamsType],
  });

  const user = useSelector<RootState, User>(state => state.user.data as User);

  if (loading || !data || !user) return <Loading />;

  const openAddForm = () => setAddFormIsOpen(true);
  const closeAddForm = () => setAddFormIsOpen(false);

  const targetTeams = Object.values(data).filter(t => selectedTeamsType === 'joined' ? t.currentUserIsJoined : !t.currentUserIsJoined)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Teams</h3>
        <Button
          className={styles['add-btn']}
          color="primary" variant="contained"
          startIcon={<AddIcon />}
          onClick={openAddForm}
        >
          New Team
        </Button>
      </div>
      <TabPanel
        buttonTitles={['My Teams', 'All Public Teams']}
        tabContents={[<TeamsTable teams={targetTeams} />, <TeamsTable teams={targetTeams} />]}
        onTabSwitch={handleTabSwitch}
        loading={loadingSelectedTeams}
        initialSelectedIndex={+tabsMap[selectedTeamsType] || 0}
        stretchTabs={false}
      />
      <Dialog open={addFormIsOpen} onClose={closeAddForm}>
        <DialogTitle><strong>Add New Team</strong></DialogTitle>
        <TeamForm afterSubmitAction={closeAddForm} type='create' isAdmin={true} />
      </Dialog>
    </div>
  );
};

export default TeamList;