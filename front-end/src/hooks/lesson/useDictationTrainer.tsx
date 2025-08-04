import { useEffect, useRef, useState } from "react";

// Utility: Chuyển "HH:MM:SS.mmm" → giây
const timeToSeconds = (timeString: string) => {
    const [hours, minutes, seconds] = timeString.split(":");
    return (
        parseFloat(hours) * 3600 +
        parseFloat(minutes) * 60 +
        parseFloat(seconds)
    );
};

// Hàm làm sạch caption
const cleanCaption = (rawText: string) => {
    return rawText
        .replace(/<\d{2}:\d{2}:\d{2}\.\d{3}><c>/g, "") // loại bỏ tag thời gian
        .replace(/<\/c>/g, "")                         // loại bỏ </c>
        .replace(/\[.*?\]/g, "")                       // loại bỏ [Music], [Applause]...
        .replace(/\n+/g, " ")                          // nối dòng bị ngắt
        .replace(/\s+/g, " ")                          // xóa thừa khoảng trắng
        .trim();                                       // trim
};

const useDictationTrainer = (transcriptPath: string, playerRef: any) => {
    const [transcript, setTranscript] = useState<any[]>([]);
    const [currentCaptionIndex, setCurrentCaptionIndex] = useState(0);
    const [currentCaption, setCurrentCaption] = useState<any>(null);
    const [userInput, setUserInput] = useState("");
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isPaused, setIsPaused] = useState(true);
    const [isStarted, setIsStarted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);

    const intervalRef = useRef<any>(null);

    // Load transcript
    useEffect(() => {
        const fetchAndParseVTT = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/transcripts/${transcriptPath}`);
                const vttText = await response.text();

                const cuePattern =
                    /(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})[\s\S]*?(?=(\n\n|\n\d{2}:\d{2}:\d{2}\.\d{3}|\s*$))/g;

                const parsed: any[] = [];
                let match;

                while ((match = cuePattern.exec(vttText)) !== null) {
                    const rawTextBlock = match[0].split("\n").slice(1).join("\n"); // loại bỏ dòng thời gian
                    const cleanedText = cleanCaption(rawTextBlock);

                    if (cleanedText) {
                        parsed.push({
                            startTime: timeToSeconds(match[1]),
                            endTime: timeToSeconds(match[2]),
                            captionText: cleanedText,
                        });
                    }
                }

                console.log("Transcript đã được parse:", parsed);
                setTranscript(parsed);
                setCurrentCaption(parsed[0]);
            } catch (error) {
                console.error("Error loading VTT file", error);
            }
        };

        if (transcriptPath) fetchAndParseVTT();
    }, [transcriptPath]);

    // Theo dõi thời gian video
    useEffect(() => {
        if (!isStarted || !playerRef?.current) return;

        intervalRef.current = setInterval(() => {
            const time = playerRef.current.getCurrentTime();
            setCurrentTime(time);
        }, 200);

        return () => clearInterval(intervalRef.current);
    }, [isStarted, playerRef]);

    // Dừng video đúng lúc
    useEffect(() => {
        if (!isStarted || !transcript.length) return;

        const caption = transcript[currentCaptionIndex];
        if (!caption) return;

        if (currentTime >= caption.startTime && currentTime <= caption.endTime) {
            setCurrentCaption(caption);

            if (currentTime >= caption.endTime - 0.2) {
                playerRef.current?.pauseVideo();
                setIsPaused(true);
            }
        }
    }, [currentTime, transcript, currentCaptionIndex, isStarted]);

    useEffect(() => {
        setCurrentCaption(transcript[currentCaptionIndex] || null);
    }, [currentCaptionIndex, transcript]);

    const playCaption = (index: number) => {
        if (!transcript[index] || !playerRef?.current) return;
        const cap = transcript[index];
        setCurrentCaptionIndex(index);
        setFeedback(null);
        setUserInput("");
        playerRef.current.seekTo(cap.startTime, true);
        playerRef.current.playVideo();
        setIsStarted(true);
    };

    const startDictation = () => {
        playCaption(0);
    };

    const nextCaption = () => {
        if (currentCaptionIndex + 1 < transcript.length) {
            playCaption(currentCaptionIndex + 1);
        }
    };

    const prevCaption = () => {
        if (currentCaptionIndex > 0) {
            playCaption(currentCaptionIndex - 1);
        }
    };

    const checkAnswer = () => {
        if (!currentCaption) return;
        const normInput = userInput.trim().toLowerCase().replace(/\s+/g, " ");
        const normAnswer = currentCaption.captionText.trim().toLowerCase().replace(/\s+/g, " ");
        if (normInput === normAnswer) {
            setFeedback("✅ Chính xác!");
        } else {
            setFeedback(`❌ Sai. Đáp án đúng: "${currentCaption.captionText}"`);
        }
    };

    return {
        currentCaption,
        currentCaptionIndex,
        userInput,
        setUserInput,
        feedback,
        checkAnswer,
        nextCaption,
        prevCaption,
        playCaption,
        startDictation,
        isPaused,
        transcript,
        setIsPaused
    };
};

export default useDictationTrainer;
