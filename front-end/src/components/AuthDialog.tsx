
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';  // Đường dẫn tùy dự án bạn
import { register, login, googleLogin} from '@/lib/slices/authSlice';


interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
  onLogin?: () => void; // Callback khi đăng nhập thành công
}


const AuthDialog = ({ open, onOpenChange, mode, onModeChange, onLogin }: AuthDialogProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  });

  // Redux hooks
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, user } = useSelector((state: RootState) => state.auth);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (mode === 'login') {
    await dispatch(login({ email: formData.email, password: formData.password }))
      .unwrap()
      .then(() => {
        onLogin?.();
        onOpenChange(false);
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          username: ''
        });
      })
      .catch((err) => {
        console.error('Đăng nhập thất bại:', err);
      });
  } else {
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    await dispatch(register({
      email: formData.email,
      password: formData.password,
      username: formData.username
    }))
      .unwrap()
      .then(() => {
        onLogin?.();
        onOpenChange(false);
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          username: ''
        });
      })
      .catch((err) => {
        console.error('Đăng ký thất bại:', err);
      });
  }
};


const handleSocialLogin = (provider: 'google' | 'facebook') => {
  if (provider === 'google') {
    // Chuyển hướng sang backend để login Google OAuth
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  } else {
    alert('Hiện tại chỉ hỗ trợ Google Login');
  }
};





  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl border-2 font-nunito">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center font-black font-nunito text-gray-800">
            {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </DialogTitle>
          <DialogDescription className="text-center font-nunito text-gray-600 font-medium text-lg">
            {mode === 'login'
              ? 'Chào mừng bạn trở lại!'
              : 'Tạo tài khoản để bắt đầu hành trình học tiếng Anh'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Social Login Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full h-14 border-2 hover:bg-gray-50 font-nunito font-bold text-gray-700 rounded-2xl"
              onClick={() => handleSocialLogin('google')}
            >
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Tiếp tục với Google
            </Button>

            <Button
              variant="outline"
              className="w-full h-14 border-2 hover:bg-gray-50 font-nunito font-bold text-gray-700 rounded-2xl"
              onClick={() => handleSocialLogin('facebook')}
            >
              <svg className="w-6 h-6 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Tiếp tục với Facebook
            </Button>
          </div>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-muted-foreground font-nunito font-semibold">
              hoặc
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="username" className="font-nunito font-bold text-gray-700">Họ và tên</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Nhập họ và tên"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  className="h-12 rounded-2xl border-2 font-nunito"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="font-nunito font-bold text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Nhập email của bạn"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="h-12 rounded-2xl border-2 font-nunito"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-nunito font-bold text-gray-700">Mật khẩu</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="h-12 rounded-2xl border-2 font-nunito pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-nunito font-bold text-gray-700">Xác nhận mật khẩu</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="h-12 rounded-2xl border-2 font-nunito"
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-duolingo-green hover:bg-duolingo-green-dark text-white font-nunito font-bold rounded-2xl text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              {loading ? 'Đang xử lý...' : (mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản')}
            </Button>

            {error && <p className="text-red-500 text-center mt-2">{error}</p>}

          </form>

          <div className="text-center text-sm font-nunito">
            {mode === 'login' ? (
              <>
                Chưa có tài khoản?{' '}
                <button
                  className="text-duolingo-blue hover:text-duolingo-blue-dark font-bold hover:underline"
                  onClick={() => onModeChange('register')}
                >
                  Đăng ký ngay
                </button>
              </>
            ) : (
              <>
                Đã có tài khoản?{' '}
                <button
                  className="text-duolingo-blue hover:text-duolingo-blue-dark font-bold hover:underline"
                  onClick={() => onModeChange('login')}
                >
                  Đăng nhập
                </button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;