import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing in .env");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

class GeminiService {

  async generate(prompt: string): Promise<string> {

    const result = await model.generateContent(prompt);

    return result.response.text();

  }

  async generateJSON<T>(prompt: string): Promise<T> {

    const result = await model.generateContent(prompt);

    let text = result.response.text().trim();

    // Remove Markdown code blocks if Gemini returns them
    text = text
      .replace(/^```json/i, "")
      .replace(/^```/i, "")
      .replace(/```$/i, "")
      .trim();

    try {

      return JSON.parse(text) as T;

    } catch (error) {

      console.error("Gemini Response:");
      console.error(text);

      throw new Error("Gemini returned invalid JSON.");

    }

  }

}

export default new GeminiService();