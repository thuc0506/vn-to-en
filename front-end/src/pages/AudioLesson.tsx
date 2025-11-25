import { useParams, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, Volume, ArrowLeft, ArrowRight, RotateCcw, CheckCircle, Star, ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import useFetchLessonDetail from "../hooks/lesson/useFetchLessonDetail";
import { useTranscriptPlayer } from "../hooks/lesson/useTranscriptPlayer";

const AudioLesson = () => {
  const { courseType, slug, lessonSlugAndId } = useParams();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);

  const lessonId = lessonSlugAndId?.split(".").pop();
  const { lesson, loading, error } = useFetchLessonDetail(lessonId || "");

  // Audio player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [audioUrl, setAudioUrl] = useState("");
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  // ✅ Sử dụng hook transcript với playMode="free"
  const {
    transcript,
    currentCaption,
    currentCaptionIndex,
    userInput,
    setUserInput,
    feedback,
    checkAnswer,
    // jumpToCaption,
    nextCaption,
    prevCaption,
    replayCaption,
    resetDictation,
  } = useTranscriptPlayer({
    transcriptPath: lesson?.detail?.transcript_path ?? "",
    mediaRef: audioRef,
    mode: "audio",
    // ✅ Free mode - không cần Start button
  });

  console.log("📝 Transcript:", transcript);

  // Get full audio URL
  const getFullAudioUrl = useCallback((audioPath: string) => {
    if (!audioPath) return '';
    if (audioPath.startsWith('http://') || audioPath.startsWith('https://') || audioPath.startsWith('blob:')) {
      return audioPath;
    }
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    if (audioPath.startsWith('/')) {
      return `${baseUrl}${audioPath}`;
    }
    return `${baseUrl}/${audioPath}`;
  }, []);

  // Load audio file
  useEffect(() => {
    if (!lesson?.detail?.url) {
      setAudioUrl('');
      return;
    }

    const audioPath = lesson.detail.url;
    setIsAudioLoading(true);
    setAudioError(null);

    try {
      const fullUrl = getFullAudioUrl(audioPath);
      console.log('🎵 Audio URL:', fullUrl);
      console.log('🎵 Original path:', audioPath);
      setAudioUrl(fullUrl);
      setIsAudioLoading(false);
    } catch (err) {
      console.error('Error loading audio:', err);
      setAudioError('Failed to load audio file');
      setIsAudioLoading(false);
    }
  }, [lesson, getFullAudioUrl]);

  // Audio player setup
  useEffect(() => {
    if (!audioRef.current || !audioUrl) return;

    const audio = audioRef.current;
    setIsAudioLoading(true);
    setAudioError(null);

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      setDuration(audio.duration);
      setIsAudioLoading(false);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleLoadStart = () => setIsAudioLoading(true);
    const handleCanPlay = () => setIsAudioLoading(false);
    const handleError = () => {
      setAudioError('Failed to load audio file');
      setIsAudioLoading(false);
    };

    audio.volume = volume / 100;

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [audioUrl, volume]);

  // Audio controls
const togglePlayPause = () => {
  if (!audioRef.current) return;
  if (isPlaying) {
    audioRef.current.pause();
  } else {
    // Quan trọng: dùng playCaption để hook reset isPaused
    replayCaption();
  }
};

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const goBackToLessons = () => {
    if (courseType && slug) {
      navigate(`/courses/${courseType}/${slug}`);
    } else {
      navigate(-1);
    }
  };

  const handleCheck = () => {
    checkAnswer();
    setShowAnswer(true);
  };

  const handleNext = () => {
    nextCaption();
    setShowAnswer(false);
  };

  

  const progressPercentage = transcript.length 
    ? ((currentCaptionIndex + 1) / transcript.length * 100) 
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading lesson...</span>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Lesson not found</h2>
          <p className="text-muted-foreground mb-4">{error || "The lesson you're looking for doesn't exist."}</p>
          <Button onClick={goBackToLessons}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to lessons
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={goBackToLessons}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to lessons
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Star className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{lesson.title}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      {lesson.level}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {transcript.length} câu
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Audio Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{formatTime(currentTime)}</span>
              <span className="font-medium">
                Câu {currentCaptionIndex + 1}/{transcript.length}
              </span>
              <span className="text-muted-foreground">{formatTime(duration)}</span>
            </div>
            <Progress value={duration ? (currentTime / duration) * 100 : 0} className="h-2" />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Media Player */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardContent className="p-0">
                {/* Audio Player */}
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-t-lg">
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    className="hidden"
                    preload="metadata"
                  />

                  {audioError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <p className="text-red-800 text-sm">{audioError}</p>
                    </div>
                  )}

                  {/* Audio Controls */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-full h-20 bg-white/50 backdrop-blur rounded-lg flex items-center justify-center">
                      {isAudioLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                          <span className="text-purple-600">Loading audio...</span>
                        </div>
                      ) : (
                        <span className="text-purple-600 font-medium">🎵 Audio Player</span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 w-full">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={togglePlayPause}
                        disabled={isAudioLoading || !!audioError}
                        className="bg-white hover:bg-white/80"
                      >
                        {isAudioLoading ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : isPlaying ? (
                          <Pause className="h-6 w-6" />
                        ) : (
                          <Play className="h-6 w-6" />
                        )}
                      </Button>

                      <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleTimeChange}
                        className="flex-1"
                        disabled={isAudioLoading || !!audioError}
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

                {/* Tabs */}
                <div className="p-6">
                  <Tabs defaultValue="exercise">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="exercise">Exercise</TabsTrigger>
                      <TabsTrigger value="transcript">Transcript</TabsTrigger>
                      <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
                    </TabsList>

                    <TabsContent value="exercise" className="space-y-4 mt-4">
                      <div className="text-center">
                        <Badge variant="outline" className="mb-4">
                          Sentence {currentCaptionIndex + 1} / {transcript.length}
                        </Badge>
                        {currentCaption && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {formatTime(currentCaption.startTime)} - {formatTime(currentCaption.endTime)}
                          </p>
                        )}
                      </div>

                      <Input
                        placeholder="Type what you hear..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className="text-center text-lg py-4"
                        onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
                      />

                      <div className="flex justify-center gap-2 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={prevCaption}
                          disabled={currentCaptionIndex === 0}
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={replayCaption}
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Replay
                        </Button>

                        <Button
                          onClick={handleCheck}
                          className="bg-purple-600 hover:bg-purple-700"
                          disabled={!userInput.trim()}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Check
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNext}
                          disabled={currentCaptionIndex >= transcript.length - 1}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>

                      {showAnswer && feedback && (
                        <Card className={`${
                          feedback.includes('✅') 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                        }`}>
                          <CardContent className="p-4">
                            <p className={`text-center font-medium ${
                              feedback.includes('✅') ? 'text-green-800' : 'text-red-800'
                            }`}>
                              {feedback}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>

                    <TabsContent value="transcript" className="mt-4">
                      <Card>
                        <CardContent className="p-4 max-h-96 overflow-y-auto">
                          <div className="space-y-3">
                            {transcript.map((cap, idx) => (
                              <div
                                key={idx}
                                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                  idx === currentCaptionIndex
                                    ? 'bg-purple-50 border border-purple-200'
                                    : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                                // onClick={() => jumpToCaption(idx)}
                              >
                                <div className="flex items-start gap-3">
                                  <Badge variant="outline" className="flex-shrink-0">
                                    {idx + 1}
                                  </Badge>
                                  <p className="text-sm">{cap.captionText}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="vocabulary" className="mt-4">
                      <Card>
                        <CardContent className="p-4">
                          {lesson.vocabulary?.length ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {lesson.vocabulary.map((item, index) => (
                                <div key={index} className="border p-3 rounded-lg">
                                  <h4 className="font-bold text-purple-600">{item.word}</h4>
                                  <p className="text-sm text-muted-foreground">{item.meaning}</p>
                                  <p className="text-sm italic mt-1">"{item.example}"</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-center text-muted-foreground">
                              No vocabulary available
                            </p>
                          )}
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
            {/* Progress Card */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Your Progress</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Completed</span>
                    <span>{currentCaptionIndex}/{transcript.length}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="text-sm text-center text-muted-foreground">
                    {Math.round(progressPercentage)}% Complete
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={goBackToLessons}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back to lessons
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    // onClick={() => jumpToCaption(0)}
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
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {showAnswer ? 'Hide' : 'Show'} Answer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioLesson;