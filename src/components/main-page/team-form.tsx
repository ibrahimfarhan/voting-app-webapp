import { Button, Checkbox, FormControlLabel, TextField } from '@material-ui/core'
import { useForm } from 'react-hook-form';
import styles from './team-form.module.scss';
import validationRules, { getValidationMessage } from '../../models/validation';
import { useDispatch, useSelector } from 'react-redux';
import { createTeam, deleteTeam, updateTeam } from '../../redux/actions/team';
import { RootState, TeamsState } from '../../models/state-types';
import { useEffect, useState } from 'react';
import useCombinedState from '../../hooks/use-combined-state';
import Team from '../../models/team';
import ShowFirstChild from '../utils/show-first-child';
import { showMessage } from '../../redux/actions/global';
import callApi from '../../api/call-api';
import teamApi from '../../api/team';
import { showAlert } from '../../utils/utils';
import ConfirmationDialog from '../utils/confirmation-dialog';
import { useHistory } from 'react-router';

type TeamFormProps = {
  afterSubmitAction?: () => void
  className?: string
  type: 'create' | 'update'
  team?: Team
  isAdmin?: boolean
};

const TeamForm = ({
  afterSubmitAction,
  className,
  team = { id: '', name: '' },
  type,
  isAdmin = false
}: TeamFormProps) => {

  const dispatch = useDispatch();
  const history = useHistory();

  const [updatedTeam, setUpdatedTeam] = useState({ name: team.name, isPublic: team.isPublic });
  const [checked, setChecked] = useState(updatedTeam.isPublic);
  const { register, handleSubmit, errors } = useForm({ reValidateMode: 'onBlur', mode: 'onBlur' });
  const nameRef = register(validationRules.teamName);
  const nameError = getValidationMessage(errors, 'name', validationRules.teamName);
  const { data: teams = {} } = useSelector<RootState, TeamsState>(state => state.teams);

  const teamsAsArray = Object.values(teams);

  const onSubmit = (formData: { name: string, isPublic: boolean }) => {
    const { name, isPublic } = formData;

    if (type === 'create') {
      if (teamsAsArray.find(t => t.name === name)) {
        showAlert(dispatch, { type: 'error', content: 'Team name already exists' });
        return;
      }

      dispatch(createTeam({ name, isPublic }))
      if (afterSubmitAction) afterSubmitAction();
      return
    }

    if (updatedTeam.name === name && updatedTeam.isPublic === isPublic) return;

    callApi(teamApi.getUrl(team.id), { method: 'PATCH', body: JSON.stringify({ name, isPublic }) })
      .then((team) => {
        setUpdatedTeam(team);
        showAlert(dispatch, { content: 'Saved Changes', type: 'success' })
      })
      .catch(err => showAlert(dispatch, { content: err.message, type: 'error' }));
    if (afterSubmitAction) afterSubmitAction();
  };

  const handleDeleteTeam = () => {
    dispatch(deleteTeam(team.id));
    history.push('/');
  };

  return (
    <form className={styles.form + ' ' + className} onSubmit={handleSubmit(onSubmit)}>
      <TextField
        margin="normal"
        className={styles.input}
        inputRef={nameRef}
        id="name"
        name="name"
        label="Name"
        type="text"
        helperText={nameError}
        error={Boolean(nameError)}
        defaultValue={team.name}
        disabled={!isAdmin}
        required
      />
      <FormControlLabel
        className={styles.last}
        label='Public'
        control={
          <Checkbox
            inputRef={register}
            name='isPublic'
            color='primary'
            checked={checked}
            onChange={isAdmin ? () => setChecked(!checked) : undefined}
          />
        }
        labelPlacement='end'
      />
      <ShowFirstChild inCase={isAdmin}>
        <div className={styles.btns}>
          <Button
            className={styles.btn}
            variant="contained"
            color="primary"
            type="submit"
          >
            Save
          </Button>
          <ShowFirstChild inCase={type === 'update'}>
            <ConfirmationDialog
              renderTrigger={({ open }) => (
                <Button
                  className={styles.delete}
                  color="secondary"
                  onClick={open}
                  variant='contained'
                >
                  Delete
                </Button>
              )}
              action={handleDeleteTeam}
              title={`Are you sure you want to delete team ${updatedTeam.name}?`}
              acceptText="Yes"
              cancelText="Cancel"
            />
          </ShowFirstChild>
        </div>
      </ShowFirstChild>
    </form>
  )
}

export default TeamForm
