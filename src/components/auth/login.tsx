import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useForm } from 'react-hook-form';
import { login } from "../../redux/actions/user";
import { LoginData, User } from '../../models/user';
import styles from './auth-form.module.scss';
import validationRules, { getValidationMessage, invalidPasswordMsg } from '../../models/validation';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import get from 'lodash/get';
import useDispatchAndSelector from '../../hooks/use-dispatch-and-selector';

const Login = ({ location }: RouteComponentProps) => {

  const { register, handleSubmit, errors } = useForm();

  const [dispatch, user] = useDispatchAndSelector(state => state.user.data)

  const usernameOrEmailRef = register(validationRules.usernameOrEmail);
  const passwordRef = register(validationRules.password);

  const usernameOrEmailError = getValidationMessage(errors, 'usernameOrEmail', validationRules.usernameOrEmail);
  const passwordError = getValidationMessage(errors, 'password', validationRules.password, invalidPasswordMsg);

  const onSubmit = (data: { usernameOrEmail: string, password: string }) => {

    const loginData: LoginData = { password: data.password };

    if (data.usernameOrEmail.includes('@')) loginData.email = data.usernameOrEmail;
    else loginData.username = data.usernameOrEmail;

    dispatch(login(loginData));
  };

  if (user) return <Redirect to={get(location, 'state.from.pathName', '/')} />

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <TextField
        margin="normal"
        className={styles.item}
        inputRef={usernameOrEmailRef}
        id="usernameOrEmail"
        name="usernameOrEmail"
        label="Username or Email"
        type="text"
        helperText={usernameOrEmailError}
        error={Boolean(usernameOrEmailError)}
        required />
      <TextField
        margin="normal" helperText={passwordError} error={Boolean(passwordError)}
        className={styles.item} inputRef={passwordRef} id="password" name="password" label="Password" type="password" required />
      <Button classes={{ root: styles.btn }} color="primary" type="submit" variant="contained">Submit</Button>
    </form>
  );
};

export default Login;