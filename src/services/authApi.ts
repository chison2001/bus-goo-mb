import axiosClient from '@/utils/axiosClient';

class AuthAPI {
  HandleAuthentication = async (
    url: string,
    data?: any,
    method?: 'get' | 'post' | 'put' | 'delete',
    params?: any, 
  ) => {
    return await axiosClient(`/auth${url}`, {
      method: method ?? 'get',
      data,
      params,
    });
  };
}

const authenticationAPI = new AuthAPI();
export default authenticationAPI;
