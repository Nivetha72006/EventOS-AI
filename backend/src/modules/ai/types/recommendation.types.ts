export interface VendorAI {

  businessName: string;

  city: string;

  rating: number;

  verified: boolean;

  minPrice: number;

  maxPrice: number;

  description?: string;

}

export interface EventAI {

  title: string;

  eventType: string;

  city: string;

  budget: number;

  guestCount: number;

}

export interface RecommendationRequest {

  event: EventAI;

  vendors: VendorAI[];

}

export interface RecommendationResult {

  businessName: string;

  score: number;

  reason: string;

  pros: string[];

  cons: string[];

}