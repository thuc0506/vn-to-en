import { useEffect, useRef, useState, useCallback } from "react";

// ✅ Chuyển "HH:MM:SS.mmm" → giây
const timeToSeconds = (timeString: string) => {
  const [hours, minutes, seconds] = timeString.split(":");
  return (
    parseFloat(hours) * 3600 + parseFloat(minutes) * 60 + parseFloat(seconds)
  );
};

// ✅ Làm sạch caption
const cleanCaption = (rawText: string) => {
  return rawText
    .replace(/<\d{2}:\d{2}:\d{2}\.\d{3}><c>/g, "")
    .replace(/<\/c>/g, "")
    .replace(/\[.*?\]/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

interface UseTranscriptPlayerOptions {
  transcriptPath: string;
  mediaRef: any; // audioRef hoặc playerRef (YouTube)
  mode: "audio" | "video";
}

export const useTranscriptPlayer = ({
  transcriptPath,
  mediaRef,
  mode,
}: UseTranscriptPlayerOptions) => {
  const [transcript, setTranscript] = useState<any[]>([]);
  const [currentCaptionIndex, setCurrentCaptionIndex] = useState(0);
  const [currentCaption, setCurrentCaption] = useState<any>(null);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(true);
  const [isStarted, setIsStarted] = useState(mode === "audio");
  const [currentTime, setCurrentTime] = useState(0);

  const intervalRef = useRef<any>(null);
  const captionTimerRef = useRef<NodeJS.Timeout | null>(null); // 🕒 Timer cho audio

  // 📝 Load & parse transcript
  useEffect(() => {
    if (!transcriptPath) return;

    const fetchAndParseVTT = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}${transcriptPath}`);
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
        console.error("Error loading transcript:", err);
      }
    };

    fetchAndParseVTT();
  }, [transcriptPath]);

  // ⏱ Theo dõi currentTime
  useEffect(() => {
    if (!isStarted || !mediaRef?.current) return;

    if (mode === "video") {
      intervalRef.current = setInterval(() => {
        const time = mediaRef.current.getCurrentTime();
        setCurrentTime(time);
      }, 200);

      return () => clearInterval(intervalRef.current);
    }



    if (mode === "audio") {
      const audio = mediaRef.current;
      const onTimeUpdate = () => setCurrentTime(audio.currentTime);
      audio.addEventListener("timeupdate", onTimeUpdate);
      return () => audio.removeEventListener("timeupdate", onTimeUpdate);
    }
  }, [isStarted, mediaRef, mode]);

  // 🎯 Update caption theo currentTime
  useEffect(() => {
    if (!transcript.length) return;

    const cap = transcript.find(
      (c) => currentTime >= c.startTime && currentTime <= c.endTime
    );
    if (cap) {
      const idx = transcript.indexOf(cap);
      setCurrentCaptionIndex(idx);
      setCurrentCaption(cap);
    }
  }, [currentTime, transcript]);


  // ⏸ Tự động dừng video khi hết caption
  // 👉 Với Video (YouTube Player), ta dùng useEffect để theo dõi currentTime liên tục.
  //    Khi thời gian hiện tại vượt quá endTime của caption hiện tại → tự động pause video/audio.
  useEffect(() => {
    if (!transcript.length || !mediaRef?.current) return;

    const cap = transcript[currentCaptionIndex];
    if (!cap) return;

    // Khi currentTime vượt qua endTime của caption hiện tại và media chưa bị pause
    if (currentTime >= cap.endTime && !isPaused) {
      if (mode === "video") {
        // 🛑 Dừng video bằng API của YouTube
        mediaRef.current?.pauseVideo();
      } else {
        // 🛑 Dừng audio và tua nhẹ về trước endTime để tránh nhảy sang caption tiếp theo
        mediaRef.current?.pause();
        mediaRef.current.currentTime = cap.endTime - 0.001;
      }

      // Đánh dấu trạng thái đã pause để không gọi lại nhiều lần
      setIsPaused(true);
      console.log(`⏸ PAUSED at ${cap.endTime}s for caption index ${currentCaptionIndex}`);
    }
  }, [currentTime, currentCaptionIndex, transcript, mediaRef, mode, isPaused]);



  // ▶️ Phát caption theo index
  // 👉 Với video: dùng nút Start để bắt đầu (chạy tuần tự theo currentTime).
  // 👉 Với audio: phát thủ công từng caption và hẹn giờ tự dừng khi caption kết thúc.
 const playCaption = useCallback(
  (index: number) => {
    if (!transcript[index] || !mediaRef?.current) return;

    const cap = transcript[index];

    // 📝 Cập nhật caption hiện tại
    setCurrentCaptionIndex(index);
    setFeedback(null);
    setUserInput("");
    setCurrentCaption(cap);

    // ⏱ Xóa timer cũ nếu đang phát caption trước đó
    if (captionTimerRef.current) {
      clearTimeout(captionTimerRef.current);
    }

    // 📽 VIDEO (YouTube)
    if (mode === "video") {
      mediaRef.current.seekTo(cap.startTime, true);
      mediaRef.current.playVideo();

    // 🎧 AUDIO (HTMLAudioElement)
    } else {
      const audio = mediaRef.current;

      // Tua audio đến thời gian bắt đầu caption và phát
      audio.currentTime = cap.startTime;
      audio.play();

      // 👉 Thiết lập "gần tới cuối" thì bật timeupdate listener
     
      const duration = (cap.endTime - cap.startTime) * 1070;

      const handleTimeUpdate = () => {
        if (audio.currentTime >= cap.endTime) {
          audio.pause();
          audio.currentTime = cap.endTime - 0.001; // tua nhẹ để tránh tự nhảy caption kế
          setIsPaused(true);
          audio.removeEventListener("timeupdate", handleTimeUpdate);
          console.log(`⏸ Paused exactly at ${cap.endTime}s for caption ${index}`);
        }
      };

      // ⏰ Đặt timer gần cuối → mới bắt đầu "nghe" timeupdate
      captionTimerRef.current = setTimeout(() => {
        audio.addEventListener("timeupdate", handleTimeUpdate);
      }, Math.max(duration, 0));
    }

    // Đặt trạng thái đang phát
    setIsPaused(false);
  },
  [transcript, mediaRef, mode]
);



  // 🚀 Start (chỉ cho video)
  const startDictation = useCallback(() => {
    if (!transcript.length) return;
    setIsStarted(true);
    playCaption(0);
  }, [transcript, playCaption]);

  // ✅ Check answer
  const checkAnswer = useCallback(() => {
    if (!currentCaption) return;

    const normInput = userInput.trim().toLowerCase().replace(/\s+/g, " ");
    const normAnswer = currentCaption.captionText
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");

    if (normInput === normAnswer) {
      setFeedback("✅ Chính xác!");
    } else {
      setFeedback(`❌ Sai. Đáp án đúng: "${currentCaption.captionText}"`);
    }
  }, [userInput, currentCaption]);

  // ⏭ Next caption
  const nextCaption = useCallback(() => {
    if (currentCaptionIndex + 1 < transcript.length) {
      playCaption(currentCaptionIndex + 1);
    }
  }, [currentCaptionIndex, transcript, playCaption]);

  // ⏮ Previous caption
  const prevCaption = useCallback(() => {
    if (currentCaptionIndex > 0) {
      playCaption(currentCaptionIndex - 1);
    }
  }, [currentCaptionIndex, playCaption]);

  // 🔁 Replay
  const replayCaption = useCallback(() => {
    playCaption(currentCaptionIndex);
  }, [currentCaptionIndex, playCaption]);

  // 🔄 Reset
  const resetDictation = useCallback(() => {
    setIsStarted(mode === "audio");
    setCurrentCaptionIndex(0);
    setCurrentCaption(transcript[0] || null);
    setUserInput("");
    setFeedback(null);
    setIsPaused(true);
    setCurrentTime(0);

    // Clear timer audio cũ
    if (captionTimerRef.current) clearTimeout(captionTimerRef.current);

    if (mediaRef?.current) {
      if (mode === "video") {
        mediaRef.current.seekTo(0, true);
        mediaRef.current.pauseVideo();
      } else {
        mediaRef.current.currentTime = 0;
        mediaRef.current.pause();
      }
    }
  }, [transcript, mediaRef, mode]);

  return {
    transcript,
    currentCaption,
    currentCaptionIndex,
    userInput,
    setUserInput,
    feedback,
    isPaused,
    isStarted,
    currentTime,

    startDictation,
    checkAnswer,
    playCaption,
    nextCaption,
    prevCaption,
    replayCaption,
    resetDictation,
  };
};
