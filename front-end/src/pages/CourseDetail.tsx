// import { useParams, useNavigate, Link } from "react-router-dom";
// import { BookOpen, Award, User, Clock, Users, Star, CheckCircle, Play, Download, ArrowLeft } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import Navigation from "@/components/Navigation";
// import Footer from "@/components/Footer";

// const CourseDetail = () => {
//   const { courseId } = useParams();
//   const navigate = useNavigate();

//   const courseData: { [key: string]: any } = {
//     'basic': {
//       title: 'Khóa học cơ bản',
//       description: 'Học từ những kiến thức nền tảng nhất về tiếng Anh',
//       longDescription: 'Khóa học tiếng Anh cơ bản được thiết kế dành cho người mới bắt đầu học tiếng Anh. Bạn sẽ được học từ những kiến thức nền tảng nhất như bảng chữ cái, phát âm, từ vựng cơ bản và ngữ pháp căn bản. Khóa học sử dụng phương pháp giảng dạy hiện đại, kết hợp lý thuyết và thực hành để giúp bạn tiếp thu kiến thức một cách hiệu quả nhất.',
//       level: 'Beginner',
//       duration: '3 tháng',
//       students: 1200,
//       rating: 4.8,
//       price: '299,000đ',
//       originalPrice: '399,000đ',
//       image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop',
//       instructor: {
//         name: 'Nguyễn Thị Lan',
//         avatar: '',
//         experience: '5 năm kinh nghiệm',
//         students: 3000,
//         rating: 4.9
//       },
//       features: [
//         'Học từ vựng cơ bản (1000+ từ)',
//         'Ngữ pháp căn bản (12 chủ đề)',
//         'Phát âm chuẩn với IPA',
//         'Luyện nghe nói hàng ngày',
//         'Bài tập thực hành phong phú',
//         'Hỗ trợ 24/7'
//       ],
//       curriculum: [
//         {
//           title: 'Module 1: Làm quen với tiếng Anh',
//           lessons: [
//             'Bảng chữ cái và phát âm cơ bản',
//             'Số đếm và thời gian',
//             'Chào hỏi và giới thiệu bản thân',
//             'Gia đình và bạn bè'
//           ]
//         },
//         {
//           title: 'Module 2: Ngữ pháp cơ bản',
//           lessons: [
//             'Động từ TO BE',
//             'Thì hiện tại đơn',
//             'Đại từ và tính từ sở hữu',
//             'Câu hỏi WH-questions'
//           ]
//         },
//         {
//           title: 'Module 3: Giao tiếp hàng ngày',
//           lessons: [
//             'Mua sắm và thanh toán',
//             'Đặt đồ ăn tại nhà hàng',
//             'Hỏi đường và chỉ đường',
//             'Nói về sở thích'
//           ]
//         }
//       ]
//     },
//     'advanced': {
//       title: 'Khóa học nâng cao',
//       description: 'Nâng cao trình độ tiếng Anh với các bài học chuyên sâu',
//       longDescription: 'Khóa học tiếng Anh nâng cao dành cho những học viên đã có nền tảng tiếng Anh và muốn phát triển kỹ năng cao hơn. Khóa học tập trung vào việc cải thiện kỹ năng nghe, nói, đọc, viết ở mức độ phức tạp hơn, với các chủ đề đa dạng từ kinh doanh đến học thuật.',
//       level: 'Intermediate',
//       duration: '4 tháng',
//       students: 890,
//       rating: 4.9,
//       price: '499,000đ',
//       originalPrice: '699,000đ',
//       image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop',
//       instructor: {
//         name: 'John Smith',
//         avatar: '',
//         experience: '8 năm kinh nghiệm',
//         students: 2500,
//         rating: 4.9
//       },
//       features: [
//         'Ngữ pháp nâng cao (20+ chủ đề)',
//         'Từ vựng chuyên ngành (2000+ từ)',
//         'Writing skills (Essays, Reports)',
//         'Business English',
//         'Presentation skills',
//         'Mock interviews'
//       ],
//       curriculum: [
//         {
//           title: 'Module 1: Advanced Grammar',
//           lessons: [
//             'Complex sentence structures',
//             'Advanced tenses and aspects',
//             'Conditional sentences',
//             'Reported speech'
//           ]
//         },
//         {
//           title: 'Module 2: Business English',
//           lessons: [
//             'Meeting and presentations',
//             'Email writing',
//             'Negotiation skills',
//             'Business vocabulary'
//           ]
//         },
//         {
//           title: 'Module 3: Academic Writing',
//           lessons: [
//             'Essay structure and organization',
//             'Research and citation',
//             'Academic vocabulary',
//             'Critical thinking'
//           ]
//         }
//       ]
//     },
//     'ielts': {
//       title: 'Khóa luyện thi IELTS',
//       description: 'Chuẩn bị tốt nhất cho kỳ thi IELTS với điểm số mong muốn',
//       longDescription: 'Khóa học luyện thi IELTS được thiết kế chuyên biệt để giúp học viên đạt được band điểm mong muốn trong kỳ thi IELTS. Khóa học bao gồm chiến lược làm bài cho cả 4 kỹ năng: Listening, Reading, Writing và Speaking, cùng với hàng trăm bài tập thực hành và mock test.',
//       level: 'Advanced',
//       duration: '6 tháng',
//       students: 650,
//       rating: 4.9,
//       price: '799,000đ',
//       originalPrice: '999,000đ',
//       image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
//       instructor: {
//         name: 'Sarah Johnson',
//         avatar: '',
//         experience: '10 năm kinh nghiệm IELTS',
//         students: 1800,
//         rating: 4.9
//       },
//       features: [
//         '4 kỹ năng IELTS (Listening, Reading, Writing, Speaking)',
//         'Mock test hàng tuần',
//         'Phân tích đề thi chi tiết',
//         'Chiến lược làm bài hiệu quả',
//         'Feedback cá nhân hóa',
//         'Cam kết đầu ra 6.5+'
//       ],
//       curriculum: [
//         {
//           title: 'IELTS Listening',
//           lessons: [
//             'Understanding different accents',
//             'Note-taking strategies',
//             'Multiple choice techniques',
//             'Map and diagram completion'
//           ]
//         },
//         {
//           title: 'IELTS Reading',
//           lessons: [
//             'Skimming and scanning',
//             'True/False/Not Given',
//             'Matching headings',
//             'Summary completion'
//           ]
//         },
//         {
//           title: 'IELTS Writing',
//           lessons: [
//             'Task 1: Graphs and charts',
//             'Task 2: Essay writing',
//             'Coherence and cohesion',
//             'Lexical resource'
//           ]
//         },
//         {
//           title: 'IELTS Speaking',
//           lessons: [
//             'Part 1: Introduction',
//             'Part 2: Long turn',
//             'Part 3: Discussion',
//             'Pronunciation and fluency'
//           ]
//         }
//       ]
//     },
//     'toeic': {
//       title: 'Khóa luyện thi TOEIC',
//       description: 'Đạt điểm cao TOEIC cho cơ hội việc làm tốt hơn',
//       longDescription: 'Khóa học luyện thi TOEIC tập trung vào việc cải thiện điểm số TOEIC Listening & Reading. Khóa học cung cấp các chiến lược làm bài hiệu quả, từ vựng chuyên ngành và hàng nghìn câu hỏi thực hành để giúp bạn đạt điểm số mong muốn.',
//       level: 'Intermediate',
//       duration: '4 tháng',
//       students: 740,
//       rating: 4.7,
//       price: '699,000đ',
//       originalPrice: '899,000đ',
//       image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop',
//       instructor: {
//         name: 'Michael Chen',
//         avatar: '',
//         experience: '7 năm kinh nghiệm TOEIC',
//         students: 2200,
//         rating: 4.8
//       },
//       features: [
//         'Reading strategies (Part 5-7)',
//         'Listening skills (Part 1-4)',
//         'Vocabulary building (1500+ từ)',
//         'Test practice (10+ mock tests)',
//         'Time management',
//         'Cam kết 750+ điểm'
//       ],
//       curriculum: [
//         {
//           title: 'TOEIC Listening',
//           lessons: [
//             'Part 1: Photographs',
//             'Part 2: Question-Response',
//             'Part 3: Conversations',
//             'Part 4: Short Talks'
//           ]
//         },
//         {
//           title: 'TOEIC Reading',
//           lessons: [
//             'Part 5: Incomplete Sentences',
//             'Part 6: Text Completion',
//             'Part 7: Single Passages',
//             'Part 7: Double Passages'
//           ]
//         },
//         {
//           title: 'Vocabulary & Grammar',
//           lessons: [
//             'Business vocabulary',
//             'Grammar patterns',
//             'Collocations',
//             'Word families'
//           ]
//         }
//       ]
//     },
//     'one-on-one': {
//       title: 'Khóa học 1:1',
//       description: 'Học riêng với giáo viên, tiến độ cá nhân hóa',
//       longDescription: 'Khóa học 1:1 cung cấp trải nghiệm học tập cá nhân hóa hoàn toàn. Bạn sẽ được học trực tiếp với giáo viên có kinh nghiệm, với nội dung và tiến độ được điều chỉnh theo nhu cầu và mục tiêu cụ thể của bạn.',
//       level: 'All levels',
//       duration: 'Linh hoạt',
//       students: 320,
//       rating: 5.0,
//       price: '200,000đ/buổi',
//       originalPrice: '250,000đ/buổi',
//       image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=400&fit=crop',
//       instructor: {
//         name: 'Đội ngũ giáo viên',
//         avatar: '',
//         experience: 'Giáo viên native & Việt Nam',
//         students: 500,
//         rating: 5.0
//       },
//       features: [
//         'Lịch học linh hoạt (7 ngày/tuần)',
//         'Nội dung cá nhân hóa 100%',
//         'Giáo viên chuyên nghiệp',
//         'Theo dõi tiến độ chi tiết',
//         'Feedback tức thì',
//         'Hỗ trợ ngoài giờ học'
//       ],
//       curriculum: [
//         {
//           title: 'Đánh giá đầu vào',
//           lessons: [
//             'Test trình độ',
//             'Xác định mục tiêu',
//             'Lập kế hoạch học tập',
//             'Chọn giáo viên phù hợp'
//           ]
//         },
//         {
//           title: 'Học tập cá nhân hóa',
//           lessons: [
//             'Nội dung theo nhu cầu',
//             'Tốc độ học phù hợp',
//             'Feedback liên tục',
//             'Điều chỉnh kế hoạch'
//           ]
//         },
//         {
//           title: 'Theo dõi & đánh giá',
//           lessons: [
//             'Progress report',
//             'Test định kỳ',
//             'Tư vấn cải thiện',
//             'Celebration milestones'
//           ]
//         }
//       ]
//     }
//   };

//   const course = courseData[courseId || ''];

//   if (!course) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-800 mb-4">Khóa học không tồn tại</h1>
//           <Button asChild>
//             <Link to="/courses">Quay lại danh sách khóa học</Link>
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   const getLevelBadgeColor = (level: string) => {
//     switch (level) {
//       case 'Beginner': return 'bg-green-100 text-green-800';
//       case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
//       case 'Advanced': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
//       {/* <Navigation /> */}
//       {/* Breadcrumb */}
//       <div className="bg-white border-b">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <Link to="/courses" className="hover:text-duolingo-blue flex items-center gap-1">
//               <ArrowLeft className="h-4 w-4" />
//               Khóa học
//             </Link>
//             <span>/</span>
//             <span className="text-gray-800 font-medium">{course.title}</span>
//           </div>
//         </div>
//       </div>

//       {/* Hero Section */}
//       <section className="py-12">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Main Content */}
//             <div className="lg:col-span-2">
//               <div className="mb-6">
//                 <Badge className={getLevelBadgeColor(course.level)}>
//                   {course.level}
//                 </Badge>
//               </div>
              
//               <h1 className="text-4xl font-bold text-gray-800 mb-4 font-nunito">
//                 {course.title}
//               </h1>
              
//               <p className="text-xl text-gray-600 mb-6 font-nunito">
//                 {course.description}
//               </p>

//               <div className="flex items-center gap-6 mb-8 text-sm text-gray-600">
//                 <div className="flex items-center gap-1">
//                   <Clock className="h-4 w-4" />
//                   <span>{course.duration}</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Users className="h-4 w-4" />
//                   <span>{course.students} học viên</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                   <span>{course.rating} ({course.students} đánh giá)</span>
//                 </div>
//               </div>

//               <img 
//                 src={course.image} 
//                 alt={course.title}
//                 className="w-full h-64 object-cover rounded-lg shadow-lg mb-8"
//               />
//             </div>

//             {/* Sidebar */}
//             <div className="lg:col-span-1">
//               <Card className="sticky top-8">
//                 <CardHeader>
//                   <div className="text-center">
//                     <div className="flex items-center justify-center gap-2 mb-2">
//                       <span className="text-2xl text-gray-400 line-through">{course.originalPrice}</span>
//                       <span className="text-3xl font-bold text-duolingo-blue font-nunito">{course.price}</span>
//                     </div>
//                     <Badge className="bg-red-100 text-red-800">Giảm giá 25%</Badge>
//                   </div>
//                 </CardHeader>
                
//                 <CardContent className="space-y-4">
//                   <Button 
//                     size="lg" 
//                     className="w-full bg-duolingo-green hover:bg-duolingo-green-dark text-white font-nunito font-bold rounded-xl"
//                     onClick={() => navigate(`/courses/${courseId}/lessons`)}
//                   >
//                     Bắt Đầu Học
//                   </Button>
                  
//                   <Button 
//                     variant="outline" 
//                     size="lg" 
//                     className="w-full border-duolingo-blue text-duolingo-blue hover:bg-duolingo-blue hover:text-white font-nunito font-bold rounded-xl"
//                   >
//                     Học thử miễn phí
//                   </Button>

//                   <div className="border-t pt-4">
//                     <h4 className="font-semibold mb-3">Khóa học bao gồm:</h4>
//                     <div className="space-y-2">
//                       {course.features.map((feature: string, index: number) => (
//                         <div key={index} className="flex items-center gap-2 text-sm">
//                           <CheckCircle className="h-4 w-4 text-duolingo-green" />
//                           <span>{feature}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Instructor Info */}
//                   <div className="border-t pt-4">
//                     <h4 className="font-semibold mb-3">Giảng viên</h4>
//                     <div className="flex items-center gap-3">
//                       <div className="w-12 h-12 bg-duolingo-blue rounded-full flex items-center justify-center text-white font-bold">
//                         {course.instructor.name.split(' ').map((n: string) => n[0]).join('')}
//                       </div>
//                       <div>
//                         <div className="font-medium">{course.instructor.name}</div>
//                         <div className="text-sm text-gray-600">{course.instructor.experience}</div>
//                         <div className="text-sm text-gray-600">
//                           {course.instructor.students} học viên • ⭐ {course.instructor.rating}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Course Details */}
//       <section className="py-12">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-2">
//               <Tabs defaultValue="overview" className="w-full">
//                 <TabsList className="grid w-full grid-cols-3">
//                   <TabsTrigger value="overview">Tổng quan</TabsTrigger>
//                   <TabsTrigger value="curriculum">Chương trình</TabsTrigger>
//                   <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
//                 </TabsList>
                
//                 <TabsContent value="overview" className="mt-6">
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Về khóa học này</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <p className="text-gray-600 leading-relaxed font-nunito">
//                         {course.longDescription}
//                       </p>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>
                
//                 <TabsContent value="curriculum" className="mt-6">
//                   <div className="space-y-4">
//                     {course.curriculum.map((module: any, index: number) => (
//                       <Card key={index}>
//                         <CardHeader>
//                           <CardTitle className="text-lg">{module.title}</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="space-y-3">
//                             {module.lessons.map((lesson: string, lessonIndex: number) => (
//                               <div key={lessonIndex} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
//                                 <Play className="h-4 w-4 text-duolingo-blue" />
//                                 <span>{lesson}</span>
//                                 <div className="ml-auto text-sm text-gray-500">15 phút</div>
//                               </div>
//                             ))}
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </div>
//                 </TabsContent>
                
//                 <TabsContent value="reviews" className="mt-6">
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Đánh giá từ học viên</CardTitle>
//                       <div className="flex items-center gap-4">
//                         <div className="text-3xl font-bold">{course.rating}</div>
//                         <div>
//                           <div className="flex text-yellow-400">
//                             {[...Array(5)].map((_, i) => (
//                               <Star key={i} className="h-5 w-5 fill-current" />
//                             ))}
//                           </div>
//                           <div className="text-sm text-gray-600">{course.students} đánh giá</div>
//                         </div>
//                       </div>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-6">
//                         {[1, 2, 3].map((_, index) => (
//                           <div key={index} className="border-b pb-6 last:border-b-0">
//                             <div className="flex items-start gap-4">
//                               <div className="w-10 h-10 bg-duolingo-green rounded-full flex items-center justify-center text-white font-bold">
//                                 N
//                               </div>
//                               <div className="flex-1">
//                                 <div className="flex items-center gap-2 mb-2">
//                                   <span className="font-medium">Nguyễn Văn A</span>
//                                   <div className="flex text-yellow-400">
//                                     {[...Array(5)].map((_, i) => (
//                                       <Star key={i} className="h-4 w-4 fill-current" />
//                                     ))}
//                                   </div>
//                                 </div>
//                                 <p className="text-gray-600">
//                                   Khóa học rất bổ ích, giảng viên dạy rất dễ hiểu. Tôi đã cải thiện được rất nhiều sau khi học xong khóa này.
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>
//               </Tabs>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* <Footer /> */}
//     </div>
//   );
// };

// export default CourseDetail;