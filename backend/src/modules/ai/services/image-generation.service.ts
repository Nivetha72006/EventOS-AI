import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";

class ImageGenerationService {

  async generateImage(
    prompt: string,
    fileName: string = "design.png"
  ) {

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing from .env");
    }

    try {

      // @google/genai is an ESM package
      const { GoogleGenAI } = await import("@google/genai");

      const ai = new GoogleGenAI({
        apiKey
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-image",
        contents: prompt,
        config: {
          responseModalities: ["IMAGE"]
        }
      });

      const parts =
        response.candidates?.[0]?.content?.parts ?? [];

      const imagePart = parts.find(
        (part: any) => part.inlineData?.data
      );

      if (!imagePart?.inlineData?.data) {
        throw new Error(
          "Image generation failed: no image data returned"
        );
      }

      const imageBuffer = Buffer.from(
        imagePart.inlineData.data,
        "base64"
      );

      const outputDirectory = path.join(
        process.cwd(),
        "generated-designs"
      );

      await fs.mkdir(
        outputDirectory,
        { recursive: true }
      );

      const outputPath = path.join(
        outputDirectory,
        fileName
      );

      await fs.writeFile(
        outputPath,
        imageBuffer
      );

      return {
        success: true,
        generated: true,
        fileName,
        filePath: outputPath,
        size: imageBuffer.length
      };

    } catch (error: any) {

      const errorMessage =
        error?.message ?? String(error);

      console.error(
        "Image generation error:",
        errorMessage
      );

      // Gemini image quota / rate limit
      if (
        errorMessage.includes("429") ||
        errorMessage.includes("RESOURCE_EXHAUSTED") ||
        errorMessage.includes("quota") ||
        errorMessage.includes("Quota exceeded")
      ) {

        return {
          success: false,
          generated: false,
          quotaExceeded: true,
          message:
            "Image generation is temporarily unavailable because the Gemini image-generation quota has been exceeded.",
          imagePrompt: prompt
        };
      }

      throw error;
    }
  }
}

export default new ImageGenerationService();