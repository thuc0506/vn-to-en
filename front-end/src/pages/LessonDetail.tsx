import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import useFetchLessonDetail from "../hooks/lesson/useFetchLessonDetail";
import useDictationTrainer from "../hooks/lesson/useDictationTrainer";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Star, Play, ArrowLeft, ArrowRight,
} from "lucide-react";

const Lesson = () => {
  const { courseType, slug, lessonSlugAndId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLDivElement>(null);

  const lessonId = lessonSlugAndId?.split(".").pop();
  const { lesson, loading, error } = useFetchLessonDetail(lessonId || "");

  const [hasStarted, setHasStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
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
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (!lesson?.detail?.url || !videoRef.current) return;

    const { url } = lesson.detail;
    const videoId = new URL(url).searchParams.get("v");
    if (!videoId) return;

    const initializePlayer = () => {
      playerRef.current = new window.YT.Player(videoRef.current, {
        videoId,
        height: "280",
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

  if (loading) return <div className="text-center py-10 text-muted-foreground">Đang tải bài học...</div>;
  if (error || !lesson) return <div className="text-center py-10 text-red-500">Không tìm thấy bài học.</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(`/courses/${courseType}/${slug}`)}>
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Video + Tabs */}
          <div className="lg:col-span-7">
            <Card>
              <CardContent className="p-4">
                {/* Tabs + Settings */}
                <div className="flex items-center justify-between px-4 pt-4">
                  <Tabs defaultValue="dictation">
                    <TabsList>
                      <TabsTrigger value="dictation">Dictation</TabsTrigger>
                      <TabsTrigger value="transcript">Transcript</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <div className="flex items-center gap-2">
                    <select className="border rounded px-2 py-1 text-sm">
                      <option>Video size: Normal</option>
                      <option>Small</option>
                      <option>Large</option>
                    </select>
                    <Button variant="outline" size="sm">Hide video</Button>
                    <Button variant="outline" size="sm">Show comments</Button>
                  </div>
                </div>

                {/* Video */}
                <div className="px-4 pt-2">
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <div ref={videoRef} className="w-full h-[400px] rounded-lg" id="youtube-player" />
                  </div>
                </div>

                {/* Tabs Content */}

              </CardContent>
            </Card>
          </div>

          {/* Sidebar bên phải */}
          <div className="lg:col-span-5">
            {!hasStarted ? (
              <Card>
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Sẵn sàng luyện nghe?</h3>
                  <p className="text-muted-foreground">
                    Bài học này có {lesson.totalSentences} câu. Bạn sẽ nghe từng câu và gõ lại những gì bạn nghe được.
                  </p>
                  <Button
                    onClick={() => {
                      setHasStarted(true);
                      startDictation();
                    }}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white px-8"
                  >
                    Bắt đầu luyện nghe
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="text-center text-muted-foreground text-sm">
                    Câu {currentCaptionIndex + 1} / {lesson.totalSentences}
                  </div>
                  <Input
                    placeholder="Nhập những gì bạn nghe được"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="text-center text-base py-4"
                  />

                  <div className="flex justify-center gap-2">
                    <Button onClick={prevCaption} variant="ghost" size="sm">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleCheck} className="bg-blue-600 hover:bg-blue-700 text-white">
                      Check
                    </Button>
                    <Button variant="outline" onClick={nextCaption}>
                      Skip
                    </Button>
                    <Button onClick={nextCaption} variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  {showAnswer && currentCaption?.captionText && (
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-3 text-green-800 text-center">
                        <strong>Đáp án đúng:</strong> {currentCaption.captionText}
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lesson;
