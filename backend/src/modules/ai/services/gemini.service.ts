import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

console.log("Gemini key exists:", !!apiKey);

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing from .env");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

class GeminiService {
  async generate(prompt: string) {
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
}

export default new GeminiService();