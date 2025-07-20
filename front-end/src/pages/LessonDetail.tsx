import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Star, Play, Pause, Volume2, Settings, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";

const LessonDetail = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(12);
  const [duration, setDuration] = useState(738);
  const [userInput, setUserInput] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentSentence, setCurrentSentence] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sample lesson data
  const lessonData = {
    id: 1,
    title: "Snow White",
    level: "B1",
    type: "Dictation",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    totalSentences: 211,
    correctAnswer: "Once upon a time, there was a beautiful princess named Snow White.",
    transcript: `Once upon a time, there was a beautiful princess named Snow White. 
    She lived in a castle with her stepmother, the Queen. 
    The Queen was very jealous of Snow White's beauty...`,
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleCheck = () => {
    setShowAnswer(true);
    // Logic to check answer would go here
  };

  const handleSkip = () => {
    if (currentSentence < lessonData.totalSentences) {
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
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
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to lessons
            </Button>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-2xl font-bold">{lessonData.title}</h1>
              <Badge variant="secondary">{lessonData.level}</Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">All exercises</span>
            <span className="text-sm text-muted-foreground">Top users</span>
            <span className="text-sm text-muted-foreground">Video lessons</span>
            <Button variant="outline" size="sm">Upgrade</Button>
            <Button variant="outline" size="sm">In-progress</Button>
            <Button variant="outline" size="sm">Notes</Button>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-sm text-muted-foreground">0 minutes</span>
          <Progress value={30} className="flex-1" />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="relative bg-gray-900 rounded-t-lg overflow-hidden">
                  <iframe
                    src={lessonData.videoUrl}
                    className="w-full h-[400px]"
                    title={lessonData.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  
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
                        <Volume2 className="h-4 w-4" />
                        <span className="text-sm">{formatTime(currentTime)} / {formatTime(duration)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span className="text-sm">YouTube</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exercise Controls */}
                <div className="p-4 space-y-4">
                  <Tabs defaultValue="dictation">
                    <TabsList>
                      <TabsTrigger value="dictation">Dictation</TabsTrigger>
                      <TabsTrigger value="transcript">Full transcript</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="dictation" className="space-y-4">
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
                            {currentSentence} / {lessonData.totalSentences}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSkip}
                            disabled={currentSentence === lessonData.totalSentences}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Input
                          placeholder="Type what you hear..."
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          className="text-center"
                        />
                        
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
                                <strong>Correct answer:</strong> {lessonData.correctAnswer}
                              </p>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="transcript">
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-sm leading-relaxed">{lessonData.transcript}</p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>

            {/* Video Options */}
            <div className="flex items-center gap-4 mt-4">
              <span className="text-sm">Video size: Normal</span>
              <Button variant="link" className="text-sm p-0">Hide video</Button>
              <Button variant="link" className="text-sm p-0">Show comments</Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Your Progress</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Completed</span>
                    <span>{currentSentence - 1}/{lessonData.totalSentences}</span>
                  </div>
                  <Progress value={(currentSentence - 1) / lessonData.totalSentences * 100} />
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
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Previous Lesson
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Next Lesson
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restart Lesson
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

export default LessonDetail;