import { RecommendationAgent } from "../agents/recommendation.agent";

interface RecommendationInput {
  event: {
    id: string;
    title: string;
    eventType: string;
    city: string;
    state: string;
    country: string;
    guestCount: number;
    budget?: number;
  };
  vendors: unknown[];
}

export class AIOrchestrator {

  private recommendationAgent = new RecommendationAgent();

  async execute(
    agent: string,
    data: RecommendationInput
  ) {
    switch (agent) {
      case "recommendation":
        return await this.recommendationAgent.execute(data);

      default:
        throw new Error("Unknown AI Agent");
    }
  }
}