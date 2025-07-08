
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Award, Globe, Play, Star, CheckCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Index = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Học tương tác",
      description: "Bài học đa dạng với video, audio và quiz",
      color: "bg-duolingo-blue"
    },
    {
      icon: Users,
      title: "Cộng đồng học tập",
      description: "Kết nối với người học khác trên toàn thế giới",
      color: "bg-duolingo-purple"
    },
    {
      icon: Award,
      title: "Chứng chỉ",
      description: "Nhận chứng chỉ sau khi hoàn thành khóa học",
      color: "bg-duolingo-yellow"
    },
    {
      icon: Globe,
      title: "Học mọi lúc mọi nơi",
      description: "Truy cập từ mọi thiết bị, mọi nơi",
      color: "bg-duolingo-green"
    }
  ];

  const testimonials = [
    {
      name: "Nguyễn Minh An",
      text: "Ứng dụng tuyệt vời! Tôi đã cải thiện được rất nhiều kỹ năng tiếng Anh.",
      rating: 5
    },
    {
      name: "Trần Thị Hoa",
      text: "Giao diện đẹp, dễ sử dụng và nội dung chất lượng cao.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 font-nunito">
      <Navigation />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 font-nunito">
            Học Tiếng Anh
            <span className="text-duolingo-green"> Chuyên Nghiệp</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed font-nunito font-medium">
            Nền tảng học tiếng Anh trực tuyến hàng đầu với phương pháp giảng dạy 
            hiện đại và đội ngũ giáo viên chuyên nghiệp
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-4 bg-duolingo-green hover:bg-duolingo-green-dark text-white font-nunito font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Play className="mr-2 h-5 w-5" />
              Bắt đầu học ngay
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4 border-2 border-duolingo-blue text-duolingo-blue hover:bg-duolingo-blue hover:text-white font-nunito font-bold rounded-2xl"
            >
              Xem demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900 mb-4 font-nunito">
            Tại sao chọn chúng tôi?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-nunito text-lg font-medium">
            Chúng tôi cung cấp trải nghiệm học tập toàn diện với công nghệ hiện đại
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-100 rounded-2xl overflow-hidden">
              <CardHeader className="pb-4">
                <div className={`mx-auto w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-nunito font-bold text-gray-800">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="font-nunito text-gray-600 font-medium">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-duolingo-green to-duolingo-green-light text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-black mb-2 font-nunito">50,000+</div>
              <div className="text-green-100 font-nunito text-lg font-semibold">Học viên đang học</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2 font-nunito">1,000+</div>
              <div className="text-green-100 font-nunito text-lg font-semibold">Bài học chất lượng</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2 font-nunito">95%</div>
              <div className="text-green-100 font-nunito text-lg font-semibold">Tỷ lệ hài lòng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900 mb-4 font-nunito">
            Học viên nói gì về chúng tôi
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 border-2 border-gray-100 rounded-2xl hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-0">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-duolingo-yellow fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic font-nunito text-lg">"{testimonial.text}"</p>
                <p className="font-bold text-gray-900 font-nunito">- {testimonial.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-duolingo-blue to-duolingo-blue-light text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-black mb-4 font-nunito">
            Sẵn sàng nâng cao trình độ tiếng Anh?
          </h2>
          <p className="text-xl mb-8 text-blue-100 font-nunito font-medium">
            Tham gia cùng hàng nghìn học viên đã thành công trong việc học tiếng Anh
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-4 bg-white hover:bg-gray-100 text-duolingo-blue font-nunito font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Đăng ký miễn phí ngay
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
