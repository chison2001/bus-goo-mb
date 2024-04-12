import axiosClient from '@/utils/axiosClient';

class UserAPI {
  HandleAuthentication = async (
    url: string,
    data?: any,
    method?: 'get' | 'post' | 'put' | 'delete',
  ) => {
    return await axiosClient(`/user${url}`, {
      method: method ?? 'get',
      data,
    });
  };
}

const userAPI = new UserAPI();
export default userAPI;
