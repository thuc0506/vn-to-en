import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Search, ArrowLeft, Headphones, BookOpen, Mic, MessageSquare, FileText, Users } from "lucide-react";

const CourseLessons = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

  // Hình ảnh và icon phù hợp cho từng loại chủ đề
  const topicTypeAssets = {
    pronunciation: {
      image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&h=400&fit=crop",
      icon: <Mic className="h-6 w-6 text-primary" />
    },
    vocabulary: {
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop",
      icon: <BookOpen className="h-6 w-6 text-primary" />
    },
    conversation: {
      image: "https://images.unsplash.com/photo-1541178735493-479c1a27ed24?w=800&h=400&fit=crop",
      icon: <MessageSquare className="h-6 w-6 text-primary" />
    },
    grammar: {
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop",
      icon: <FileText className="h-6 w-6 text-primary" />
    },
    listening: {
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=400&fit=crop",
      icon: <Headphones className="h-6 w-6 text-primary" />
    },
    speaking: {
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=400&fit=crop",
      icon: <Mic className="h-6 w-6 text-primary" />
    },
    default: {
      image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&h=400&fit=crop",
      icon: <BookOpen className="h-6 w-6 text-primary" />
    }
  };

  const courseLessonsData = {
    "basic": {
      title: "Khóa Học Tiếng Anh Cơ Bản",
      subtitle: "Chọn chủ đề phù hợp với trình độ của bạn",
      totalTime: "45 phút",
      topics: [
        {
          id: 1,
          title: "Alphabet & Pronunciation",
          description: "Học bảng chữ cái và cách phát âm cơ bản",
          level: "A1",
          totalLessons: 50,
          type: "pronunciation", // Thêm trường type để xác định hình ảnh
          lessons: [
            { id: 1, title: "First snowfall", duration: "21 parts", vocabLevel: "A1", completed: false },
            { id: 2, title: "Jessica's first day of school", duration: "25 parts", vocabLevel: "A1", completed: false },
            { id: 3, title: "My flower garden", duration: "19 parts", vocabLevel: "A1", completed: false },
            { id: 4, title: "Going camping", duration: "22 parts", vocabLevel: "A1", completed: false },
            { id: 5, title: "My house", duration: "21 parts", vocabLevel: "A1", completed: false },
            { id: 6, title: "My first pet", duration: "21 parts", vocabLevel: "A1", completed: false },
            { id: 7, title: "Jennifer the firefighter", duration: "17 parts", vocabLevel: "A1", completed: false },
            { id: 8, title: "Mark's big game", duration: "20 parts", vocabLevel: "A1", completed: false },
            { id: 9, title: "The Easter Egg Hunt", duration: "23 parts", vocabLevel: "A1", completed: false },
            { id: 10, title: "Joe's first car", duration: "21 parts", vocabLevel: "A1", completed: false },
            { id: 11, title: "Summer vacation", duration: "23 parts", vocabLevel: "A1", completed: false },
            { id: 12, title: "Cleaning up leaves", duration: "24 parts", vocabLevel: "A1", completed: false },
            { id: 13, title: "Susan's wedding day", duration: "21 parts", vocabLevel: "A1", completed: false },
            { id: 14, title: "Remembrance Day", duration: "15 parts", vocabLevel: "A1", completed: false },
            { id: 15, title: "Halloween Night", duration: "29 parts", vocabLevel: "A1", completed: false },
            { id: 16, title: "Christmas Eve", duration: "26 parts", vocabLevel: "A1", completed: false },
            { id: 17, title: "Thanksgiving", duration: "24 parts", vocabLevel: "A1", completed: true },
            { id: 18, title: "Learning how to drive", duration: "18 parts", vocabLevel: "A1", completed: false },
            { id: 19, title: "Housework", duration: "28 parts", vocabLevel: "A1", completed: false },
            { id: 20, title: "Working outside", duration: "25 parts", vocabLevel: "A1", completed: true }
          ]
        },
        {
          id: 2,
          title: "Basic Vocabulary",
          description: "Từ vựng cơ bản trong cuộc sống hàng ngày",
          level: "A1",
          totalLessons: 80,
          type: "vocabulary",
          lessons: [
            { id: 1, title: "Chào hỏi và tự giới thiệu", duration: "20 parts", vocabLevel: "A1", completed: false },
            { id: 2, title: "Gia đình và bạn bè", duration: "25 parts", vocabLevel: "A1", completed: false },
            { id: 3, title: "Màu sắc và hình dạng", duration: "15 parts", vocabLevel: "A1", completed: false },
            { id: 4, title: "Số đếm từ 1-100", duration: "20 parts", vocabLevel: "A1", completed: false },
            { id: 5, title: "Ngày tháng và thời gian", duration: "30 parts", vocabLevel: "A1", completed: false },
            { id: 6, title: "Thức ăn và đồ uống", duration: "25 parts", vocabLevel: "A1", completed: false },
            { id: 7, title: "Quần áo và phụ kiện", duration: "25 parts", vocabLevel: "A1", completed: false },
            { id: 8, title: "Nhà cửa và đồ dùng", duration: "30 parts", vocabLevel: "A1", completed: false },
            { id: 9, title: "Phương tiện giao thông", duration: "20 parts", vocabLevel: "A1", completed: false },
            { id: 10, title: "Ôn tập từ vựng tổng hợp", duration: "25 parts", vocabLevel: "A1", completed: false }
          ]
        },
        {
          id: 3,
          title: "Simple Conversations",
          description: "Các cuộc hội thoại đơn giản cho người mới bắt đầu",
          level: "A1-A2",
          totalLessons: 60,
          type: "conversation",
          lessons: [
            { id: 1, title: "Chào hỏi và làm quen", duration: "15 parts", vocabLevel: "A1", completed: false },
            { id: 2, title: "Hỏi đường và chỉ đường", duration: "20 parts", vocabLevel: "A1", completed: false },
            { id: 3, title: "Mua sắm cơ bản", duration: "25 parts", vocabLevel: "A1", completed: false },
            { id: 4, title: "Đặt bàn ở nhà hàng", duration: "20 parts", vocabLevel: "A1", completed: false },
            { id: 5, title: "Nói về sở thích", duration: "25 parts", vocabLevel: "A1", completed: false },
            { id: 6, title: "Nói về thời tiết", duration: "15 parts", vocabLevel: "A1", completed: false },
            { id: 7, title: "Hẹn gặp và sắp xếp", duration: "20 parts", vocabLevel: "A1", completed: false },
            { id: 8, title: "Nói về công việc", duration: "25 parts", vocabLevel: "A1", completed: false }
          ]
        }
      ]
    },
    "advanced": {
      title: "Khóa Học Tiếng Anh Nâng Cao",
      subtitle: "Chọn chủ đề phù hợp với trình độ của bạn",
      totalTime: "75 phút",
      topics: [
        {
          id: 1,
          title: "Advanced Vocabulary",
          description: "Từ vựng học thuật và chuyên ngành",
          level: "C1-C2",
          totalLessons: 120,
          type: "conversation",
          lessons: [
            { id: 1, title: "Academic vocabulary - Science", duration: "35 parts", vocabLevel: "C1", completed: false },
            { id: 2, title: "Academic vocabulary - Economics", duration: "40 parts", vocabLevel: "C1", completed: false },
            { id: 3, title: "Medical terminology", duration: "45 parts", vocabLevel: "C2", completed: false },
            { id: 4, title: "Legal vocabulary", duration: "40 parts", vocabLevel: "C1", completed: false },
            { id: 5, title: "Technology vocabulary", duration: "35 parts", vocabLevel: "C1", completed: false },
            { id: 6, title: "Advanced idioms and phrasal verbs", duration: "45 parts", vocabLevel: "C2", completed: false },
            { id: 7, title: "Academic collocations", duration: "40 parts", vocabLevel: "C1", completed: false },
            { id: 8, title: "Advanced synonyms and antonyms", duration: "35 parts", vocabLevel: "C1", completed: false }
          ]
        }
      ]
    },
    "ielts": {
      title: "Khóa Học IELTS",
      subtitle: "Chọn chủ đề phù hợp với trình độ của bạn",
      totalTime: "90 phút",
      topics: [
        {
          id: 1,
          title: "IELTS Listening",
          description: "Luyện thi nghe IELTS với các dạng bài đầy đủ",
          level: "B1-C2",
          totalLessons: 100,
          type: "vocabulary",
          lessons: [
            { id: 1, title: "Section 1: Personal information", duration: "25 parts", vocabLevel: "B1", completed: false },
            { id: 2, title: "Section 1: Booking and service information", duration: "25 parts", vocabLevel: "B1", completed: false },
            { id: 3, title: "Section 2: Local information", duration: "30 parts", vocabLevel: "B2", completed: false },
            { id: 4, title: "Section 2: Events and activities", duration: "30 parts", vocabLevel: "B2", completed: false },
            { id: 5, title: "Section 3: Academic discussions", duration: "35 parts", vocabLevel: "C1", completed: false }
          ]
        }
      ]
    },
    "toeic": {
      title: "Khóa Học TOEIC",
      subtitle: "Chọn chủ đề phù hợp với trình độ của bạn",
      totalTime: "60 phút",
      topics: [
        {
          id: 1,
          title: "TOEIC Listening",
          description: "Luyện thi Listening TOEIC theo từng Part",
          level: "B1-C1",
          totalLessons: 85,
          type: "pronunciation", // Thêm trường type để xác định hình ảnh
          lessons: [
            { id: 1, title: "Part 1: Photo description practice", duration: "20 parts", vocabLevel: "B1", completed: false },
            { id: 2, title: "Part 1: Advanced photo analysis", duration: "25 parts", vocabLevel: "B2", completed: false },
            { id: 3, title: "Part 2: Question-response basics", duration: "30 parts", vocabLevel: "B1", completed: false }
          ]
        }
      ]
    },
    "one-on-one": {
      title: "Khóa Học 1:1",
      subtitle: "Chọn chủ đề phù hợp với trình độ của bạn",
      totalTime: "120 phút",
      topics: [
        {
          id: 1,
          title: "Personalized Learning",
          description: "Học tập cá nhân hóa theo nhu cầu riêng",
          level: "A1-C2",
          totalLessons: 150,
          type: "vocabulary",
          lessons: [
            { id: 1, title: "Assessment and goal setting", duration: "30 parts", vocabLevel: "B1", completed: false },
            { id: 2, title: "Customized vocabulary building", duration: "45 parts", vocabLevel: "B2", completed: false },
            { id: 3, title: "Grammar focus areas", duration: "40 parts", vocabLevel: "B1", completed: false }
          ]
        }
      ]
    }
  };

  const courseData = courseLessonsData[courseId as keyof typeof courseLessonsData];

  // Lấy thông tin hình ảnh và icon phù hợp cho topic
  const getTopicAssets = (topicType: string) => {
    return topicTypeAssets[topicType as keyof typeof topicTypeAssets] || topicTypeAssets.default;
  };

  if (!courseData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-center">Khóa học không tồn tại</h1>
        </div>
        <Footer />
      </div>
    );
  }

  const filteredTopics = courseData.topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === "all" || topic.level.includes(levelFilter.toUpperCase());
    return matchesSearch && matchesLevel;
  });

  const selectedTopicData = selectedTopic ? courseData.topics.find(t => t.id === selectedTopic) : null;

  const filteredLessons = selectedTopicData ? selectedTopicData.lessons.filter(lesson => {
    return lesson.title.toLowerCase().includes(searchTerm.toLowerCase());
  }) : [];

  // If a topic is selected, show lessons view
  if (selectedTopic && selectedTopicData) {
    return (
      <div className="min-h-screen bg-background">
        {/* <Navigation /> */}

        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => setSelectedTopic(null)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {selectedTopicData.title}
            </h1>
            <p className="text-xl text-muted-foreground">
              {selectedTopicData.description}
            </p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Tìm kiếm chủ đề..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Lessons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {filteredLessons.map((lesson, index) => (
              <Card
                key={lesson.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-200 border border-border/50 hover:border-primary/30"
                // onClick={() => navigate(`/courses/${courseId}/topics/${selectedTopic}/lessons/${lesson.id}`)}
                // onClick={() => navigate(`/courses/${courseId}/lessons/${lesson.id}`)}
                onClick={() => navigate(`/courses/${courseId}/lessons/${lesson.id}`, { state: { lessons: selectedTopicData.lessons } })}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-lg font-bold text-primary min-w-[2.5rem]">
                        {index + 1}.
                      </span>
                      <div className="flex-1">
                        <h4 className="text-base font-medium text-card-foreground group-hover:text-primary transition-colors leading-tight mb-2">
                          {lesson.title}
                        </h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-1">
                            <span>{lesson.duration}</span>
                            <span>•</span>
                            <span>Vocab level: {lesson.vocabLevel}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {lesson.completed && (
                      <Star className="h-4 w-4 text-blue-500 fill-current flex-shrink-0 mt-1" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Default view - show topics with consistent image styling
  return (
    <div className="min-h-screen bg-background">
      {/* <Navigation /> */}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {courseData.title}
          </h1>
          <p className="text-xl text-muted-foreground">
            {courseData.subtitle}
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Tìm kiếm chủ đề..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Topics Section - All with images */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Tất cả chủ đề</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => {
              const assets = getTopicAssets(topic.type || "default");
              return (
                <Card 
                  key={topic.id} 
                  className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300"
                  onClick={() => setSelectedTopic(topic.id)}
                >
                  {/* Image Section */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={assets.image}
                      alt={topic.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="text-xs">
                        {topic.level}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3 bg-background/80 rounded-full p-2 backdrop-blur-sm">
                      {assets.icon}
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {topic.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-foreground">
                        {topic.totalLessons} bài học
                      </div>
                      <Button 
                        variant="default"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTopic(topic.id);
                        }}
                      >
                        Bắt đầu học
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default CourseLessons;