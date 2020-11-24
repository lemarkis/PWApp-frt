import axios, { AxiosInstance } from 'axios';

class API {
  public instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
    });
  }
}

export default new API().instance;