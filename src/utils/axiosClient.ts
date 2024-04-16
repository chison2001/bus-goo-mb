import axios from 'axios';
import queryString from 'query-string';
import {appInfo} from '../constants/appInfos';
import store from '@/redux/store'

const axiosClient = axios.create({
  baseURL: appInfo.BASE_URL,
  paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config: any) => {
  const currentState = store.getState();

  const token = currentState.authReducer.authData.token;

  config.headers = {
    Authorization: token ? `Bearer ${token}` : '',
    Accept: 'application/json',
    ...config.headers,
  };

  config.data;
  return config;
});

axiosClient.interceptors.response.use(
  res => {
    console.log(res)
    if (res.data.valueReponse !== '' && res.data.respType === 200) {
      return res;
    }
    throw new Error('Error');
  },
  error => {
    console.log(`Error api ${JSON.stringify(error)}`);
    throw new Error(error.response);
  },
);

export default axiosClient;
