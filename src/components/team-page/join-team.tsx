import { Button } from '@material-ui/core';
import { Redirect, useHistory, useParams } from 'react-router'
import teamApi from '../../api/team';
import useFetch from '../../hooks/use-fetch'
import useReduxAction from '../../hooks/use-redux-action';
import { joinTeam } from '../../redux/actions/team';
import Loading from '../utils/loading';

const JoinTeam = () => {

  const { token } = useParams<{ [key: string]: string }>();
  const { loading } = useReduxAction({
    action: joinTeam,
    actionParams: [token],
    selector: state => state.teams
  });

  if (loading) return <Loading />

  return <Redirect to="/" />;
}

export default JoinTeam
