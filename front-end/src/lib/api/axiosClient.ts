import axios from 'axios';
import requestApi from './requestApi';
import { store } from '@/lib/store';
import { logout } from '@/lib/slices/authSlice';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});


// Thêm interceptor để tự động thêm token vào header
axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // ✅ Gọi API refresh token trực tiếp, cookie HttpOnly tự gửi
        await requestApi('/auth/refresh-token', 'POST');
        // ✅ Gọi lại request gốc
        return axiosClient(originalRequest);
      } catch (err) {
        console.error('Refresh token thất bại:', err);
        store.dispatch(logout()); // Chỉ logout Redux state
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);


export default axiosClient;
