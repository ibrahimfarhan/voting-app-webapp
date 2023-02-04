import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useForm } from 'react-hook-form';
import { register as registerAction } from "../../redux/actions/user";
import { RegisterData } from '../../models/user';
import styles from './auth-form.module.scss';
import validationRules, { getValidationMessage, invalidPasswordMsg } from '../../models/validation';
import { Redirect, RouteComponentProps, RouteProps, RouterProps } from 'react-router-dom';
import get from 'lodash/get';
import useDispatchAndSelector from '../../hooks/use-dispatch-and-selector';

const Register = ({ location }: RouteComponentProps) => {

  const { register, handleSubmit, errors } = useForm({ reValidateMode: 'onChange' });

  const [dispatch, user] = useDispatchAndSelector(state => state.user.data)

  const usernameRef = register(validationRules.username);
  const emailRef = register(validationRules.email);
  const passwordRef = register(validationRules.password);

  const usernameError = getValidationMessage(errors, 'username', validationRules.username);
  const emailError = getValidationMessage(errors, 'email', validationRules.email);
  const passwordError = getValidationMessage(errors, 'password', validationRules.password, invalidPasswordMsg);

  const onSubmit = (data: RegisterData) => {
    dispatch(registerAction(data));
  };

  if (user) return <Redirect to={get(location, 'state.from.pathName', '/')} />

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <TextField helperText={usernameError} error={Boolean(usernameError)}
        margin="normal" className={styles.item} inputRef={usernameRef} id="username" name="username" label="Username" type="text" required />
      <TextField helperText={emailError} error={Boolean(emailError)}
        margin="normal" className={styles.item} inputRef={emailRef} id="email" name="email" label="Email" type="email" required />
      <TextField helperText={passwordError} error={Boolean(passwordError)}
        margin="normal" className={styles.item} inputRef={passwordRef} id="password" name="password" label="Password" type="password" required />
      <Button classes={{ root: styles.btn }} color="primary" type="submit" variant="contained">Submit</Button>
    </form>
  );
};

export default Register;