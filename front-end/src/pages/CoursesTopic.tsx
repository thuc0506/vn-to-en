import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Search, 
  TrendingUp, 
  Award, 
  Target,
  ChevronRight,
  Play
} from "lucide-react";
import { useFetchTopicsByType } from "../hooks/topic/useFetchTopicsByType";

const CourseTopic = () => {
  const { courseType } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  const { topics, loading } = useFetchTopicsByType(courseType || "");

  const handleTopicClick = (slug: string) => {
    navigate(`/courses/${courseType}/${slug}`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "audio": return "🎧";
      case "video": return "📹";
      case "interactive": return "⚡";
      case "dictation": return "✍️";
      case "translate": return "🌐";
      default: return "📝";
    }
  };

  const getLevelBadgeStyle = (level: string) => {
    if (level.includes("A1")) return "from-green-500 to-emerald-600";
    if (level.includes("A2")) return "from-blue-500 to-cyan-600";
    if (level.includes("B1")) return "from-yellow-500 to-amber-600";
    if (level.includes("B2")) return "from-orange-500 to-red-500";
    if (level.includes("C1")) return "from-red-500 to-pink-600";
    return "from-gray-500 to-gray-600";
  };

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = searchTerm === "" || 
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = levelFilter === "all" || topic.level.includes(levelFilter);
    
    return matchesSearch && matchesLevel;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!topics || topics.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có chủ đề nào</h3>
          <p className="text-gray-600">Nội dung đang được cập nhật</p>
        </div>
      </div>
    );
  }

  const totalLessons = topics.reduce((sum, topic) => sum + topic.lessonsCount, 0);
  const courseTitle = courseType === 'translate' ? 'Dịch Thuật' : 'Học Tập';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Simple Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Khóa Học {courseTitle}
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            {topics.length} chủ đề • {totalLessons} bài học
          </p>

          {/* Search & Filter in one line */}
          <div className="max-w-2xl mx-auto flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Tìm kiếm chủ đề..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-white border-gray-200"
              />
            </div>

            {/* Simple level filter */}
            <div className="flex gap-2">
              {["all", "A1", "A2", "B1", "B2", "C1"].map((level) => (
                <Button
                  key={level}
                  variant={levelFilter === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLevelFilter(level)}
                  className={`h-12 ${
                    levelFilter === level 
                      ? "bg-blue-600 hover:bg-blue-700" 
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {level === "all" ? "Tất cả" : level}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Topics Grid - Simplified Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredTopics.map((topic) => (
            <Card 
              key={topic.id} 
              className="group cursor-pointer bg-white hover:shadow-xl transition-all duration-300 overflow-hidden border-0"
              onClick={() => handleTopicClick(topic.slug)}
            >
              {/* Image Section */}
              <div className="relative overflow-hidden h-48">
                <img 
                  src={topic.image} 
                  alt={topic.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Simple gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Level badge - floating */}
                <div className="absolute top-4 left-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getLevelBadgeStyle(topic.level)} text-white shadow-lg`}>
                    {topic.level}
                  </div>
                </div>

                {/* Type icon - floating */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-lg">{getTypeIcon(topic.type)}</span>
                </div>

                {/* Title on image */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white drop-shadow-lg">
                    {topic.title}
                  </h3>
                </div>
              </div>
              
              {/* Content - Minimal */}
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {topic.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm font-medium">{topic.lessonsCount} bài học</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-blue-600 font-medium text-sm">
                    Học ngay
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredTopics.length === 0 && (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Không tìm thấy chủ đề nào
            </h3>
            <p className="text-gray-600 mb-6">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setLevelFilter("all");
              }}
              variant="outline"
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}

        {/* Simple Stats Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white/50 backdrop-blur rounded-2xl p-8">
          <div className="text-center">
            <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalLessons}</p>
            <p className="text-sm text-gray-600">Bài học</p>
          </div>
          
          <div className="text-center">
            <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{topics.length}</p>
            <p className="text-sm text-gray-600">Chủ đề</p>
          </div>
          
          <div className="text-center">
            <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">A1-C1</p>
            <p className="text-sm text-gray-600">Trình độ</p>
          </div>
          
          <div className="text-center">
            <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">∞</p>
            <p className="text-sm text-gray-600">Thời gian</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseTopic;