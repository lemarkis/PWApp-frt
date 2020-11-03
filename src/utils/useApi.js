import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef } from "react";
import axios from "axios";

const useApi = (authed = true) => {
  const { getAccessTokenSilently, loginWithRedirect } = useAuth0();
  const api = useRef(
    axios.create({
      baseURL: process.env.REACT_APP_API_URL
    })
  );

  useEffect(() => {
    let reqInterId = 0;
    let resInterId = 0;

    if (authed) {
      reqInterId = api.current.interceptors.request.use(async cfg => {
        const token = await getAccessTokenSilently();
        cfg.headers.authorization = `Bearer ${token}`;
        cfg.cancelToken = axios.CancelToken.source().token;
        return cfg;
      });

      resInterId = api.current.interceptors.response.use(null, async err => {
        console.log(err);
        if (err.config && err.response && err.response.status === 401) {
          await loginWithRedirect({
            redirectUri: window.location.href
          });
        }
        return Promise.reject(err);
      });
    }

    return () => {
      if (authed && reqInterId !== 0 && resInterId !== 0) {
        api.current.interceptors.request.eject(reqInterId);
        api.current.interceptors.response.eject(resInterId);
      }
    };
  });

  return api.current;
}

export default useApi;