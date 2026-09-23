import gemini from "../services/gemini.service";
import { buildEmergencyPrompt } from "../prompts/emergency.prompt";
import { parseAIResponse } from "../utils/json.parser";

export interface EmergencyInput {
  eventType: string;
  city: string;
  guestCount: number;
  budget?: number;
  vendorCategory: string;
  unavailableVendor: string;
  candidates: unknown[];
}

class EmergencyAgent {

  async execute(data: EmergencyInput) {

    if (!data.eventType) {
      throw new Error("Event type is required");
    }

    if (!data.city) {
      throw new Error("Event city is required");
    }

    if (!data.vendorCategory) {
      throw new Error("Vendor category is required");
    }

    if (!data.candidates || !Array.isArray(data.candidates)) {
      throw new Error("Candidate vendors are required");
    }

    if (data.candidates.length === 0) {
      throw new Error("No replacement vendors available");
    }

    const prompt = buildEmergencyPrompt(data);

    const response = await gemini.generate(prompt);

    const parsedResponse = parseAIResponse(response);

    return {
      ...parsedResponse,
      agent: "emergency"
    };
  }

}

export default new EmergencyAgent();