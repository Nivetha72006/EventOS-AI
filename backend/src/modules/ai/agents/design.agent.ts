import gemini from "../services/gemini.service";
import imageGenerationService from "../services/image-generation.service";

export interface DesignInput {
  eventType: string;
  title?: string;
  theme?: string;
  preferredColors?: string[];
  description?: string;
  guestCount?: number;
  budget?: number;

  userSuggestion?: string;

  designType?:
    | "MEHENDI"
    | "INVITATION"
    | "DECORATION"
    | "STAGE"
    | "MANDAP"
    | "FLORAL"
    | "LIGHTING"
    | "FULL_EVENT";
}

class DesignAgent {

  async generate(data: DesignInput) {

    const prompt = `
You are an expert AI Event Design Agent.

Your job is to create personalized visual design concepts for events.

EVENT INFORMATION:
Event Type: ${data.eventType}
Event Title: ${data.title ?? "Not specified"}
Theme: ${data.theme ?? "Not specified"}
Preferred Colors: ${
      data.preferredColors?.join(", ") ?? "Not specified"
    }
Guest Count: ${data.guestCount ?? "Not specified"}
Budget: ${data.budget ?? "Not specified"}

USER'S DESIGN SUGGESTION:
${data.userSuggestion ?? "No specific suggestion provided"}

DESIGN TYPE:
${data.designType ?? "FULL_EVENT"}

Create a highly personalized design recommendation.

The design may include:
- Mehendi designs
- Wedding invitation designs
- Stage and backdrop designs
- Mandap designs
- Floral decorations
- Lighting
- Table and venue decoration
- Color palette
- Typography
- Patterns
- Decorative elements
- Traditional or modern styling

IMPORTANT:
The user's suggestion must strongly influence the result.

Return ONLY valid JSON.

Use exactly this structure:

{
  "designType": "string",
  "conceptName": "string",
  "theme": "string",
  "colorPalette": [
    "string"
  ],
  "style": "string",
  "designElements": [
    "string"
  ],
  "mehendiDesign": {
    "style": "string",
    "patterns": [
      "string"
    ],
    "description": "string"
  },
  "invitationDesign": {
    "style": "string",
    "layout": "string",
    "typography": "string",
    "decorativeElements": [
      "string"
    ]
  },
  "decorationDesign": {
    "stage": "string",
    "flowers": [
      "string"
    ],
    "lighting": "string",
    "backdrop": "string"
  },
  "imagePrompt": "A detailed prompt that can be given to an image generation model to generate the requested design."
}
`;

    const response = await gemini.generate(prompt);

try {
  let cleanedResponse = response.trim();

  // Remove Markdown code fences if Gemini returns ```json ... ```
  cleanedResponse = cleanedResponse
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  return JSON.parse(cleanedResponse);

} catch (error) {

  console.error("Failed to parse Gemini design response:", error);

  return {
    designType: data.designType ?? "FULL_EVENT",
    conceptName: "AI Generated Event Design",
    rawResponse: response
  };

}
  }

  async generateImage(
  imagePrompt: string,
  designType: string = "FULL_EVENT"
) {

  const safeType = designType
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

  const fileName =
    `${safeType}-${Date.now()}.png`;

  return imageGenerationService.generateImage(
    imagePrompt,
    fileName
  );
}
}

export default new DesignAgent();