import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TranslateLesson } from '../entities/translate-lesson.entity';
import { CreateTextLessionDto } from '../dto/translate-lesson.dto';
import { AiService } from '../../ai/ai.service';
import { Lesson } from '../entities/lesson.entity'; // đường dẫn nếu bạn đặt riêng module AI, nếu đặt trong cùng module thì sửa lại

@Injectable()
export class TranslateLessonService {
    constructor(
        @InjectRepository(TranslateLesson)
        private readonly lessionTextRepository: Repository<TranslateLesson>,
        @InjectRepository(Lesson)
        private lessonRepository: Repository<Lesson>,
        private readonly aiService: AiService,
    ) { }


    // Tạo bài học văn bản bằng AI
    async createWithAI(dto: CreateTextLessionDto): Promise<TranslateLesson> {
        // Tạo prompt gửi cho AI (Gemini)
        const prompt = `
Chỉ viết một đoạn văn ngắn bằng Tiếng Việt, trình độ ${dto.level}, 
 ${dto.number_of_question} câu, 
 về chủ đề "${dto.topic}". 
 Chỉ xuất ra đoạn văn thôi.
`;
        const content = await this.aiService.generateTextLesson(prompt);

        const slug = dto.title ? dto.title.toLowerCase().replace(/\s+/g, '-') : 'translate-lesson';

        // Tạo lesson
        const lesson = this.lessonRepository.create({
            title: dto.title,
            slug: slug,
            type: 'translate',
            section: null
        });
        await this.lessonRepository.save(lesson);

        // Lưu vào database
        const translateLesson = this.lessionTextRepository.create({
            lesson: lesson,
            title: dto.title,
            content,
            level: dto.level,
            number_of_question: dto.number_of_question
        });
        return this.lessionTextRepository.save(translateLesson);

       
    }


    //Hint cho câu
    async generateHintBySentence(sentence: string, level: string): Promise<{
        vocab: string;
        grammar: string;
        suggestion: string;
    }> {
        if (!sentence || sentence.trim().length === 0) {
            throw new Error("Câu không hợp lệ.");
        }

        const prompt = `
Bạn là giáo viên dạy viết tiếng Anh.

Trình độ người học: ${level}

Hãy phân tích câu sau để đưa ra gợi ý phù hợp:

"${sentence}"

Trả về JSON:
{
  "vocab": string (gợi ý từ vựng phù hợp, nghĩa tiếng Việt nếu cần),
  "grammar": string (mẫu câu, cấu trúc nên áp dụng theo trình độ ${level}),
  "suggestion": string (viết lại câu hoàn chỉnh đúng ngữ pháp và hợp lý)
}

Chỉ trả JSON, không cần văn bản ngoài.
`.trim();

        const result = await this.aiService.generateTextLesson(prompt);
        const jsonString = this.aiService.extractJson(result);

        try {
            return JSON.parse(jsonString);
        } catch (err) {
            console.error("Lỗi parse JSON từ Gemini:", result);
            throw new Error("Không thể phân tích phản hồi Gemini.");
        }
    }


    //Kiểm  tra câu trả lời
    async checkAnswer(
        sentence: string,
        answer: string,
        level: string,
    ): Promise<{
        score: number;
        vocab: string;
        grammar: string;
        correctExample: string;
        otherTip: string;
    }> {
        const prompt = `
Bạn là giáo viên tiếng Anh trình độ cao.

Trình độ của người học: ${level}

Hãy so sánh câu người học viết với câu gốc và đánh giá mức độ chính xác.

- Câu gốc: "${sentence}"
- Câu của người học: "${answer}"

Yêu cầu đánh giá:
- Ưu tiên đúng **ý nghĩa**, sau đó đến **từ vựng**, **ngữ pháp** và **cấu trúc**.
- Với trình độ ${level}, nếu người học viết đơn giản đúng ý nghĩa thì vẫn đạt điểm cao.
- Đừng chấm điểm thấp nếu khác cấu trúc nhưng vẫn truyền đạt được ý nghĩa.
- Nếu sai ngữ pháp nghiêm trọng hoặc sai ý nghĩa thì trừ điểm mạnh.

Trả về JSON:
{
  "score": number (0-100),
  "vocab": string (phân tích lỗi từ vựng hoặc dùng từ không phù hợp),
  "grammar": string (lỗi ngữ pháp hoặc cấu trúc câu),
  "correctExample": string (ví dụ câu đúng gợi ý),
  "otherTip": string (gợi ý cải thiện, lời khuyên thêm)
}

Chỉ trả JSON. Không viết văn bản ngoài JSON.
Luôn trả lời bằng tiếng Việt.
`.trim();

        const result = await this.aiService.generateTextLesson(prompt);
        const jsonString = this.aiService.extractJson(result);

        try {
            return JSON.parse(jsonString);
        } catch (err) {
            console.error("Lỗi parse JSON từ Gemini:", result);
            throw new Error("Không thể phân tích phản hồi Gemini.");
        }
    }


    async findById(id: number): Promise<TranslateLesson> {
        return this.lessionTextRepository.findOneBy({ id });
    }


}
