import { RecommendationRequest } from "../types/recommendation.types";

export function buildRecommendationPrompt(
  data: RecommendationRequest
): string {

  return `
You are an AI Event Planning Expert.

Your task is to recommend the BEST vendors.

Event

Title: ${data.event.title}

Type: ${data.event.eventType}

City: ${data.event.city}

Budget: ₹${data.event.budget}

Guests: ${data.event.guestCount}

Available Vendors

${JSON.stringify(data.vendors, null, 2)}

Return ONLY a valid JSON array.

Do not include markdown.

Do not include explanations.

Format:

[
  {
    "businessName": "",
    "score": 0,
    "reason": "",
    "pros": [],
    "cons": []
  }
]

For every recommendation include

businessName

reason

score

pros

cons

`;
}