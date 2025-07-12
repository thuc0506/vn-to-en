import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const requestApi = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body: any = null,
  responseType: 'json' | 'text' | 'blob' | 'arraybuffer' | 'stream' = 'json'
): Promise<AxiosResponse<any>> => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const config: AxiosRequestConfig = {
    method,
    url: `${import.meta.env.VITE_API_URL}${endpoint}`,
    headers,
    responseType,
    data: body,
    withCredentials: true, // ✅ BẮT BUỘC để gửi Cookie (HttpOnly)
  };

  return axios(config);
};

// Các phương thức rút gọn
requestApi.postRequest = (endpoint: string, body: any) =>
  requestApi(endpoint, 'POST', body);
requestApi.getRequest = (endpoint: string) =>
  requestApi(endpoint, 'GET');
requestApi.putRequest = (endpoint: string, body: any) =>
  requestApi(endpoint, 'PUT', body);
requestApi.deleteRequest = (endpoint: string) =>
  requestApi(endpoint, 'DELETE');

export default requestApi;
