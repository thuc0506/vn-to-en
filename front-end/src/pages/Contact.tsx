import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    toast({
      title: "Gửi thành công!",
      description: "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.",
    });
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-800 font-nunito mb-6">
            Liên Hệ Với Chúng Tôi
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-nunito leading-relaxed">
            Sẵn sàng hỗ trợ bạn 24/7. Hãy liên hệ với chúng tôi để được tư vấn miễn phí về chương trình học phù hợp.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 font-nunito mb-8">
              Thông Tin Liên Hệ
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-duolingo-blue rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 font-nunito mb-1">Địa chỉ</h3>
                  <p className="text-gray-600 font-nunito">
                    123 Đường Nguyễn Huệ, Quận 1, TP.HCM<br />
                    456 Đường Hoàng Diệu, Quận Hai Bà Trưng, Hà Nội
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-duolingo-green rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 font-nunito mb-1">Điện thoại</h3>
                  <p className="text-gray-600 font-nunito">
                    Hotline: 1900 1234<br />
                    TP.HCM: (028) 1234 5678<br />
                    Hà Nội: (024) 1234 5678
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 font-nunito mb-1">Email</h3>
                  <p className="text-gray-600 font-nunito">
                    info@englishlearning.vn<br />
                    support@englishlearning.vn
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 font-nunito mb-1">Giờ làm việc</h3>
                  <p className="text-gray-600 font-nunito">
                    Thứ 2 - Thứ 6: 8:00 - 22:00<br />
                    Thứ 7 - Chủ nhật: 8:00 - 20:00
                  </p>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="mt-8 bg-gray-200 rounded-2xl h-64 flex items-center justify-center">
              <div className="text-center text-gray-500 font-nunito">
                <MapPin className="h-12 w-12 mx-auto mb-2" />
                <p>Bản đồ Google Maps</p>
                <p className="text-sm">Sẽ được tích hợp trong phiên bản chính thức</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 font-nunito mb-8">
              Gửi Tin Nhắn
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 font-nunito mb-2">
                  Họ và tên *
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full font-nunito"
                  placeholder="Nhập họ và tên của bạn"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 font-nunito mb-2">
                  Email *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full font-nunito"
                  placeholder="Nhập email của bạn"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 font-nunito mb-2">
                  Số điện thoại
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full font-nunito"
                  placeholder="Nhập số điện thoại của bạn"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 font-nunito mb-2">
                  Tin nhắn *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full h-32 font-nunito resize-none"
                  placeholder="Nhập tin nhắn của bạn..."
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-duolingo-green hover:bg-duolingo-green-dark text-white font-nunito font-bold rounded-xl py-3 flex items-center justify-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span>Gửi tin nhắn</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;