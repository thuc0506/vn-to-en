export class TopicDTO {
    title: string;
  
    description: string;

    type: 'video' | 'audio' | 'translate'; // Phân loại chủ đề, có thể là video, audio hoặc dịch thuật
  
    level: string; // Trình độ (A1-C1)
  
    totalLessons?: number; // Dấu `?` để tùy chọn, có thể không cần truyền
  
    image: string;
  }
  