
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Star, Play, Clock, ChevronDown, Search } from "lucide-react";
import { useFetchTopicsByType } from "../hooks/topic/useFetchTopicsByType";




const CourseTopic = () => {
 const { courseType } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

 

  // Fetch topics based on course type
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

   if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!topics || topics.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Không tìm thấy chủ đề nào cho khóa học này.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
    
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
       <h1 className="text-4xl font-bold text-foreground mb-4">
            Các chủ đề khóa học
          </h1>
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
            {topics
              .filter(topic => 
                searchTerm === "" || 
                topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                topic.description.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((topic) => (
                <Card 
                  key={topic.id} 
                  className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
               onClick={() => handleTopicClick(topic.slug)}

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
                {topics.reduce((sum, topic) => sum + topic.lessonsCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Tổng bài học</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{topics.length}</div>
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

export default CourseTopic;