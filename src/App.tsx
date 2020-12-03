import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import history from "./utils/history";
import { useAuth0 } from "@auth0/auth0-react";

import { Notifications } from 'react-push-notification';
import { Container } from 'react-bootstrap';
import NavBar from './components/NavBar';
import Loading from './components/Loading';

import Home from './Home';
import Dashboard from './Dashboard';

export default function App(): JSX.Element {
  const { isLoading, error, isAuthenticated } = useAuth0();
  if (error) {
    console.log('Auth0 error : ', error);
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router history={history}>
      <Notifications position='top-right' />
      <NavBar/>
      <Container className="mt-6r">
        <Switch>
          <Route exact path="/" component={isAuthenticated ? Dashboard : Home} />
        </Switch>
      </Container>
    </Router>
  );
}
