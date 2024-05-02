import axios from 'axios';
import queryString from 'query-string';
import {appInfo} from '../constants/appInfos';
import store from '@/redux/store'
import { Alert } from 'react-native';

const axiosClient = axios.create({
  baseURL: appInfo.BASE_URL,
  paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config: any) => {
  const currentState = store.getState();

  const token = currentState.authReducer.authData.token;

  config.headers = {
    Authorization: token ? `Bearer ${token}` : '',
    
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
    Alert.alert("Lỗi", res.data.responseMsg)
    throw new Error(res.data.responseType + ": " + res.data.responseMsg);
  },
  error => {
    console.log(`Error api ${JSON.stringify(error)}`);
    throw new Error(error.response);
  },
);

export default axiosClient;
