import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetchLessonDetail from "../hooks/lesson/useFetchLessonDetail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Star, Play, Pause, Volume2, Settings,
  ArrowLeft, ArrowRight, RotateCcw,
} from "lucide-react";

const Lesson = () => {
  const { courseType, slug, lessonSlugAndId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLDivElement>(null);


  const lessonId = lessonSlugAndId?.split(".").pop();
  const { lesson, loading, error } = useFetchLessonDetail(lessonId || "");

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentSentence, setCurrentSentence] = useState(1);




  const playerRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);
  const [isPaused, setIsPaused] = useState(true);

 


  // Sử dụng useEffect để đảm bảo chỉ chạy khi video và progress thay đổi
  useEffect(() => {
    if (!lesson?.detail?.url || !videoRef.current) return;

    const { url } = lesson.detail;

    const initializePlayer = () => {
      const videoId = new URL(url).searchParams.get("v");
      if (!videoId || !videoRef.current) return;

      playerRef.current = new window.YT.Player(videoRef.current, {
        videoId,
        height: "400",
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
  }, [lesson]);



  const togglePlayPause = () => {
    if (playerRef.current) {
      const state = playerRef.current.getPlayerState();
      if (state === window.YT.PlayerState.PLAYING) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };




  const handleCheck = () => setShowAnswer(true);
  const handleSkip = () => {
    if (lesson && currentSentence < lesson.totalSentences) {
      setCurrentSentence(prev => prev + 1);
      setUserInput("");
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentSentence > 1) {
      setCurrentSentence(prev => prev - 1);
      setUserInput("");
      setShowAnswer(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return <div className="text-center py-10 text-muted-foreground">Đang tải bài học...</div>;
  }

  if (error || !lesson) {
    return <div className="text-center py-10 text-red-500">Không tìm thấy bài học.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/courses/${courseType}/${slug}`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại chủ đề
            </Button>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-2xl font-bold">{lesson.title}</h1>
              <Badge variant="secondary">{lesson.level}</Badge>
            </div>
          </div>
        </div>


        {/* Progress */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-sm text-muted-foreground">0 phút</span>
          <Progress value={(currentSentence - 1) / lesson.totalSentences * 100} className="flex-1" />
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video & Tabs */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                {/* Video */}
                <div className="relative bg-gray-900 rounded-t-lg overflow-hidden">
                  <div className="relative bg-gray-900 rounded-t-lg overflow-hidden">
                    <div
                      ref={videoRef}
                      className="w-full h-[400px] rounded-lg"
                      id="youtube-player"
                    />
                  </div>

                </div>

                {/* Tabs content */}
                <div className="p-4 space-y-4">
                  <Tabs defaultValue="dictation">
                    <TabsList>
                      <TabsTrigger value="dictation">Dictation</TabsTrigger>
                      <TabsTrigger value="transcript">Transcript</TabsTrigger>
                    </TabsList>

                    <TabsContent value="dictation" className="space-y-4">
                      <div className="text-center flex items-center justify-center gap-4 mb-4">
                        <Button variant="ghost" size="sm" onClick={handlePrevious} disabled={currentSentence === 1}>
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium">{currentSentence} / {lesson.totalSentences}</span>
                        <Button variant="ghost" size="sm" onClick={handleSkip} disabled={currentSentence === lesson.totalSentences}>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>

                      <Input
                        placeholder="Type what you hear..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className="text-center"
                      />

                      <div className="flex justify-center gap-4">
                        <Button onClick={handleCheck} className="bg-blue-600 hover:bg-blue-700 text-white">
                          Check
                        </Button>
                        <Button variant="outline" onClick={handleSkip}>
                          Skip
                        </Button>
                      </div>

                      {showAnswer && (
                        <Card className="bg-green-50 border-green-200">
                          <CardContent className="p-4">
                            <p className="text-center text-green-800">
                              <strong>Correct answer:</strong> {lesson.correctAnswer}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>

                    <TabsContent value="transcript">
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-sm leading-relaxed whitespace-pre-line">
                            {lesson.transcript}
                          </p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Tiến độ của bạn</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Đã hoàn thành</span>
                    <span>{currentSentence - 1}/{lesson.totalSentences}</span>
                  </div>
                  <Progress value={(currentSentence - 1) / lesson.totalSentences * 100} />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Độ chính xác</span>
                    <span>85%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold mb-4">Điều hướng</h3>
                <Button variant="ghost" size="sm" className="w-full justify-start">Previous Lesson</Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">Next Lesson</Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <RotateCcw className="h-4 w-4 mr-2" /> Restart Lesson
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lesson;