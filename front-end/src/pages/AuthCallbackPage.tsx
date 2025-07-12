// AuthCallbackPage.tsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMe } from '@/lib/slices/authSlice';
import { AppDispatch } from '@/lib/store';

const AuthCallbackPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchMe())
      .unwrap()
      .then(() => {
        navigate('/'); // Redirect về home khi đã lấy user
      })
      .catch(() => {
        navigate('/login');
      });
  }, [dispatch, navigate]);

  return <p>Đang xử lý đăng nhập...</p>;
};

export default AuthCallbackPage;
