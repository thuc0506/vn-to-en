import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Users, Target, Award, BookOpen } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-800 font-nunito mb-6">
            Về Chúng Tôi
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-nunito leading-relaxed">
            Chúng tôi là đội ngũ giáo viên chuyên nghiệp, tận tâm giúp học viên chinh phục tiếng Anh một cách hiệu quả và thú vị nhất.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-duolingo-blue rounded-xl flex items-center justify-center mr-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 font-nunito">Sứ Mệnh</h2>
            </div>
            <p className="text-gray-600 font-nunito leading-relaxed">
              Mang đến phương pháp học tiếng Anh hiện đại, hiệu quả và phù hợp với từng đối tượng học viên. 
              Chúng tôi cam kết giúp mỗi học viên đạt được mục tiêu ngôn ngữ của mình.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-duolingo-green rounded-xl flex items-center justify-center mr-4">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 font-nunito">Tầm Nhìn</h2>
            </div>
            <p className="text-gray-600 font-nunito leading-relaxed">
              Trở thành trung tâm tiếng Anh hàng đầu tại Việt Nam, được tin tưởng bởi chất lượng giảng dạy 
              và sự thành công của học viên trong các kỳ thi quốc tế.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-duolingo-blue to-duolingo-green rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 font-nunito mb-3">Đội Ngũ Chuyên Nghiệp</h3>
            <p className="text-gray-600 font-nunito">
              100% giáo viên có chứng chỉ quốc tế và kinh nghiệm giảng dạy nhiều năm
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-duolingo-green to-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 font-nunito mb-3">Phương Pháp Hiện Đại</h3>
            <p className="text-gray-600 font-nunito">
              Kết hợp công nghệ và phương pháp giảng dạy tiên tiến từ các nước phát triển
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 font-nunito mb-3">Cam Kết Chất Lượng</h3>
            <p className="text-gray-600 font-nunito">
              Đảm bảo 95% học viên đạt mục tiêu trong thời gian cam kết
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-800 font-nunito mb-12">
            Thành Tích Của Chúng Tôi
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-black text-duolingo-blue font-nunito mb-2">5000+</div>
              <div className="text-gray-600 font-nunito">Học viên đã tin tưởng</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-duolingo-green font-nunito mb-2">95%</div>
              <div className="text-gray-600 font-nunito">Tỷ lệ đạt mục tiêu</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-yellow-500 font-nunito mb-2">8+</div>
              <div className="text-gray-600 font-nunito">Năm kinh nghiệm</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-orange-500 font-nunito mb-2">50+</div>
              <div className="text-gray-600 font-nunito">Giáo viên chuyên nghiệp</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;