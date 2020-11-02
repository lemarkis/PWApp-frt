import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import history from "./utils/history";
import { useAuth0 } from "@auth0/auth0-react";

import NavBar from './components/Navbar';
import Loading from './components/Loading';
import { Container } from 'react-bootstrap';

import Home from './Home';
import Test from './Test';

const App = () => {
  const { isLoading, error } = useAuth0();

  if (error) {
    console.log('AppLog : ', error);
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router history={history}>
      <NavBar />
      <Container className="mt-6r">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/test" component={Test} />
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
