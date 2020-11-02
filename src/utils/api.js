import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { Component, useEffect, useRef } from "react";

class API extends Component {
  constructor(props) {
    super(props);
    this._authedApi = useRef(
      axios.create({
        baseURL: process.env.REACT_APP_API_URL
      })
    );
    this._directApi = useRef(
      axios.create({
        baseURL: process.env.REACT_APP_API_URL
      })
    );
  }

  authedApi = () => {
    const { getAccessTokenSilently, loginWithRedirect } = useAuth0();

    useEffect(() => {
      const reqInterId = this._authedApi.interceptors.request.use(async cfg => {
        const token = await getAccessTokenSilently();
        cfg.headers.authorization = `Bearer ${token}`;
        cfg.cancelToken = axios.CancelToken.source().token;
        return cfg;
      });

      const resInterId = this._authedApi.interceptors.response.use(null, async err => {
        console.log('resInter', err, '\n', window.location.href);
        if (err.config && err.response && err.response.status === 401) {
          await loginWithRedirect({
            redirectUri: window.location.href
          });
        }
        return Promise.reject(err);
      });

      return () => {
        this._authedApi.current.interceptors.request.eject(reqInterId);
        this._authedApi.current.interceptors.response.eject(resInterId);
      };
    });

    return this._authedApi.current;
  }

  directApi = () => {
    return this._directApi.current;
  }
}

export default new API();