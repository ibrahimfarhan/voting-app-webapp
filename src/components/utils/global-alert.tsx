import Alert from '@material-ui/lab/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { GlobalMessage } from '../../models/global-message';
import { RootState } from '../../models/state-types';
import { hideMessage } from '../../redux/actions/global';
import styles from './global-alert.module.scss';

export const GlobalAlert = () => {
  const dispatch = useDispatch();
  const {
    content,
    type = 'info'
  } = useSelector<RootState, GlobalMessage>(state => state.global.message);
  if (!content) return null;
  return (
    <Alert severity={type} className={styles.message} onClose={() => dispatch(hideMessage())}>
      {content}
    </Alert>
  )
};
