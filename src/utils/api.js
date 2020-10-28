import { useRef, useEffect } from 'react';
import axios from "axios";
import { useAuth0 } from '@auth0/auth0-react';

export default () => {
  const { getAccessTokenSilently, loginWithRedirect } = useAuth0();
  const api = useRef(
    axios.create({
      baseURL: process.env.REACT_APP_API_URL
    })
  );

  useEffect(() => {
    const reqInterId = api.current.interceptors.request.use(async cfg => {
      const token = await getAccessTokenSilently();
      cfg.headers.authorization = `Bearer ${token}`;
      cfg.cancelToken = axios.CancelToken.source().token;
      return cfg;
    });

    const resInterId = api.current.interceptors.response.use(null, async err => {
      if (err.config && err.response && err.response.status === 401) {
        await loginWithRedirect({
          redirectUri: window.location.origin
        });
      }
      return Promise.reject(err);
    });
    
    return () => {
      api.current.interceptors.request.eject(reqInterId);
      api.current.interceptors.response.eject(resInterId);
    };
  });

  return api.current;
}