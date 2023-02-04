import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router';
import styles from './ended-session.module.scss';

export interface EndedSessionProps {
  handleRestart: React.MouseEventHandler<HTMLButtonElement>
}

const EndedSession = ({ handleRestart }: EndedSessionProps) => {
  const history = useHistory();
  return (
    <div className={styles.container}>
      <p className={styles.title}>Voting ended</p>
      <Button onClick={handleRestart} variant="contained" color="primary">Restart</Button>
      <Button onClick={() => history.push('/')} variant="outlined" color="primary">Go back</Button>
    </div>
  );
};

export default EndedSession;
