import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface AudioLessonData {
  id: string;
  title: string;
  level?: string;
  type: string;
  slug: string;
  detail: {
    id: number;
    title: string;
    url: string; // Đây là audio URL
    transcript_path: string;
    createdAt: string;
    updatedAt: string;
  };
  // Temporary fields for compatibility
  audioUrl?: string;
  transcript?: string;
  totalSentences?: number;
  correctAnswer?: string;
  vocabulary?: Array<{
    word: string;
    meaning: string;
    example: string;
  }>;
}

interface UseAudioLessonProps {
  lesson: AudioLessonData | null;
  courseType?: string;
  slug?: string;
}

interface UseAudioLessonReturn {
  // Audio states
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  audioRef: React.RefObject<HTMLAudioElement>;
  audioUrl: string;

  // Exercise states
  userInput: string;
  showAnswer: boolean;
  currentSentence: number;

  // Audio controls
  togglePlayPause: () => void;
  handleTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  seekTo: (time: number) => void;

  // Exercise controls
  handleCheck: () => void;
  handleSkip: () => void;
  handlePrevious: () => void;
  setUserInput: (value: string) => void;

  // Navigation controls
  restartLesson: () => void;
  goBackToLessons: () => void;
  toggleAnswer: () => void;

  // Utility functions
  formatTime: (seconds: number) => string;
  // getProgressPercentage: () => number;

  // Loading states
  isAudioLoading: boolean;
  audioError: string | null;
}

export const useAudioLesson = ({
  lesson,
  courseType,
  slug
}: UseAudioLessonProps): UseAudioLessonReturn => {
  const navigate = useNavigate();

  // Audio states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');

  // Exercise states
  const [userInput, setUserInput] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentSentence, setCurrentSentence] = useState(1);

  const audioRef = useRef<HTMLAudioElement>(null);


  // Transcript states
  const [transcript, setTranscript] = useState<any[]>([]);
  const [currentCaptionIndex, setCurrentCaptionIndex] = useState(0);
  const [currentCaption, setCurrentCaption] = useState<any>(null);


  // Load transcript khi lesson thay đổi
  useEffect(() => {
    if (!lesson?.detail?.transcript_path) return;

    const fetchTranscript = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}${lesson.detail.transcript_path}`);
        const vttText = await res.text();

        const cuePattern =
          /(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})[\s\S]*?(?=(\n\n|\n\d{2}:\d{2}:\d{2}\.\d{3}|\s*$))/g;

        const parsed: any[] = [];
        let match;

        while ((match = cuePattern.exec(vttText)) !== null) {
          const rawTextBlock = match[0].split("\n").slice(1).join("\n");
          const cleanedText = cleanCaption(rawTextBlock);

          if (cleanedText) {
            parsed.push({
              startTime: timeToSeconds(match[1]),
              endTime: timeToSeconds(match[2]),
              captionText: cleanedText,
            });
          }
        }

        setTranscript(parsed);
        setCurrentCaption(parsed[0] || null);
      } catch (err) {
        console.error("Error load transcript:", err);
      }
    };

    fetchTranscript();
  }, [lesson?.detail?.transcript_path]);

  // Theo dõi currentTime để pause tại endTime
  useEffect(() => {
    if (!audioRef.current || !transcript.length) return;
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      const time = audio.currentTime;
      setCurrentTime(time);

      const cap = transcript[currentCaptionIndex];
      if (cap && time >= cap.endTime - 0.1) {
        audio.pause();
        setIsPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [transcript, currentCaptionIndex]);

  // Hàm play caption theo index
  const playCaption = useCallback((index: number) => {
    if (!audioRef.current || !transcript[index]) return;

    const cap = transcript[index];
    setCurrentCaptionIndex(index);
    setCurrentCaption(cap);
    setUserInput("");
    setShowAnswer(false);

    audioRef.current.currentTime = cap.startTime;
    audioRef.current.play();
  }, [transcript]);


  // ---- Thêm util parse transcript (giống bên video) ----

  const timeToSeconds = (timeString: string) => {
    const [hours, minutes, seconds] = timeString.split(":");
    return (
      parseFloat(hours) * 3600 +
      parseFloat(minutes) * 60 +
      parseFloat(seconds)
    );
  };

  // Hàm làm sạch caption, loại bỏ thẻ và ký tự không cần thiết
  const cleanCaption = (rawText: string) => {
    return rawText
      .replace(/<\d{2}:\d{2}:\d{2}\.\d{3}><c>/g, "")
      .replace(/<\/c>/g, "")
      .replace(/\[.*?\]/g, "")
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };





  // Fetch audio file từ backend (simplified version)
  const getFullAudioUrl = useCallback((audioPath: string) => {
    if (!audioPath) return '';

    // Nếu url đã có domain thì return luôn
    if (audioPath.startsWith('http') || audioPath.startsWith('blob:')) {
      return audioPath;
    }

    // Ghép với base URL của backend
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    return `${baseUrl}${audioPath}`;
  }, []);

  // Get audio URL from lesson data
  const getAudioUrlFromLesson = useCallback((lesson: AudioLessonData) => {
    // Check if audio URL exists in detail.url (new structure)
    if (lesson.detail?.url) {
      return lesson.detail.url;
    }
    // Fallback to old structure
    if (lesson.audioUrl) {
      return lesson.audioUrl;
    }
    return '';
  }, []);



  // Load audio file khi lesson thay đổi
  useEffect(() => {
    if (!lesson) {
      setAudioUrl('');
      return;
    }

    const audioPath = getAudioUrlFromLesson(lesson);

    if (!audioPath) {
      setAudioUrl('');
      setAudioError('No audio file found');
      return;
    }

    console.log('Lesson data:', lesson);
    console.log('Audio path from lesson:', audioPath);

    const loadAudioFile = async () => {
      setIsAudioLoading(true);
      setAudioError(null);

      try {
        // Nếu là full URL thì dùng trực tiếp
        if (audioPath.startsWith('http')) {
          console.log('Using direct HTTP URL:', audioPath);
          setAudioUrl(audioPath);
          setIsAudioLoading(false);
        } else {
          // Tạo full URL
          const fullUrl = getFullAudioUrl(audioPath);
          console.log('Generated full URL:', fullUrl);
          setAudioUrl(fullUrl);
          setIsAudioLoading(false);
        }
      } catch (error) {
        console.error('Error loading audio file:', error);
        setAudioError('Failed to load audio file');
        setIsAudioLoading(false);
      }
    };

    loadAudioFile();
  }, [lesson, getAudioUrlFromLesson, getFullAudioUrl]);

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

    // Set initial volume
    audio.volume = volume / 100;

    // Add event listeners
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
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error('Error playing audio:', error);
        setAudioError('Failed to play audio');
      });
    }
  }, [isPlaying]);



  const handleTimeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);

    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  }, []);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  // Exercise controls
  // Show answer
  const handleCheck = useCallback(() => {
    setShowAnswer(true);
  }, []);

  // Skip to next sentence
  const handleSkip = useCallback(() => {
    if (!lesson || currentSentence >= lesson.totalSentences) return;

    setCurrentSentence(prev => prev + 1);
    setUserInput("");
    setShowAnswer(false);
  }, [currentSentence, lesson]);

  // Go back to previous sentence
  const handlePrevious = useCallback(() => {
    if (currentSentence <= 1) return;

    setCurrentSentence(prev => prev - 1);
    setUserInput("");
    setShowAnswer(false);
  }, [currentSentence]);

  // Navigation controls
  const restartLesson = useCallback(() => {
    setCurrentSentence(1);
    setUserInput("");
    setShowAnswer(false);

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      if (!isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error('Error restarting audio:', error);
        });
      }
    }
  }, [isPlaying]);

  const goBackToLessons = useCallback(() => {
    if (courseType && slug) {
      navigate(`/courses/${courseType}/${slug}`);
    } else {
      navigate(-1); // Go back to previous page
    }
  }, [navigate, courseType, slug]);

  const toggleAnswer = useCallback(() => {
    setShowAnswer(prev => !prev);
  }, []);

  // Utility functions
  const formatTime = useCallback((seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);




  // const getProgressPercentage = useCallback(() => {
  //   if (!lesson) return 0;
  //   const totalSentences = lesson.totalSentences || lesson.detail?.totalSentences || 10; // fallback
  //   return ((currentSentence - 1) / totalSentences) * 100;
  // }, [currentSentence, lesson]);

  // Reset states when lesson changes
  useEffect(() => {
    setCurrentSentence(1);
    setUserInput("");
    setShowAnswer(false);
    setCurrentTime(0);
    setIsPlaying(false);
  }, [lesson?.id]);

  return {
    // Audio states
    isPlaying,
    currentTime,
    duration,
    volume,
    audioRef,
    audioUrl,

    // Exercise states
    userInput,
    showAnswer,
    currentSentence,

    // Audio controls
    togglePlayPause,
    handleTimeChange,
    handleVolumeChange,
    seekTo,

    // Exercise controls
    handleCheck,
    handleSkip,
    handlePrevious,
    setUserInput,

    // Navigation controls
    restartLesson,
    goBackToLessons,
    toggleAnswer,

    // Utility functions
    formatTime,
    // getProgressPercentage,

    // Loading states
    isAudioLoading,
    audioError,
  };
};