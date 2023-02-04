import React, { useEffect, useState } from 'react';
import { createMuiTheme, Theme, ThemeProvider } from '@material-ui/core';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import useReduxAction from '../../hooks/use-redux-action';
import { getCurrentUser } from '../../redux/actions/user';
import Auth from '../auth/auth';
import PrivateRoute from '../auth/private-route';
import MuiHeader from '../layout/mui-header';
import Loading from '../utils/loading';
import { GlobalAlert } from '../utils/global-alert';
import { getMuiTheme, toggleDarkMode } from '../layout/styles';
import Footer from '../layout/footer';
import styles from './root.module.scss';

const TeamList = React.lazy(() => import('../main-page/team-list'));
const JoinTeam = React.lazy(() => import('../team-page/join-team'));
const TeamDetails = React.lazy(() => import('../team-page/team-details'));
const VotingSession = React.lazy(() => import('../voting-page/voting-session'));
const NotFound = React.lazy(() => import('../utils/not-found'));

const Root = () => {

  const initialDarkModeState = localStorage.getItem('darkModeIsEnabled') === 'true';
  const [
    darkModeIsEnabled,
    setDarkModeActivation
  ] = useState<boolean>(initialDarkModeState);

  useEffect(() => {
    toggleDarkMode(initialDarkModeState);
    setMuiTheme(getMuiTheme(initialDarkModeState))
  }, []);

  const [muiTheme, setMuiTheme] = useState<Theme | null>(null);
  const handleThemeChange = () => {
    toggleDarkMode(!darkModeIsEnabled);
    localStorage.setItem('darkModeIsEnabled', (!darkModeIsEnabled).toString());
    setMuiTheme(getMuiTheme(!darkModeIsEnabled))
    setDarkModeActivation(!darkModeIsEnabled);
  };

  const { loading } = useReduxAction({ action: getCurrentUser, selector: state => state.user });
  if (loading || !muiTheme) return <Loading />
  return (
    <ThemeProvider theme={muiTheme}>
      <Router>
        <MuiHeader onThemeChange={handleThemeChange} darkModeIsEnabled={darkModeIsEnabled} />
        <div className={styles.content}>
          <Switch>
            <PrivateRoute exact path="/" component={TeamList} />
            <Route path="/login" component={Auth}></Route>
            <PrivateRoute exact path="/team/:teamId" component={TeamDetails}></PrivateRoute>
            <PrivateRoute exact path="/team/join/:token" component={JoinTeam}></PrivateRoute>
            <PrivateRoute exact path="/voting/:teamId" component={VotingSession}></PrivateRoute>
            <Route component={NotFound}></Route>
          </Switch>
        </div>
      </Router>
      <GlobalAlert />
      <Footer />
    </ThemeProvider>
  );
};

export default Root;
