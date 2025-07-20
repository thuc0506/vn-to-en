import { Link } from "react-router-dom";
import { BookOpen, Award, User, Clock, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Courses = () => {
  const courses = [
    {
      id: 'basic',
      title: 'Tiếng Anh Cơ Bản Online',
      description: 'Khóa học online từ A-Z cho người mới bắt đầu với video bài giảng tương tác',
      level: 'Beginner',
      duration: '3 tháng',
      students: 2500,
      rating: 4.8,
      price: '199,000đ',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop',
      features: ['120+ video bài giảng', 'Học từ vựng qua flashcard', 'Bài tập tương tác', 'Phát âm AI correction'],
      icon: BookOpen,
      color: 'text-blue-500'
    },
    {
      id: 'conversation',
      title: 'Giao Tiếp Tiếng Anh',
      description: 'Luyện nói tiếng Anh thông qua các tình huống thực tế hàng ngày',
      level: 'Intermediate',
      duration: '4 tháng',
      students: 1800,
      rating: 4.9,
      price: '299,000đ',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=250&fit=crop',
      features: ['Luyện nói với AI', 'Video call nhóm', 'Tình huống thực tế', 'Speaking club hàng tuần'],
      icon: User,
      color: 'text-green-500'
    },
    {
      id: 'business',
      title: 'Tiếng Anh Thương Mại',
      description: 'Tiếng Anh chuyên nghiệp cho môi trường công sở và kinh doanh',
      level: 'Intermediate',
      duration: '5 tháng',
      students: 950,
      rating: 4.8,
      price: '399,000đ',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop',
      features: ['Email và thư từ', 'Thuyết trình chuyên nghiệp', 'Đàm phán kinh doanh', 'Từ vựng chuyên ngành'],
      icon: Award,
      color: 'text-purple-500'
    },
    {
      id: 'ielts',
      title: 'Luyện Thi IELTS Online',
      description: 'Khóa học IELTS toàn diện với đề thi thật và chấm điểm tự động',
      level: 'Advanced',
      duration: '6 tháng',
      students: 1200,
      rating: 4.9,
      price: '599,000đ',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop',
      features: ['Đề thi IELTS mới nhất', 'Chấm điểm tự động', 'Speaking practice với AI', 'Phân tích lỗi chi tiết'],
      icon: Award,
      color: 'text-yellow-500'
    },
    {
      id: 'kids',
      title: 'Tiếng Anh Cho Trẻ Em',
      description: 'Khóa học vui nhộn với game và hoạt động tương tác cho trẻ 6-12 tuổi',
      level: 'Kids',
      duration: '4 tháng',
      students: 3200,
      rating: 4.9,
      price: '149,000đ',
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=250&fit=crop',
      features: ['Game học tập', 'Hoạt hình giáo dục', 'Bài hát tiếng Anh', 'Sticker thưởng'],
      icon: User,
      color: 'text-pink-500'
    },
    {
      id: 'one-on-one',
      title: 'Gia Sư 1:1 Online',
      description: 'Học riêng với giáo viên bản ngữ qua video call, lịch học linh hoạt',
      level: 'All levels',
      duration: 'Linh hoạt',
      students: 450,
      rating: 5.0,
      price: '150,000đ/buổi',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=250&fit=crop',
      features: ['Giáo viên bản ngữ', 'Lịch học tự chọn', 'Tài liệu cá nhân hóa', 'Báo cáo tiến độ hàng tuần'],
      icon: User,
      color: 'text-blue-600'
    }
  ];

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      case 'Kids': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navigation />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-duolingo-blue to-duolingo-green text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 font-nunito">
            Khóa Học Tiếng Anh Chuyên Nghiệp
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto font-nunito">
            Từ cơ bản đến nâng cao, từ giao tiếp đến luyện thi. Chúng tôi có đầy đủ các khóa học 
            phù hợp với mọi trình độ và mục tiêu của bạn.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold">5000+</div>
              <div className="text-sm opacity-90">Học viên</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold">15+</div>
              <div className="text-sm opacity-90">Giáo viên</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold">4.8★</div>
              <div className="text-sm opacity-90">Đánh giá</div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 font-nunito">
              Chọn Khóa Học Phù Hợp Với Bạn
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto font-nunito">
              Mỗi khóa học được thiết kế riêng biệt để đáp ứng nhu cầu học tập khác nhau
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => {
              const IconComponent = course.icon;
              return (
                <Card key={course.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={getLevelBadgeColor(course.level)}>
                        {course.level}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                      <IconComponent className={`h-5 w-5 ${course.color}`} />
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-bold text-gray-800 font-nunito group-hover:text-duolingo-blue transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 font-nunito">
                      {course.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {/* Course Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{course.students}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{course.rating}</span>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-2">
                        {course.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-duolingo-green rounded-full"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Price and Button */}
                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-duolingo-blue font-nunito">
                            {course.price}
                          </div>
                          <Button 
                            asChild
                            className="bg-duolingo-green hover:bg-duolingo-green-dark text-white font-nunito font-bold rounded-xl"
                          >
                            <Link to={`/courses/${course.id}/lessons`}>
                              Học ngay
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 font-nunito">
            Chưa Chắc Chắn Khóa Học Nào Phù Hợp?
          </h2>
          <p className="text-gray-600 mb-8 font-nunito">
            Tham gia buổi tư vấn miễn phí với chuyên gia của chúng tôi
          </p>
          <Button 
            asChild
            size="lg"
            className="bg-duolingo-blue hover:bg-duolingo-blue-dark text-white font-nunito font-bold rounded-xl px-8"
          >
            <Link to="/contact">
              Đăng ký tư vấn miễn phí
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Courses;