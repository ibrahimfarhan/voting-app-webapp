import Login from './login';
import styles from './auth.module.scss';
import TabPanel from '../utils/tab-panel';
import Register from './register';
import { RouteComponentProps } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@material-ui/core';
import apiUrl from '../../api/urls';
import userApi from '../../api/user';

const Auth = (props: RouteComponentProps) => (
  <div className={styles.container}>
    <Button
      color='primary'
      variant='contained'
      startIcon={<FcGoogle />}
      onClick={() => window.location.href = userApi.googleLogin}
    >
      Log in with Google
    </Button>
    <h3>OR</h3>
    <TabPanel buttonTitles={['Log in', 'Register']} tabContents={[
      <Login {...props} />,
      <Register {...props} />
    ]}
    />
  </div>
);

export default Auth;