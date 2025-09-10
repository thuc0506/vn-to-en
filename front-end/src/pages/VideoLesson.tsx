import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import useFetchLessonDetail from "../hooks/lesson/useFetchLessonDetail";
import useDictationTrainer from "../hooks/lesson/useDictationTrainer";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Star, Play, ArrowLeft, ArrowRight, Volume2, CheckCircle, 
  SkipForward, Settings, Eye, MessageSquare, Clock
} from "lucide-react";

const VideoLesson = () => {
  const { courseType, slug, lessonSlugAndId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLDivElement>(null);

  const lessonId = lessonSlugAndId?.split(".").pop();
  const { lesson, loading, error } = useFetchLessonDetail(lessonId || "");

  const [hasStarted, setHasStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTab, setActiveTab] = useState("dictation");
  const playerRef = useRef<any>(null);

  const {
    currentCaption,
    currentCaptionIndex,
    userInput,
    setUserInput,
    checkAnswer,
    nextCaption,
    prevCaption,
    startDictation,
    isPaused,
    setIsPaused
  } = useDictationTrainer(lesson?.detail?.transcript_path ?? "", playerRef);

  const [showAnswer, setShowAnswer] = useState(false);
  const [currentSentence, setCurrentSentence] = useState(1);
  const [videoSize, setVideoSize] = useState("normal");
  const [showVideo, setShowVideo] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (!lesson?.detail?.url || !videoRef.current) return;

    const { url } = lesson.detail;
    const videoId = new URL(url).searchParams.get("v");
    if (!videoId) return;

    const initializePlayer = () => {
      const height = videoSize === "small" ? "240" : videoSize === "large" ? "480" : "360";
      
      playerRef.current = new window.YT.Player(videoRef.current, {
        videoId,
        height,
        width: "100%",
        playerVars: {
          rel: 0,
          modestbranding: 1,
          controls: 1,
        },
        events: {
          onReady: () => console.log("YouTube Player is ready"),
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPaused(false);
              intervalRef.current = setInterval(() => {
                const time = playerRef.current.getCurrentTime();
                setCurrentTime(time);
              }, 500);
            } else {
              setIsPaused(true);
              clearInterval(intervalRef.current);
            }
          },
        },
      });
    };

    const loadYouTubeAPI = () => {
      if (!window.YT || !window.YT.Player) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(script);
      }
      window.onYouTubeIframeAPIReady = initializePlayer;
    };

    loadYouTubeAPI();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.onYouTubeIframeAPIReady = null;
      if (playerRef.current?.destroy) playerRef.current.destroy();
    };
  }, [lesson, videoSize]);

  const handleCheck = () => setShowAnswer(true);
  
  const handleSkip = () => {
    if (lesson && currentSentence < lesson.totalSentences) {
      setCurrentSentence((prev) => prev + 1);
      setUserInput("");
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentSentence > 1) {
      setCurrentSentence((prev) => prev - 1);
      setUserInput("");
      setShowAnswer(false);
    }
  };

  const progressPercentage = lesson ? ((currentCaptionIndex + 1) / lesson.totalSentences * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Đang tải bài học...</p>
        </div>
      </div>
    );
  }
  
  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-red-500 space-y-2">
          <h3 className="text-xl font-semibold">Không tìm thấy bài học</h3>
          <p>Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header - Cải thiện layout */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate(`/courses/${courseType}/${slug}`)}
                className="hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại chủ đề
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Star className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {lesson.level}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{lesson.totalSentences} câu</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar - Cải thiện thiết kế */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Tiến độ: {currentCaptionIndex + 1}/{lesson.totalSentences}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progressPercentage)}% hoàn thành
              </span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2 bg-gray-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Video Section - Cải thiện responsive */}
          <div className="xl:col-span-7">
            <Card className="shadow-lg border-0 overflow-hidden">
              <CardContent className="p-0">
                {/* Settings Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 border-b">
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <select 
                      value={videoSize}
                      onChange={(e) => setVideoSize(e.target.value)}
                      className="border rounded-md px-3 py-1.5 text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="small">Video: Nhỏ</option>
                      <option value="normal">Video: Vừa</option>
                      <option value="large">Video: Lớn</option>
                    </select>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowVideo(!showVideo)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      {showVideo ? 'Ẩn' : 'Hiện'} video
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowComments(!showComments)}
                      className="flex items-center gap-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Bình luận
                    </Button>
                  </div>
                </div>

                {/* Video Player */}
                {showVideo && (
                  <div className="bg-gray-900 relative">
                    <div 
                      ref={videoRef} 
                      className="w-full transition-all duration-300" 
                      id="youtube-player"
                      style={{
                        height: videoSize === "small" ? "240px" : 
                               videoSize === "large" ? "480px" : "360px"
                      }}
                    />
                  </div>
                )}

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="px-6 pt-4">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="dictation" className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4" />
                        Dictation
                      </TabsTrigger>
                      <TabsTrigger value="transcript" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Transcript
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <div className="p-6">
                    <TabsContent value="dictation" className="mt-0">
                      <div className="text-center text-muted-foreground">
                        <Volume2 className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                        <h3 className="text-lg font-semibold mb-2">Chế độ Dictation</h3>
                        <p>Nghe và gõ lại những gì bạn nghe được.</p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="transcript" className="mt-0">
                      <div className="text-center text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-green-500" />
                        <h3 className="text-lg font-semibold mb-2">Transcript</h3>
                        <p>Xem toàn bộ nội dung bài học.</p>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Practice Panel - Cải thiện UX */}
          <div className="xl:col-span-5">
            {!hasStarted ? (
              <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50">
                {/* Match the total height of video section */}
                <CardContent className="p-8 min-h-[600px] flex items-center justify-center">
                  <div className="text-center space-y-6 w-full max-w-md">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <Play className="w-10 h-10 text-white ml-1" />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-gray-900">
                        Sẵn sàng luyện nghe?
                      </h3>
                      <p className="text-muted-foreground text-base leading-relaxed">
                        Bài học này có <span className="font-semibold text-blue-600">{lesson.totalSentences} câu</span>. 
                        Bạn sẽ nghe từng câu và gõ lại những gì bạn nghe được.
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="font-bold text-xl text-blue-600">{lesson.totalSentences}</div>
                          <div className="text-sm text-muted-foreground">Câu</div>
                        </div>
                        <div>
                          <div className="font-bold text-xl text-green-600">~{Math.ceil(lesson.totalSentences / 2)}</div>
                          <div className="text-sm text-muted-foreground">Phút</div>
                        </div>
                        <div>
                          <div className="font-bold text-xl text-orange-600">{lesson.level}</div>
                          <div className="text-sm text-muted-foreground">Cấp độ</div>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => {
                        setHasStarted(true);
                        startDictation();
                      }}
                      size="lg"
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-12 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
                    >
                      <Play className="w-5 h-5 mr-3" />
                      Bắt đầu luyện nghe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg border-0">
                <CardHeader className="text-center pb-4 border-b">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-sm">
                      Câu {currentCaptionIndex + 1} / {lesson.totalSentences}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      {Math.round(progressPercentage)}% hoàn thành
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 min-h-[520px] flex flex-col">
                  {/* Top section - Input and controls */}
                  <div className="space-y-6 flex-shrink-0">
                    <div className="space-y-4">
                      <div className="text-center">
                        <Volume2 className="h-8 w-8 mx-auto mb-3 text-blue-500" />
                        <p className="text-sm text-muted-foreground mb-4">
                          Nghe và nhập những gì bạn nghe được
                        </p>
                      </div>
                      
                      <Input
                        placeholder="Nhập câu trả lời của bạn..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className="text-center text-lg py-4 border-2 focus:border-blue-500 rounded-lg"
                        onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
                      />
                    </div>

                    {/* Control Buttons */}
                    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center">
                      <Button 
                        onClick={prevCaption} 
                        variant="outline" 
                        size="sm"
                        disabled={currentCaptionIndex === 0}
                        className="flex items-center gap-2 justify-center"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Trước
                      </Button>
                      
                      <Button 
                        onClick={handleCheck} 
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 justify-center col-span-2 sm:col-span-1 sm:px-6"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Kiểm tra
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={nextCaption}
                        className="flex items-center gap-2 justify-center"
                      >
                        <SkipForward className="h-4 w-4" />
                        Bỏ qua
                      </Button>
                      
                      <Button 
                        onClick={nextCaption} 
                        variant="outline" 
                        size="sm"
                        disabled={currentCaptionIndex >= lesson.totalSentences - 1}
                        className="flex items-center gap-2 justify-center"
                      >
                        Sau
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Middle section - Answer display (flexible height) */}
                  <div className="flex-1 flex items-center justify-center py-6 min-h-[120px]">
                    {showAnswer && currentCaption?.captionText ? (
                      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 shadow-sm w-full">
                        <CardContent className="p-4">
                          <div className="text-center space-y-2">
                            <div className="flex items-center justify-center gap-2 text-green-700 font-semibold">
                              <CheckCircle className="h-5 w-5" />
                              Đáp án đúng
                            </div>
                            <p className="text-lg text-green-800 font-medium">
                              {currentCaption.captionText}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <p className="text-sm">Nhập câu trả lời và nhấn "Kiểm tra" để xem đáp án</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Bottom section - Progress (fixed) */}
                  <div className="pt-4 border-t flex-shrink-0">
                    <Progress 
                      value={progressPercentage} 
                      className="h-2 bg-gray-100"
                    />
                    <p className="text-center text-sm text-muted-foreground mt-2">
                      Tiến độ: {currentCaptionIndex + 1}/{lesson.totalSentences} câu
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoLesson;