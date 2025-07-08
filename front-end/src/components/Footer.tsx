import { GraduationCap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-duolingo-blue to-duolingo-green rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-bold font-nunito">English Learning</h3>
                <span className="text-xs text-blue-300 font-nunito font-semibold -mt-1">📚 Học tiếng Anh chuyên nghiệp</span>
              </div>
            </div>
            <p className="text-gray-400 font-nunito">
              Nền tảng học tiếng Anh trực tuyến chuyên nghiệp hàng đầu Việt Nam
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 font-nunito text-lg">Khóa học</h4>
            <ul className="space-y-2 text-gray-400 font-nunito">
              <li>Tiếng Anh cơ bản</li>
              <li>Tiếng Anh giao tiếp</li>
              <li>IELTS</li>
              <li>TOEIC</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 font-nunito text-lg">Hỗ trợ</h4>
            <ul className="space-y-2 text-gray-400 font-nunito">
              <li>Trung tâm trợ giúp</li>
              <li>Liên hệ</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 font-nunito text-lg">Theo dõi chúng tôi</h4>
            <ul className="space-y-2 text-gray-400 font-nunito">
              <li>Facebook</li>
              <li>YouTube</li>
              <li>Instagram</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 font-nunito">
          <p>&copy; 2024 English Learning. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;