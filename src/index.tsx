import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import reportWebVitals from './reportWebVitals';

import { Auth0Provider } from '@auth0/auth0-react';
import authConfig from './auth/auth_config.json';
import history from "./utils/history";

import './index.scss';


const onRedirectCallback = (appState: any) => {
    console.log('appState: ', appState)
    history.replace(appState?.returnTo || window.location.pathname);
    window.history.replaceState(
        {},
        document.title,
        appState?.returnTo || window.location.pathname
    );
};

ReactDOM.render(
  <React.StrictMode>
      <Auth0Provider
          domain={authConfig.domain}
          clientId={authConfig.clientId}
          audience={authConfig.audience}
          redirectUri={window.location.origin}
          onRedirectCallback={onRedirectCallback}
      >
          <App />
      </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
