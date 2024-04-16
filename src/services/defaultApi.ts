import axiosClient from '@/utils/axiosClient';

class DefaultAPI {
  HandleAPI = async (
    url: string,
    data?: any,
    method?: 'get' | 'post' | 'put' | 'delete',
    params?: any,
  ) => {
    return await axiosClient(`${url}`, {
      method: method ?? 'get',
      data,
      params,
    });
  };
}

const defaultAPI = new DefaultAPI();
export default defaultAPI;
