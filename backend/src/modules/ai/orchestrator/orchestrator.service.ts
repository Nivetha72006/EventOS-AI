import recommendationAgent from "../agents/recommendation.agent";
import designAgent from "../agents/design.agent";
import plannerAgent from "../agents/planner.agent";
import assistantAgent from "../agents/assistant.agent";
import negotiationAgent from "../agents/negotiation.agent";
import emergencyAgent from "../agents/emergency.agent";

class AIOrchestrator {

  async execute(agent: string, data: any) {

    switch (agent.toLowerCase()) {

      case "recommendation":
        return await recommendationAgent.recommend(data);

      case "design":
        return await designAgent.generate(data);

      case "design-image":
      case "image":
        if (!data?.imagePrompt) {
          throw new Error("imagePrompt is required for image generation");
        }

        return await designAgent.generateImage(
          data.imagePrompt,
          data.designType ?? "FULL_EVENT"
        );

      case "planner":
        return await plannerAgent.generate(data);

      case "assistant":
        return await assistantAgent.execute(data);

      case "negotiation":
        return await negotiationAgent.execute(data);

      case "emergency":
        return await emergencyAgent.execute(data);

      default:
        throw new Error(
          `Unknown AI Agent: ${agent}. Supported agents: recommendation, design, design-image, planner, assistant, negotiation, emergency`
        );
    }
  }
}

export default new AIOrchestrator();