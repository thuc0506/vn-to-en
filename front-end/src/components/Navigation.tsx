
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, BookOpen, User, Settings, LogOut, BookmarkIcon, Award } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AuthDialog from "./AuthDialog";

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { logout, apiLogout } from '@/lib/slices/authSlice';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Sử dụng useDispatch để lấy hàm dispatch từ Redux store
  const dispatch = useDispatch<AppDispatch>();

  // Lấy thông tin người dùng từ Redux store
  const { user } = useSelector((state: RootState) => state.auth);

  // Kiểm tra xem người dùng đã đăng nhập hay chưa
  const isLoggedIn = Boolean(user);


  // Hàm xử lý khi người dùng nhấn nút đăng nhập hoặc đăng ký
  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthDialog(true);
  };


  // Hàm xử lý đăng xuất
 const handleLogout = async () => {
  try {
    await dispatch(apiLogout()).unwrap();  // Gọi API backend để clear cookie + Redis
    dispatch(logout());                    // Clear Redux/localStorage FE
  } catch (err) {
    console.error("Logout failed", err);
  }
};


  // Component hiển thị menu người dùng
  const ProfileMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
          
            <AvatarFallback className="bg-duolingo-blue text-white font-semibold">
             {user?.username?.split(" ").map((n: string) => n[0]).join("")}

            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-white" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
               
                <AvatarFallback className="bg-duolingo-green text-white font-semibold text-lg">
                  {user?.username?.split(" ").map((n: string) => n[0]).join("")}

                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-base font-bold text-gray-900">{user?.username}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Award className="h-4 w-4 text-duolingo-green" />
                  <span className="text-xs font-semibold text-duolingo-green">{user?.level}</span>
                  <span className="text-xs text-gray-500">• {user?.progress}%</span>
                </div>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-3 h-4 w-4" />
          <span>Hồ sơ cá nhân</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <BookmarkIcon className="mr-3 h-4 w-4" />
          <span>Bài học đã lưu</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Award className="mr-3 h-4 w-4" />
          <span>Thành tích</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-3 h-4 w-4" />
          <span>Cài đặt</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleLogout}>
          <LogOut className="mr-3 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b-2 border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-duolingo-blue to-duolingo-green rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-gray-800 font-nunito">English Learning</span>
                <span className="text-xs text-duolingo-blue font-nunito font-semibold -mt-1">📚 Học tiếng Anh chuyên nghiệp</span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-duolingo-green transition-colors font-nunito font-semibold">
                Trang chủ
              </Link>

              {/* Dropdown Menu for Khóa học */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-gray-700 hover:text-duolingo-green transition-colors font-nunito font-semibold p-0 h-auto">
                    Khóa học
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white" align="start">
                  <DropdownMenuItem className="cursor-pointer">
                    <BookOpen className="mr-3 h-4 w-4 text-duolingo-blue" />
                    <span>Khóa học cơ bản</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <BookOpen className="mr-3 h-4 w-4 text-duolingo-green" />
                    <span>Khóa học nâng cao</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Award className="mr-3 h-4 w-4 text-yellow-500" />
                    <span>Khóa luyện thi IELTS</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Award className="mr-3 h-4 w-4 text-blue-500" />
                    <span>Khóa luyện thi TOEIC</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-3 h-4 w-4 text-purple-500" />
                    <span>Khóa học 1:1</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/about-us" className="text-gray-700 hover:text-duolingo-green transition-colors font-nunito font-semibold">
                Về chúng tôi
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-duolingo-green transition-colors font-nunito font-semibold">
                Liên hệ
              </Link>
            </div>

            {/* Auth Buttons / Profile Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <ProfileMenu />
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleAuthClick('login')}
                    className="border-2 border-duolingo-blue text-duolingo-blue hover:bg-duolingo-blue hover:text-white font-nunito font-bold rounded-xl px-6"
                  >
                    Đăng nhập
                  </Button>
                  <Button
                    onClick={() => handleAuthClick('register')}
                    className="bg-duolingo-green hover:bg-duolingo-green-dark text-white font-nunito font-bold rounded-xl px-6"
                  >
                    Đăng ký
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden py-4 space-y-4 border-t">
              <Link to="/" className="block text-gray-700 hover:text-duolingo-green font-nunito font-semibold py-2">
                Trang chủ
              </Link>
              <Link to="#" className="block text-gray-700 hover:text-duolingo-green font-nunito font-semibold py-2">
                Khóa học
              </Link>
              <Link to="/about-us" className="block text-gray-700 hover:text-duolingo-green font-nunito font-semibold py-2">
                Về chúng tôi
              </Link>
              <Link to="/contact" className="block text-gray-700 hover:text-duolingo-green font-nunito font-semibold py-2">
                Liên hệ
              </Link>

              {isLoggedIn ? (
                // Hiển thị Profile Menu nếu đã đăng nhập
                <ProfileMenu />
              ) : (
                <div className="flex flex-col space-y-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleAuthClick('login')}
                    className="border-2 border-duolingo-blue text-duolingo-blue hover:bg-duolingo-blue hover:text-white font-nunito font-bold rounded-xl"
                  >
                    Đăng nhập
                  </Button>
                  <Button
                    onClick={() => handleAuthClick('register')}
                    className="bg-duolingo-green hover:bg-duolingo-green-dark text-white font-nunito font-bold rounded-xl"
                  >
                    Đăng ký
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        mode={authMode}
        onModeChange={setAuthMode}
        
      />
    </>
  );
};

export default Navigation;
