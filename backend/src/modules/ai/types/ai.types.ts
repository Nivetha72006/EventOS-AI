export type AgentType =
  | "planner"
  | "recommendation"
  | "design"
  | "negotiation"
  | "emergency"
  | "chat";

export interface AIRequest {
  agent: AgentType;
  prompt: string;
  context?: any;
}

export interface AIResponse {
  success: boolean;
  data: string;
}