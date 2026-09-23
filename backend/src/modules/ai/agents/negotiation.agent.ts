import gemini from "../services/gemini.service";
import { buildNegotiationPrompt } from "../prompts/negotiation.prompt";
import { parseAIResponse } from "../utils/json.parser";

export interface NegotiationInput {
  vendorName: string;
  serviceName?: string;
  vendorPrice: number;
  userBudget: number;
  eventType?: string;
  guestCount?: number;
  userMessage?: string;
}

class NegotiationAgent {

  async execute(data: NegotiationInput) {

    if (data.vendorPrice <= 0) {
      throw new Error("Vendor price must be greater than 0");
    }

    if (data.userBudget <= 0) {
      throw new Error("User budget must be greater than 0");
    }

    const prompt = buildNegotiationPrompt(data);

    const response = await gemini.generate(prompt);

    const parsedResponse = parseAIResponse(response);

    return {
      ...parsedResponse,
      vendorName: data.vendorName,
      currentPrice: data.vendorPrice,
      userBudget: data.userBudget,
      agent: "negotiation"
    };
  }

}

export default new NegotiationAgent();