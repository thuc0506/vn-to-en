import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, RotateCcw, Check, AlertCircle, ChevronLeft, Clock, Eye, EyeOff, Star, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import useFetchLessonDetail from "../hooks/lesson/useFetchLessonDetail";
import { useTranslateLesson } from "../hooks/lesson/translate/useTranslateLesson";
import { useTranslationProgress } from "../hooks/lesson/translate/useTranslationProgress";
import { useSentenceProcessor } from "../hooks/lesson/translate/useSentenceProcessor";
import { usePopup } from "../hooks/lesson/translate/usePopup";
import { get } from "jquery";

const LessonTranslate = () => {
  const { courseType, slug, lessonSlugAndId } = useParams();
  const navigate = useNavigate();

  // UI State

  const [showTranslation, setShowTranslation] = useState(false);
  const [showSentenceInput, setShowSentenceInput] = useState(true);

  // Data Fetching
  const lessonId = lessonSlugAndId?.split(".").pop();
  const { lesson, loading, error } = useFetchLessonDetail(lessonId || "");
  const { checkAnswer, getHint, loading: checking, result, hint } = useTranslateLesson();

  // Translation Progress Management
  const {
    currentSentence,
    translatedSentences,
    userInput,
    completed,

    setUserInput,
    setCurrentSentence,
    setCompleted,
    saveSentence,
    nextSentence,
    prevSentence,
    goToSentence,
    resetProgress,
    getProgress,
    isSentenceTranslated,

  } = useTranslationProgress();

  const {
    showResultPopup,
    showHintPopup,
    openHintPopup,
    closeHintPopup,
    openPopup,
    closePopup
  } = usePopup();

  // Sentence Processing
  const {
    sentences,
    getHighlightedContent,
    findSentenceByText
  } = useSentenceProcessor(lesson?.detail?.content, translatedSentences);

  // Event Handlers
  const handleSentenceClick = (sentenceIndex: number) => {
    goToSentence(sentenceIndex);
    setShowSentenceInput(true);
  };

  const handleCheck = () => {
    if (!userInput.trim()) return;
    checkAnswer(sentences[currentSentence] || "", userInput, lesson?.level || "beginner");
    openPopup();
  };

  const handleHint = () => {
    getHint(sentences[currentSentence] || "", lesson?.level || "beginner");
    openHintPopup();
  }


  const handleSave = () => {
    saveSentence(currentSentence, userInput);
    setUserInput("");
    closePopup();

    if (!nextSentence(sentences.length)) {
      setShowSentenceInput(false);
    }
  };

  const handleContentClick = () => {
    const clickedText = window.getSelection()?.toString();
    if (clickedText) {
      const sentenceIndex = findSentenceByText(clickedText);
      if (sentenceIndex !== -1) {
        handleSentenceClick(sentenceIndex);
      }
    }
  };

  const handleRestart = () => {
    resetProgress();
    setShowSentenceInput(false);
  };

  // Early Returns
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
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
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
              <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {lesson.level}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{sentences.length} câu</span>
                </div>
              </div>
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTranslation(!showTranslation)}
                    >
                      {showTranslation ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                      {showTranslation ? "Hide Translation" : "Show Translation"}
                    </Button>
                  </div>

                  {/* Main Content Display */}
                  <div className="prose max-w-none">
                    <div
                      className="whitespace-pre-line mb-4 cursor-pointer"
                      dangerouslySetInnerHTML={{
                        __html: getHighlightedContent(currentSentence)
                      }}
                      onClick={handleContentClick}
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

                {/* Exercise Section */}
                <div className="p-6 border-t bg-gray-50">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Translate Sentence by Sentence</h3>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={currentSentence === 0}
                          onClick={() => prevSentence()}
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
                          onClick={() => nextSentence(sentences.length)}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Current Sentence Display */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">
                        Current in Content:
                      </h4>
                      <p className="text-blue-900">
                        {translatedSentences[currentSentence] || sentences[currentSentence] || "Không có câu nào để hiển thị"}
                      </p>
                      {isSentenceTranslated(currentSentence) && (
                        <Badge variant="outline" className="mt-2 text-green-600 border-green-600">
                          Already Translated
                        </Badge>
                      )}
                    </div>

                    {/* Translation Input */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Your English Translation:</h4>
                      <textarea
                        className="w-full h-44 p-3 border rounded-lg resize-none"
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
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={handleHint}

                      >
                        {checking ? "Hint..." : "Hint"}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => nextSentence(sentences.length)}
                      >
                        Skip
                      </Button>
                    </div>
                  </div>
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
                    <span>Sentences Translated</span>
                    <span>{Object.keys(translatedSentences).length} / {sentences.length}</span>
                  </div>
                  <Progress value={getProgress(sentences.length)} />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Progress</span>
                    <span>{Math.round(getProgress(sentences.length))}%</span>
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
                    onClick={handleRestart}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restart Lesson
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
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {sentences.map((sentence, index) => (
                    <div
                      key={index}
                      className={`p-2 border rounded cursor-pointer transition-colors ${index === currentSentence
                          ? 'border-blue-500 bg-blue-50'
                          : isSentenceTranslated(index)
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      onClick={() => handleSentenceClick(index)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">
                          {index + 1}
                        </span>
                        {isSentenceTranslated(index) && (
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

      {/* Result Popup - Redesigned */}
      {showResultPopup && result && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Kết Quả Đánh Giá</h3>
                    <p className="text-blue-100 text-sm">Phân tích chi tiết bản dịch của bạn</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closePopup}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Score Card - Prominent */}
              <div className={`p-6 rounded-xl border-2 transition-all ${result.score >= 80
                  ? 'text-green-600 bg-green-50 border-green-200'
                  : result.score >= 60
                    ? 'text-yellow-600 bg-yellow-50 border-yellow-200'
                    : 'text-red-600 bg-red-50 border-red-200'
                }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {result.score >= 80 ? (
                      <Check className="h-8 w-8" />
                    ) : (
                      <AlertCircle className="h-8 w-8" />
                    )}
                    <div>
                      <p className="text-sm font-medium opacity-80">Điểm Số</p>
                      <p className="text-4xl font-bold">{result.score}/100</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium opacity-80">Đánh Giá</p>
                    <p className="text-lg font-semibold">
                      {result.score >= 80 ? 'Xuất Sắc! 🎉' : result.score >= 60 ? 'Tốt 👍' : 'Cần Cải Thiện 💪'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Original & User Translation - Side by side */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-gray-200 p-1.5 rounded">
                      <Eye className="h-4 w-4 text-gray-600" />
                    </div>
                    <p className="font-semibold text-gray-700 text-sm">Câu Gốc</p>
                  </div>
                  <p className="text-gray-800 leading-relaxed">{sentences[currentSentence]}</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-blue-200 p-1.5 rounded">
                      <Star className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="font-semibold text-blue-700 text-sm">Bản Dịch Của Bạn</p>
                  </div>
                  <p className="text-blue-900 leading-relaxed">{userInput}</p>
                </div>
              </div>

              {/* Vocabulary Feedback */}
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-200">
                <div className="flex items-start gap-3">
                  <div className="bg-yellow-200 p-2 rounded-lg mt-1">
                    <Eye className="h-5 w-5 text-yellow-700" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-yellow-900 mb-2">📚 Phân Tích Từ Vựng</p>
                    <p className="text-yellow-800 text-sm leading-relaxed">{result.vocab}</p>
                  </div>
                </div>
              </div>

              {/* Grammar Feedback */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-200 p-2 rounded-lg mt-1">
                    <Check className="h-5 w-5 text-purple-700" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-purple-900 mb-2">📝 Nhận Xét Ngữ Pháp</p>
                    <p className="text-purple-800 text-sm leading-relaxed">{result.grammar}</p>
                  </div>
                </div>
              </div>

              {/* Correct Example - Highlighted */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-300">
                <div className="flex items-start gap-3">
                  <div className="bg-green-200 p-2 rounded-lg mt-1">
                    <Star className="h-5 w-5 text-green-700" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-green-900 mb-2">✨ Mẫu Câu Gợi Ý</p>
                    <p className="text-green-900 font-medium text-base leading-relaxed whitespace-pre-line">
                      {result.correctExample}
                    </p>
                  </div>

                </div>
              </div>

              {/* Additional Tips */}
              {result.otherTip && (
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200">
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-200 p-2 rounded-lg mt-1">
                      <Star className="h-5 w-5 text-orange-700" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-orange-900 mb-2">💡 Mẹo Cải Thiện</p>
                      <p className="text-orange-800 text-sm leading-relaxed">{result.otherTip}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
              <Button
                variant="outline"
                onClick={closePopup}
                className="px-6"
              >
                Xem Lại
              </Button>
              <Button
                className="px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
                onClick={handleSave}
              >
                <Save className="h-4 w-4 mr-2" />
                Lưu & Tiếp Tục
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hint Popup - Redesigned */}
      {showHintPopup && hint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
            {/* Hint Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Gợi Ý Hỗ Trợ</h3>
                    <p className="text-orange-100 text-sm">Hướng dẫn để hoàn thành tốt hơn</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeHintPopup}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Original Sentence */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-gray-200 p-1.5 rounded">
                    <Eye className="h-4 w-4 text-gray-600" />
                  </div>
                  <p className="font-semibold text-gray-700 text-sm">📖 Câu Cần Dịch</p>
                </div>
                <p className="text-gray-800 text-lg leading-relaxed">{sentences[currentSentence]}</p>
              </div>

              {/* Vocabulary Hints */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-200 p-2 rounded-lg">
                    <Eye className="h-5 w-5 text-blue-700" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-blue-900 mb-2">📚 Từ Vựng Gợi Ý</p>
                    <p className="text-blue-800 font-medium text-base leading-relaxed whitespace-pre-line leading-relaxed">{hint.vocab}</p>
                  </div>
                 
                </div>
              </div>

              {/* Grammar Structure */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-200 p-2 rounded-lg">
                    <Check className="h-5 w-5 text-purple-700" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-purple-900 mb-2">📝 Cấu Trúc Ngữ Pháp</p>
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <p className="text-purple-900 font-mono text-sm leading-relaxed">{hint.grammar}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggestion */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-300">
                <div className="flex items-start gap-3">
                  <div className="bg-green-200 p-2 rounded-lg">
                    <Star className="h-5 w-5 text-green-700" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-green-900 mb-3">✨ Gợi Ý Câu Hoàn Chỉnh</p>
                    <div className="bg-white p-4 rounded-lg border-2 border-green-200">
                      <p className="text-green-900 font-medium text-base leading-relaxed">{hint.suggestion}</p>
                    </div>
                    <p className="text-green-700 text-xs mt-2 italic">💡 Đây là câu tham khảo - hãy thử viết theo cách của bạn!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
              <Button
                className="px-6 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-lg"
                onClick={closeHintPopup}
              >
                Đóng Gợi Ý
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