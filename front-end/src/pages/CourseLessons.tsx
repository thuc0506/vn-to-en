import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Star, Play, Clock, ChevronDown, Search } from "lucide-react";

const CourseLessons = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  const courseLessonsData = {
    "basic": {
      title: "Khóa Học Tiếng Anh Cơ Bản",
      totalTime: "45 phút",
      topics: [
        {
          id: 1,
          title: "Alphabet & Pronunciation",
          description: "Học bảng chữ cái và cách phát âm cơ bản",
          level: "A1",
          lessonsCount: 50,
          image: "https://images.unsplash.com/photo-1590402494756-2c1c4ff5fffe?w=400&h=200&fit=crop",
          type: "audio",
          category: "pronunciation"
        },
        {
          id: 2,
          title: "Basic Vocabulary",
          description: "Từ vựng cơ bản trong cuộc sống hàng ngày",
          level: "A1",
          lessonsCount: 80,
          image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop",
          type: "interactive",
          category: "vocabulary"
        },
        {
          id: 3,
          title: "Simple Conversations",
          description: "Các cuộc hội thoại đơn giản cho người mới bắt đầu",
          level: "A1-A2",
          lessonsCount: 60,
          image: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=400&h=200&fit=crop",
          type: "audio",
          category: "conversation"
        },
        {
          id: 4,
          title: "Basic Grammar",
          description: "Ngữ pháp cơ bản: thì hiện tại, quá khứ đơn giản",
          level: "A1-A2",
          lessonsCount: 70,
          image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=200&fit=crop",
          type: "interactive",
          category: "grammar"
        }
      ]
    },
    "advanced": {
      title: "Khóa Học Tiếng Anh Nâng Cao",
      totalTime: "75 phút",
      topics: [
        {
          id: 1,
          title: "Advanced Vocabulary",
          description: "Từ vựng học thuật và chuyên ngành",
          level: "C1-C2",
          lessonsCount: 150,
          image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop",
          type: "interactive",
          category: "vocabulary"
        },
        {
          id: 2,
          title: "Complex Grammar",
          description: "Ngữ pháp phức tạp và cấu trúc câu nâng cao",
          level: "C1-C2",
          lessonsCount: 100,
          image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=200&fit=crop",
          type: "interactive",
          category: "grammar"
        },
        {
          id: 3,
          title: "Academic Listening",
          description: "Nghe hiểu bài giảng đại học và hội thảo",
          level: "C1-C2",
          lessonsCount: 80,
          image: "https://images.unsplash.com/photo-1590402494756-2c1c4ff5fffe?w=400&h=200&fit=crop",
          type: "audio",
          category: "academic"
        },
        {
          id: 4,
          title: "Critical Thinking",
          description: "Phát triển tư duy phản biện qua tiếng Anh",
          level: "C1-C2",
          lessonsCount: 90,
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop",
          type: "interactive",
          category: "critical"
        }
      ]
    },
    "ielts": {
      title: "Khóa Học IELTS",
      totalTime: "90 phút",
      topics: [
        {
          id: 1,
          title: "IELTS Listening",
          description: "Luyện thi nghe IELTS với các dạng bài đầy đủ",
          level: "B1-C2",
          lessonsCount: 120,
          image: "https://images.unsplash.com/photo-1590402494756-2c1c4ff5fffe?w=400&h=200&fit=crop",
          type: "audio",
          category: "listening"
        },
        {
          id: 2,
          title: "IELTS Reading",
          description: "Các kỹ thuật đọc hiểu và làm bài Reading",
          level: "B1-C2",
          lessonsCount: 100,
          image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop",
          type: "interactive",
          category: "reading"
        },
        {
          id: 3,
          title: "IELTS Writing Task 1",
          description: "Viết biểu đồ, bảng, quy trình cho Task 1",
          level: "B1-C2",
          lessonsCount: 80,
          image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=200&fit=crop",
          type: "interactive",
          category: "writing"
        },
        {
          id: 4,
          title: "IELTS Writing Task 2",
          description: "Viết luận argumentative và discussion",
          level: "B1-C2",
          lessonsCount: 90,
          image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=200&fit=crop",
          type: "interactive",
          category: "writing"
        },
        {
          id: 5,
          title: "IELTS Speaking",
          description: "Luyện tập 3 part Speaking với AI",
          level: "B1-C2",
          lessonsCount: 110,
          image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=400&h=200&fit=crop",
          type: "audio",
          category: "speaking"
        }
      ]
    },
    "toeic": {
      title: "Khóa Học TOEIC",
      totalTime: "60 phút",
      topics: [
        {
          id: 1,
          title: "TOEIC Listening Part 1-2",
          description: "Luyện Part 1 (Photos) và Part 2 (Questions)",
          level: "A2-C1",
          lessonsCount: 150,
          image: "https://images.unsplash.com/photo-1590402494756-2c1c4ff5fffe?w=400&h=200&fit=crop",
          type: "audio",
          category: "listening"
        },
        {
          id: 2,
          title: "TOEIC Listening Part 3-4",
          description: "Luyện Part 3 (Conversations) và Part 4 (Talks)",
          level: "A2-C1",
          lessonsCount: 180,
          image: "https://images.unsplash.com/photo-1590402494756-2c1c4ff5fffe?w=400&h=200&fit=crop",
          type: "audio",
          category: "listening"
        },
        {
          id: 3,
          title: "TOEIC Reading Part 5-6",
          description: "Ngữ pháp và điền từ vào đoạn văn",
          level: "A2-C1",
          lessonsCount: 200,
          image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=200&fit=crop",
          type: "interactive",
          category: "grammar"
        },
        {
          id: 4,
          title: "TOEIC Reading Part 7",
          description: "Đọc hiểu văn bản đơn và đôi",
          level: "A2-C1",
          lessonsCount: 160,
          image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop",
          type: "interactive",
          category: "reading"
        },
        {
          id: 5,
          title: "TOEIC Vocabulary",
          description: "Từ vựng chuyên ngành cho TOEIC",
          level: "A2-C1",
          lessonsCount: 120,
          image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop",
          type: "interactive",
          category: "vocabulary"
        }
      ]
    },
    "one-on-one": {
      title: "Khóa Học 1:1 Cá Nhân Hóa",
      totalTime: "60 phút",
      topics: [
        {
          id: 1,
          title: "Personal Assessment",
          description: "Đánh giá trình độ và xây dựng lộ trình cá nhân",
          level: "A1-C2",
          lessonsCount: 10,
          image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=400&h=200&fit=crop",
          type: "interactive",
          category: "assessment"
        },
        {
          id: 2,
          title: "Customized Speaking",
          description: "Luyện nói theo mục tiêu cá nhân với giáo viên",
          level: "A1-C2",
          lessonsCount: 50,
          image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=400&h=200&fit=crop",
          type: "video",
          category: "speaking"
        },
        {
          id: 3,
          title: "Targeted Grammar",
          description: "Ngữ pháp theo điểm yếu cá nhân",
          level: "A1-C2",
          lessonsCount: 40,
          image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=200&fit=crop",
          type: "interactive",
          category: "grammar"
        },
        {
          id: 4,
          title: "Professional English",
          description: "Tiếng Anh chuyên ngành theo công việc",
          level: "B1-C2",
          lessonsCount: 60,
          image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop",
          type: "video",
          category: "professional"
        },
        {
          id: 5,
          title: "Interview Preparation",
          description: "Chuẩn bị phỏng vấn và thuyết trình",
          level: "B1-C2",
          lessonsCount: 30,
          image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=400&h=200&fit=crop",
          type: "video",
          category: "interview"
        }
      ]
    }
  };

  const courseData = courseLessonsData[courseId];

  if (!courseData) {
    return (
      <div className="min-h-screen bg-background">
      
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-center">Khóa học không tồn tại</h1>
        </div>
      </div>
    );
  }

  const handleTopicClick = (topicId: number) => {
    navigate(`/courses/${courseId}/topics/${topicId}`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "audio": return "🎧";
      case "video": return "📹";
      case "interactive": return "⚡";
      case "dictation": return "✍️";
      default: return "📝";
    }
  };

  const getLevelColor = (level: string) => {
    if (level.includes("A1")) return "bg-green-100 text-green-800";
    if (level.includes("A2")) return "bg-blue-100 text-blue-800";
    if (level.includes("B1")) return "bg-yellow-100 text-yellow-800";
    if (level.includes("B2")) return "bg-orange-100 text-orange-800";
    if (level.includes("C1")) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-background">
    
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">{courseData.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Chọn chủ đề phù hợp với trình độ của bạn
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm chủ đề..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* All Topics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Tất cả chủ đề</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseData.topics
              .filter(topic => 
                searchTerm === "" || 
                topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                topic.description.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((topic) => (
                <Card 
                  key={topic.id} 
                  className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
                  onClick={() => handleTopicClick(topic.id)}
                >
                  <div className="relative">
                    <img 
                      src={topic.image} 
                      alt={topic.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className={getLevelColor(topic.level)}>
                        Levels: {topic.level}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2">
                      <span className="text-lg">{getTypeIcon(topic.type)}</span>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-primary/80 transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {topic.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-foreground">
                        {topic.lessonsCount} lessons
                      </div>
                      <Button variant="outline" size="sm" className="text-xs">
                        Bắt đầu học
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-muted/30 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold mb-4">Thống kê khóa học</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-2xl font-bold text-primary">
                {courseData.topics.reduce((sum, topic) => sum + topic.lessonsCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Tổng bài học</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{courseData.topics.length}</div>
              <div className="text-sm text-muted-foreground">Chủ đề</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">A1-C1</div>
              <div className="text-sm text-muted-foreground">Trình độ</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">∞</div>
              <div className="text-sm text-muted-foreground">Thời gian học</div>
            </div>
          </div>
        </div>
      </div>

    
    </div>
  );
};

export default CourseLessons;