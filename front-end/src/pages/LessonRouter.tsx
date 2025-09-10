import { useParams } from "react-router-dom";
import VideoLesson from "./VideoLesson";
import LessonTranslate from "./TranslateLesson";

const LessonRouter = () => {
  const { courseType } = useParams();

  // Render component dựa trên courseType
  switch (courseType) {
    case 'translate':
      return <LessonTranslate />;
    case 'video':
      return <VideoLesson />;
    // case 'audio':
    //   return <LessonAudio />;
    // case 'toeic':
    //   return <LessonDetail />; // hoặc LessonToeic nếu bạn có component riêng
    // case 'one-on-one':
    //   return <LessonDetail />; // hoặc LessonOneOnOne nếu bạn có component riêng
  
  }
};
export default LessonRouter;
