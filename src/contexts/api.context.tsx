import React, { createContext, useContext, useEffect } from 'react';
import axios, { AxiosInstance } from "axios";
import { useAuth0 } from '@auth0/auth0-react';

export interface IAPIContext {
  api: AxiosInstance;
}

const APIContext = createContext<IAPIContext>({ api: axios.create() });

export interface APIProviderProps {
  children?: React.ReactNode;
  apiUrl: string | undefined;
}

export const APIProvider = (props: APIProviderProps): JSX.Element => {
  const { children, apiUrl } = props;
  const { isLoading, isAuthenticated, getAccessTokenSilently, loginWithRedirect } = useAuth0();

  const api = axios.create({
    baseURL: apiUrl,
  });

  useEffect(() => {
    let reqInterId = 0;
    let resInterId = 0;

    if (!isLoading && isAuthenticated) {
      reqInterId = api.interceptors.request.use(async cfg => {
        const token = await getAccessTokenSilently();
        cfg.headers.authorization = `Bearer ${token}`;
        cfg.cancelToken = axios.CancelToken.source().token;
        return cfg;
      });
      resInterId = api.interceptors.response.use(undefined, async err => {
        if (err.message.includes('401')) {
          await loginWithRedirect({
            redirectUri: window.location.href,
          });
        }
        return Promise.reject(err);
      });
    }

    return () => {
      if (/* isAuthenticated && */ reqInterId && resInterId) {
        api.interceptors.request.eject(reqInterId);
        api.interceptors.response.eject(resInterId);
      }
    };
  }, [isLoading, api.interceptors.request, api.interceptors.response, getAccessTokenSilently, loginWithRedirect, isAuthenticated]);

  return (
    <APIContext.Provider
      value={{
        api
      }}
    >
      {children}
    </APIContext.Provider>
  );
};

/**
 * ```js
 * const {
 *   api: AxiosInstance
 * } = useApi();
 * ```
 * Use the `useAPI` hook in your component to get a preconfigured axios instance.
 */
export const useAPI = (): IAPIContext => useContext(APIContext);