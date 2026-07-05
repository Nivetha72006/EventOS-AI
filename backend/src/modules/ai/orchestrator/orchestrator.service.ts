import { RecommendationAgent } from "../agents/recommendation.agent";

export class AIOrchestrator {

  private recommendationAgent = new RecommendationAgent();

  async execute(agent: string, data: any) {

    switch (agent) {

      case "recommendation":
        return await this.recommendationAgent.execute(data);

      default:
        throw new Error("Unknown AI Agent");

    }

  }

}