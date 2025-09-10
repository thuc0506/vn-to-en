import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, RotateCcw, Check, ChevronLeft, Eye, EyeOff, Star, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import useFetchLessonDetail from "../hooks/lesson/useFetchLessonDetail";
import useCheckAnswer from "../hooks/lesson/useCheckAnswer";

const LessonTranslate = () => {
  const { courseType, slug, lessonSlugAndId } = useParams();
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState("exercise");
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [showSentenceInput, setShowSentenceInput] = useState(true);
  const [translatedSentences, setTranslatedSentences] = useState({});

  // Lấy ID từ URL
  const lessonId = lessonSlugAndId?.split(".").pop();
  const { lesson, loading, error } = useFetchLessonDetail(lessonId || "");
  const { checkAnswer, loading: checking, result } = useCheckAnswer();

  // Phân tích nội dung thành từng câu
  const sentences = useMemo(() => {
    if (!lesson?.detail?.content) return [];
    
    // Tách nội dung thành các câu (dựa trên dấu chấm, chấm hỏi, chấm than)
    const splitSentences = lesson.detail.content
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    return splitSentences;
  }, [lesson?.detail?.content]);

  // Tạo nội dung hiển thị với các câu đã dịch được thay thế
  const getDisplayContent = () => {
    if (!lesson?.detail?.content) return "";
    
    let content = lesson.detail.content;
    
    // Thay thế từng câu đã dịch
    Object.entries(translatedSentences).forEach(([index, translation]) => {
      const originalSentence = sentences[parseInt(index)];
      if (originalSentence) {
        content = content.replace(originalSentence, translation);
      }
    });
    
    return content;
  };

  // Highlight câu hiện tại trong đoạn văn
  const getHighlightedContent = () => {
    const content = getDisplayContent();
    const currentOriginalSentence = sentences[currentSentence];
    const currentTranslatedSentence = translatedSentences[currentSentence];
    
    if (!currentOriginalSentence) return content;
    
    const sentenceToHighlight = currentTranslatedSentence || currentOriginalSentence;
    
    return content.replace(
      sentenceToHighlight,
      `<mark class="bg-yellow-200 p-1 rounded">${sentenceToHighlight}</mark>`
    );
  };

  const handleSentenceClick = (sentenceIndex) => {
    setCurrentSentence(sentenceIndex);
    setShowSentenceInput(true);
    setUserInput(translatedSentences[sentenceIndex] || "");
  };

  const handleCheck = () => {
    if (!userInput.trim()) return;
    checkAnswer(sentences[currentSentence] || "", userInput, lesson.level || "beginner");
    setShowResultPopup(true);
  };

  const handleSave = () => {
    // Lưu câu dịch của người dùng
    setTranslatedSentences(prev => ({
      ...prev,
      [currentSentence]: userInput
    }));
    
    // Reset input và đóng popup
    setUserInput("");
    setShowResultPopup(false);
    
    // Tự động chuyển sang câu tiếp theo
    if (currentSentence < sentences.length - 1) {
      setCurrentSentence(prev => prev + 1);
    } else {
      // Đã hoàn thành tất cả câu
      setCompleted(true);
      setShowSentenceInput(false);
    }
  };

  const handleNextSentence = () => {
    if (currentSentence < sentences.length - 1) {
      setCurrentSentence(prev => prev + 1);
      setUserInput(""); // Reset input khi chuyển câu
    }
  };

  const handlePrevSentence = () => {
    if (currentSentence > 0) {
      setCurrentSentence(prev => prev - 1);
      setUserInput(""); // Reset input khi chuyển câu
    }
  };

  const getProgress = () => {
    const translatedCount = Object.keys(translatedSentences).length;
    return sentences.length > 0 ? (translatedCount / sentences.length) * 100 : 0;
  };

  if (!lessonId) {
    return <div className="text-red-500">❌ Không tìm thấy ID bài học</div>;
  }

  if (loading) {
    return <div className="text-gray-500">⏳ Đang tải dữ liệu...</div>;
  }

  if (!lesson) {
    return (
      <div className="text-red-500">
        ❌ Không tìm thấy bài học.
        <Button onClick={() => navigate(-1)} className="ml-2">Quay lại</Button>
      </div>
    );
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
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to lessons
            </Button>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-2xl font-bold">{lesson.title}</h1>
              <Badge variant="secondary">{lesson.level}</Badge>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Lesson Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">IELTS Writing Task</h2>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowTranslation(!showTranslation)}
                      >
                        {showTranslation ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                        {showTranslation ? "Hide Translation" : "Show Translation"}
                      </Button>
                    </div>
                  </div>

                  {/* Main Content Display */}
                  <div className="prose max-w-none">
                    <div 
                      className="whitespace-pre-line mb-4 cursor-pointer"
                      dangerouslySetInnerHTML={{ 
                        __html: getHighlightedContent() 
                      }}
                      onClick={(e) => {
                        // Tìm câu được click
                        const clickedText = window.getSelection().toString();
                        if (clickedText) {
                          const sentenceIndex = sentences.findIndex(sentence => 
                            sentence.includes(clickedText) || clickedText.includes(sentence)
                          );
                          if (sentenceIndex !== -1) {
                            handleSentenceClick(sentenceIndex);
                          }
                        }
                      }}
                    />
                    
                    {showTranslation && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                        <h3 className="font-medium mb-2">Vietnamese Translation</h3>
                        <p className="whitespace-pre-line text-gray-700">
                          {lesson.detail?.translation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Exercise Section - Luôn hiển thị */}
                <div className="p-6 border-t bg-gray-50">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Translate Sentence by Sentence</h3>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            disabled={currentSentence === 0}
                            onClick={handlePrevSentence}
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </Button>
                          <span className="text-sm font-medium px-3 py-1 bg-white rounded border">
                            {currentSentence + 1} / {sentences.length}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            disabled={currentSentence === sentences.length - 1}
                            onClick={handleNextSentence}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Current Sentence in Content */}
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">
                          Current in Content:
                        </h4>
                        <p className="text-blue-900">
                          {translatedSentences[currentSentence] || sentences[currentSentence] || "Không có câu nào để hiển thị"}
                        </p>
                        {translatedSentences[currentSentence] && (
                          <Badge variant="outline" className="mt-2 text-green-600 border-green-600">
                            Already Translated
                          </Badge>
                        )}
                      </div>

                      {/* Translation Input */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Your English Translation:</h4>
                        <textarea
                          className="w-full h-24 p-3 border rounded-lg resize-none"
                          placeholder="Type your English translation here..."
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-center gap-4">
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={handleCheck}
                          disabled={checking || !userInput.trim()}
                        >
                          {checking ? "Checking..." : "Check Translation"}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            if (currentSentence < sentences.length - 1) {
                              setCurrentSentence(prev => prev + 1);
                              setUserInput(translatedSentences[currentSentence + 1] || "");
                            }
                          }}
                        >
                          Skip
                        </Button>
                      </div>
                  </div>
                </div>

                {/* Original Exercise Controls - Ẩn khi đang dịch từng câu */}
                {!showSentenceInput && (
                  <div className="p-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList>
                        <TabsTrigger value="exercise">Exercise</TabsTrigger>
                        <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
                        <TabsTrigger value="tips">Writing Tips</TabsTrigger>
                      </TabsList>
                      <TabsContent value="exercise" className="space-y-4">
                        <div className="space-y-4">
                          <h3 className="font-medium">Practice Task:</h3>
                          <p className="mb-4">
                            Summarize the main features of the graph in your own words (about 150 words)
                          </p>
                          <textarea
                            className="w-full h-48 p-3 border rounded-lg"
                            placeholder="Write your answer here..."
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                          />
                          <div className="flex justify-center gap-4">
                            <Button 
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={handleCheck}
                              disabled={checking}
                            >
                              {checking ? "Checking..." : "Check"}
                            </Button>
                            <Button variant="outline">Skip</Button>
                          </div>

                          {/* ✅ Hiển thị kết quả check */}
                          {result && !showResultPopup && (
                            <Card className="bg-green-50 border-green-200 mt-4">
                              <CardContent className="p-4 space-y-2 text-sm">
                                <p><strong>Điểm:</strong> {result.score}</p>
                                <p><strong>Từ vựng:</strong> {result.vocab}</p>
                                <p><strong>Ngữ pháp:</strong> {result.grammar}</p>
                                <p><strong>Ví dụ đúng:</strong> {result.correctExample}</p>
                                <p><strong>Gợi ý khác:</strong> {result.otherTip}</p>
                              </CardContent>
                            </Card>
                          )}

                          {showAnswer && (
                            <Card className="bg-green-50 border-green-200">
                              <CardContent className="p-4">
                                <p className="text-center text-green-800">
                                  <strong>Model Answer:</strong>
                                </p>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      </TabsContent>
                      <TabsContent value="vocabulary">
                        <div className="grid grid-cols-1 gap-4"></div>
                      </TabsContent>
                      <TabsContent value="tips">
                        <ul className="space-y-3 list-disc pl-5"></ul>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
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
                    <span>Sentences Translated</span>
                    <span>{Object.keys(translatedSentences).length} / {sentences.length}</span>
                  </div>
                  <Progress value={getProgress()} />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Progress</span>
                    <span>{Math.round(getProgress())}%</span>
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
                    onClick={() => navigate(`/courses/${courseType}/${slug}`)}
                  >
                    Back to all lessons
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setCurrentSentence(0);
                      setUserInput("");
                      setTranslatedSentences({});
                      setShowSentenceInput(false);
                    }}
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setShowTranslation(!showTranslation)}
                  >
                    {showTranslation ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                    {showTranslation ? "Hide Translation" : "Show Translation"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sentence List */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Sentences</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {sentences.map((sentence, index) => (
                    <div 
                      key={index}
                      className={`p-2 border rounded cursor-pointer transition-colors ${
                        index === currentSentence 
                          ? 'border-blue-500 bg-blue-50' 
                          : translatedSentences[index]
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleSentenceClick(index)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">
                          {index + 1}
                        </span>
                        {translatedSentences[index] && (
                          <Check className="h-3 w-3 text-green-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 truncate mt-1">
                        {sentence.substring(0, 50)}...
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Result Popup */}
      {showResultPopup && result && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Translation Result</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowResultPopup(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium mb-2">Original Sentence:</p>
                <p className="text-gray-700">{sentences[currentSentence]}</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-medium mb-2">Your Translation:</p>
                <p className="text-blue-800">{userInput}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm font-medium text-green-800">Score</p>
                  <p className="text-lg font-bold text-green-900">{result.score}</p>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm font-medium text-yellow-800">Vocabulary</p>
                  <p className="text-yellow-900">{result.vocab}</p>
                </div>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded">
                <p className="font-medium text-purple-800 mb-2">Grammar Feedback:</p>
                <p className="text-purple-900 text-sm">{result.grammar}</p>
              </div>

              <div className="p-4 bg-orange-50 border border-orange-200 rounded">
                <p className="font-medium text-orange-800 mb-2">Suggested Translation:</p>
                <p className="text-orange-900 text-sm">{result.correctExample}</p>
              </div>

              {result.otherTip && (
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded">
                  <p className="font-medium text-indigo-800 mb-2">Additional Tips:</p>
                  <p className="text-indigo-900 text-sm">{result.otherTip}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button 
                variant="outline"
                onClick={() => setShowResultPopup(false)}
              >
                Review Again
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={handleSave}
              >
                <Save className="h-4 w-4 mr-2" />
                Save & Replace
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Completion Modal */}
      {completed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <h3 className="text-xl font-bold mb-2">🎉 Lesson Completed!</h3>
            <p className="mb-4">
              You've successfully translated all {sentences.length} sentences! 
              The entire content is now in English.
            </p>
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="text-green-800 font-medium">
                Progress: {Object.keys(translatedSentences).length}/{sentences.length} sentences completed
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setCompleted(false);
                  setShowSentenceInput(false);
                }}
              >
                View Final Result
              </Button>
              <Button onClick={() => navigate(`/courses/${courseType}/${slug}`)}>
                Back to Lessons
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonTranslate;