import { useSelector } from "react-redux"
import { Redirect, Route, RouteProps } from "react-router-dom";
import { User } from "../../models/user"
import { RootState, UserState } from "../../models/state-types"
import { Suspense } from "react";
import Loading from "../utils/loading";

const PrivateRoute = ({ component, ...rest }: any) => {

  const { data: user, isLoggedIn } = useSelector<RootState, UserState>(state => state.user);
  const Component = component;

  return <Route {...rest} render={(props) => user && isLoggedIn ? (
    <Suspense fallback={<Loading />}>
      <Component {...props} />
    </Suspense>
  ) : <Redirect to={{
    pathname: '/login', state: { from: props.location }
  }} />
  } />
};

export default PrivateRoute;