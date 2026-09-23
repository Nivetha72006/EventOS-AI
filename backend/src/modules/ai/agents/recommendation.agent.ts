import gemini from "../services/gemini.service";
import { buildRecommendationPrompt } from "../prompts/recommendation.prompt";
import {
RecommendationRequest,
RecommendationResult
} from "../types/recommendation.types";
import { parseAIResponse } from "../utils/json.parser";

class RecommendationAgent {


async recommend(
    data: RecommendationRequest
): Promise<RecommendationResult[]> {

    const prompt = buildRecommendationPrompt(data);

    const response = await gemini.generate(prompt);

    return parseAIResponse(response) as RecommendationResult[];

}

}

export default new RecommendationAgent();




// import geminiService from "../services/gemini.service";
// import { buildRecommendationPrompt } from "../prompts/recommendation.prompt";
// import { RecommendationRequest } from "../types/recommendation.types";

// export class RecommendationAgent {

//   async execute(data: RecommendationRequest) {

//     const prompt = buildRecommendationPrompt(data);

//     return geminiService.generateJSON(prompt);

//   }

// }




// import geminiService from "../services/gemini.service";
// import { buildRecommendationPrompt } from "../prompts/recommendation.prompt";
// import {
//   RecommendationRequest,
//   RecommendationResult,
// } from "../types/recommendation.types";

// export class RecommendationAgent {

//   async execute(
//     data: RecommendationRequest
//   ): Promise<RecommendationResult[]> {

//     const prompt = buildRecommendationPrompt(data);

//     return geminiService.generateJSON<RecommendationResult[]>(prompt);

//   }

// }