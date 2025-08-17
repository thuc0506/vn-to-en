import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Pause, Volume2, Volume, ArrowLeft, ArrowRight, RotateCcw, CheckCircle, Star, Eye, EyeOff, Check, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const LessonDetail = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentSentence, setCurrentSentence] = useState(1);
  const [volume, setVolume] = useState(70);
  const [player, setPlayer] = useState<any>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState("exercise");

  // Sample lesson data
  const lessonData = {
    basic: {
      id: 1,
      title: "Greetings and Introductions",
      level: "A1",
      type: "Video Lesson",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      totalSentences: 10,
      correctAnswer: "Hello, my name is John. Nice to meet you!",
      transcript: `In this lesson, you will learn basic greetings in English.
      Hello! Hi! Good morning! Good afternoon! Good evening!
      My name is... What's your name? Nice to meet you!`,
      vocabulary: [
        { word: "Hello", meaning: "Xin chào", example: "Hello, how are you?" },
        { word: "Name", meaning: "Tên", example: "What's your name?" },
        { word: "Meet", meaning: "Gặp", example: "Nice to meet you!" }
      ]
    },
    advanced: {
      id: 1,
      title: "Business Negotiations",
      level: "C1",
      type: "Audio Lesson",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      totalSentences: 15,
      correctAnswer: "We're willing to offer a 15% discount for bulk orders.",
      transcript: `In today's business negotiation, we'll discuss pricing and terms.
      We're willing to offer a 15% discount for bulk orders.
      Our proposal includes extended payment terms and after-sales support...`,
      vocabulary: [
        { word: "Negotiation", meaning: "Đàm phán", example: "business negotiation" },
        { word: "Discount", meaning: "Giảm giá", example: "15% discount" },
        { word: "Bulk orders", meaning: "Đơn hàng số lượng lớn", example: "discount for bulk orders" }
      ]
    },
    ielts: {
      id: 1,
      title: "IELTS Writing Task 1",
      level: "B2-C1",
      type: "Text Lesson",
      content: `The graph below shows the proportion of the population aged 65 and over between 1940 and 2040 in three different countries.

Summarize the information by selecting and reporting the main features, and make comparisons where relevant.

Key features:
- Japan started lowest but will exceed others by 2040
- USA showed steady growth throughout the period
- Sweden fluctuated but remained higher than USA until 2020`,
      
      vietnameseTranslation: `Biểu đồ dưới đây thể hiện tỷ lệ dân số từ 65 tuổi trở lên từ năm 1940 đến 2040 ở ba quốc gia khác nhau.

Tóm tắt thông tin bằng cách chọn và báo cáo các đặc điểm chính, so sánh khi cần thiết.

Đặc điểm chính:
- Nhật Bản bắt đầu thấp nhất nhưng sẽ vượt các nước khác vào năm 2040
- Mỹ cho thấy sự tăng trưởng ổn định trong suốt giai đoạn
- Thụy Điển dao động nhưng vẫn cao hơn Mỹ đến năm 2020`,
      
      vocabulary: [
        {
          term: "Proportion",
          definition: "Tỷ lệ",
          example: "The proportion of elderly people is increasing"
        },
        {
          term: "Exceed",
          definition: "Vượt quá",
          example: "Japan's percentage will exceed 25% by 2030"
        },
        {
          term: "Fluctuate",
          definition: "Dao động",
          example: "The numbers fluctuated between 5% and 8%"
        }
      ],
      tips: [
        "Write at least 150 words",
        "Spend about 20 minutes on this task",
        "Focus on trends rather than every detail",
        "Use appropriate academic vocabulary"
      ],
      totalSentences: 6,
      correctAnswer: "The graph illustrates that Japan's elderly population will surpass both the USA and Sweden by 2040."
    }
  };

  const currentLesson = lessonData[courseId as keyof typeof lessonData];
  const isVideoCourse = courseId === 'basic';
  const isAudioCourse = courseId === 'advanced';
  const isIELTSCourse = courseId === 'ielts';

  // Extract YouTube ID from URL
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = isVideoCourse ? getYouTubeId(currentLesson.videoUrl) : null;

  // YouTube Player API
  useEffect(() => {
    if (!isVideoCourse || !youtubeId) return;

    const loadYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        initializePlayer();
      } else {
        window.onYouTubeIframeAPIReady = initializePlayer;
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }
    };

    const initializePlayer = () => {
      const newPlayer = new window.YT.Player(playerRef.current, {
        height: '400',
        width: '100%',
        videoId: youtubeId,
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        },
        playerVars: {
          controls: 0,
          disablekb: 1,
          modestbranding: 1
        }
      });
      setPlayer(newPlayer);
    };

    loadYouTubeAPI();

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, [youtubeId]);

  // Audio player setup
  useEffect(() => {
    if (isVideoCourse || !audioRef.current || isIELTSCourse) return;

    const audio = audioRef.current;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('play', () => setIsPlaying(true));
      audio.removeEventListener('pause', () => setIsPlaying(false));
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [isVideoCourse, isIELTSCourse]);

  // Progress timer for YouTube
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    if (isPlaying && isVideoCourse) {
      progressInterval = setInterval(() => {
        if (player) {
          setCurrentTime(player.getCurrentTime());
        }
      }, 1000);
    }

    return () => {
      clearInterval(progressInterval);
    };
  }, [isPlaying, isVideoCourse, player]);

  const onPlayerReady = (event: any) => {
    setDuration(event.target.getDuration());
    event.target.setVolume(volume);
  };

  const onPlayerStateChange = (event: any) => {
    switch (event.data) {
      case window.YT.PlayerState.PLAYING:
        setIsPlaying(true);
        break;
      case window.YT.PlayerState.PAUSED:
        setIsPlaying(false);
        break;
      case window.YT.PlayerState.ENDED:
        setIsPlaying(false);
        break;
    }
  };

  const togglePlayPause = () => {
    if (isVideoCourse) {
      if (!player) return;
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    } else if (isAudioCourse) {
      if (!audioRef.current) return;
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    
    if (isVideoCourse) {
      if (player) {
        player.seekTo(newTime, true);
      }
    } else if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    
    if (isVideoCourse) {
      if (player) {
        player.setVolume(newVolume);
      }
    } else if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const handleCheck = () => {
    setShowAnswer(true);
  };

  const handleSkip = () => {
    if (currentSentence < currentLesson.totalSentences) {
      setCurrentSentence(currentSentence + 1);
      setUserInput("");
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentSentence > 1) {
      setCurrentSentence(currentSentence - 1);
      setUserInput("");
      setShowAnswer(false);
    }
  };

  const restartLesson = () => {
    setCurrentSentence(1);
    setUserInput("");
    setShowAnswer(false);
    
    if (isVideoCourse) {
      if (player) {
        player.seekTo(0, true);
        player.playVideo();
      }
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const handleCompleteLesson = () => setCompleted(true);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(`/courses/${courseId}/lessons`)}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to lessons
            </Button>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
              <Badge variant="secondary">{currentLesson.level}</Badge>
            </div>
          </div>
        </div>

        {/* Progress - Don't show for IELTS */}
        {!isIELTSCourse && (
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-muted-foreground">{formatTime(currentTime)}</span>
            <Progress value={duration ? (currentTime / duration) * 100 : 0} className="flex-1" />
            <span className="text-sm text-muted-foreground">{formatTime(duration)}</span>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Lesson Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                {/* Video Player */}
                {isVideoCourse && (
                  <div className="relative bg-black rounded-t-lg overflow-hidden">
                    <div ref={playerRef} className="w-full h-[400px]"></div>
                    
                    {/* Video Controls */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={togglePlayPause}
                            className="text-white hover:bg-white/20"
                          >
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <span className="text-sm">
                            {formatTime(currentTime)} / {formatTime(duration)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {volume > 0 ? (
                            <Volume2 className="h-4 w-4" />
                          ) : (
                            <Volume className="h-4 w-4" />
                          )}
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-24"
                          />
                        </div>
                      </div>
                      
                      <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleTimeChange}
                        className="w-full mt-2"
                      />
                    </div>
                  </div>
                )}

                {/* Audio Player */}
                {isAudioCourse && (
                  <div className="bg-gray-100 p-6 rounded-t-lg">
                    <audio
                      ref={audioRef}
                      src={currentLesson.audioUrl}
                      className="hidden"
                    />
                    
                    {/* Audio Controls */}
                    <div className="flex flex-col items-center gap-4">
                      {/* Waveform Placeholder */}
                      <div className="w-full h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">Audio Waveform Visualization</span>
                      </div>
                      
                      <div className="flex items-center gap-4 w-full">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={togglePlayPause}
                        >
                          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                        </Button>
                        
                        <input
                          type="range"
                          min="0"
                          max={duration || 100}
                          value={currentTime}
                          onChange={handleTimeChange}
                          className="flex-1"
                        />
                        
                        <div className="flex items-center gap-2 w-24">
                          {volume > 0 ? (
                            <Volume2 className="h-4 w-4" />
                          ) : (
                            <Volume className="h-4 w-4" />
                          )}
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* IELTS Text Content */}
                {isIELTSCourse && (
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">IELTS Writing Task</h2>
                      <Button variant="ghost" size="sm" onClick={() => setShowTranslation(!showTranslation)}>
                        {showTranslation ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                        {showTranslation ? "Hide Translation" : "Show Translation"}
                      </Button>
                    </div>

                    <div className="prose max-w-none">
                      <p className="whitespace-pre-line mb-4">{currentLesson.content}</p>
                      
                      {showTranslation && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                          <h3 className="font-medium mb-2">Vietnamese Translation</h3>
                          <p className="whitespace-pre-line text-gray-700">{currentLesson.vietnameseTranslation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Exercise Controls */}
                <div className="p-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                      <TabsTrigger value="exercise">Exercise</TabsTrigger>
                      {isIELTSCourse ? (
                        <>
                          <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
                          <TabsTrigger value="tips">Writing Tips</TabsTrigger>
                        </>
                      ) : (
                        <>
                          <TabsTrigger value="transcript">Transcript</TabsTrigger>
                          <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
                        </>
                      )}
                    </TabsList>
                    
                    <TabsContent value="exercise" className="space-y-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-4 mb-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handlePrevious}
                            disabled={currentSentence === 1}
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </Button>
                          <span className="text-sm font-medium">
                            {currentSentence} / {currentLesson.totalSentences}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSkip}
                            disabled={currentSentence === currentLesson.totalSentences}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {isIELTSCourse ? (
                          <>
                            <h3 className="font-medium">Practice Task:</h3>
                            <p className="mb-4">Summarize the main features of the graph in your own words (about 150 words)</p>
                            <textarea
                              className="w-full h-48 p-3 border rounded-lg"
                              placeholder="Write your answer here..."
                              value={userInput}
                              onChange={(e) => setUserInput(e.target.value)}
                            />
                          </>
                        ) : (
                          <Input
                            placeholder={isVideoCourse ? "Type what you see..." : "Type what you hear..."}
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            className="text-center"
                          />
                        )}
                        
                        <div className="flex justify-center gap-4">
                          <Button onClick={handleCheck} className="bg-blue-600 hover:bg-blue-700">
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
                                <strong>Model Answer:</strong> {currentLesson.correctAnswer}
                              </p>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </TabsContent>

                    {isIELTSCourse ? (
                      <>
                        <TabsContent value="vocabulary">
                          <div className="grid grid-cols-1 gap-4">
                            {currentLesson.vocabulary.map((item: any, index: number) => (
                              <div key={index} className="p-4 border rounded-lg">
                                <h4 className="font-bold">{item.term}</h4>
                                <p className="text-sm text-gray-600">{item.definition}</p>
                                <p className="text-sm mt-2 italic">"{item.example}"</p>
                              </div>
                            ))}
                          </div>
                        </TabsContent>

                        <TabsContent value="tips">
                          <ul className="space-y-3 list-disc pl-5">
                            {currentLesson.tips.map((tip: string, index: number) => (
                              <li key={index}>{tip}</li>
                            ))}
                          </ul>
                        </TabsContent>
                      </>
                    ) : (
                      <>
                        <TabsContent value="transcript">
                          <Card>
                            <CardContent className="p-4">
                              <p className="text-sm leading-relaxed whitespace-pre-line">
                                {currentLesson.transcript}
                              </p>
                            </CardContent>
                          </Card>
                        </TabsContent>
                        
                        <TabsContent value="vocabulary">
                          <Card>
                            <CardContent className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {currentLesson.vocabulary.map((item: any, index: number) => (
                                  <div key={index} className="border p-3 rounded-lg">
                                    <h4 className="font-bold text-primary">{item.word}</h4>
                                    <p className="text-sm text-muted-foreground">{item.meaning}</p>
                                    <p className="text-sm italic mt-1">"{item.example}"</p>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </>
                    )}
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Your Progress</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Completed</span>
                    <span>{currentSentence - 1}/{currentLesson.totalSentences}</span>
                  </div>
                  <Progress value={(currentSentence - 1) / currentLesson.totalSentences * 100} />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Accuracy</span>
                    <span>85%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Quick Navigation</h3>
                <div className="space-y-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => navigate(`/courses/${courseId}/lessons`)}
                  >
                    Back to all lessons
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={restartLesson}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restart Lesson
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => setShowAnswer(!showAnswer)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {showAnswer ? "Hide Answer" : "Show Answer"}
                  </Button>
                  {isIELTSCourse && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => setShowTranslation(!showTranslation)}
                    >
                      {showTranslation ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                      {showTranslation ? "Hide Translation" : "Show Translation"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {completed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <h3 className="text-xl font-bold mb-2">Lesson Completed!</h3>
            <p className="mb-4">You've finished this {isIELTSCourse ? "IELTS writing" : "lesson"} practice.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCompleted(false)}>
                Continue Practicing
              </Button>
              <Button onClick={() => navigate(`/courses/${courseId}/lessons`)}>
                Back to Lessons
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonDetail;