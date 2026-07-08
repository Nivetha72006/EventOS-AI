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
  context?: Record<string, unknown>;
}

export interface AIResponse {
  success: boolean;
  data: string;
}