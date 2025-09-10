import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AiService {
  private readonly apiKey = process.env.GEMINI_API_KEY;
  private readonly apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;


  //Tạo bài viết bằng AI
  async generateTextLesson(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const contents = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      return contents?.trim() || 'Không tạo được nội dung từ Gemini.';
    } catch (error) {
      console.error('Gemini API error:', error.response?.data || error.message);
      throw new Error('Không thể tạo nội dung từ Gemini.');
    }
  }



// Nếu cần thì giữ luôn extractJson ở đây
extractJson(text: string): string {
  const match = text.match(/{[\s\S]*}/);
  return match ? match[0] : '{}';
}

}
