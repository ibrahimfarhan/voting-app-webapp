import CircularProgress from '@material-ui/core/CircularProgress';
import styles from './loading.module.scss';

const Loading = () => {
  return (
      <div className={styles.spinner}>
        <CircularProgress />
      </div>
  )
}

export default Loading
