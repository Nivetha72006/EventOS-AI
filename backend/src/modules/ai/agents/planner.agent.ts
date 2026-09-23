import gemini from "../services/gemini.service";
import { plannerPrompt } from "../prompts/planner.prompt";
import { parseAIResponse } from "../utils/json.parser";

class PlannerAgent {

    async generate(event: any) {

        const prompt = plannerPrompt(event);

        const response = await gemini.generate(prompt);

        return parseAIResponse(response);

    }

}

export default new PlannerAgent();