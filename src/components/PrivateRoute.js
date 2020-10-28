import { Route } from 'react-router-dom';
import { withAuthenticationRequired } from "@auth0/auth0-react";

export const PrivateRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest} component={withAuthenticationRequired(component,
      { onRedirecting: () => <Loading /> })} />
  );
}