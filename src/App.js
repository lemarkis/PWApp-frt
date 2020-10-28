import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import history from "./utils/history";
import { useAuth0 } from "@auth0/auth0-react";

import Home from './views/Home';
import NavBar from './components/Navbar';
import Loading from './components/Loading';
import { Container } from 'react-bootstrap';

const App = () => {
  const { isLoading, error } = useAuth0();

  if (error) {
    console.log('AppLog ', error);
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router history={history}>
      <NavBar />
      <Container className="mt-5r">
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
