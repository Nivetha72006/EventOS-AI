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
  id: string;
  title: string;
  eventType: string;
  city: string;
  state: string;
  country: string;
  guestCount: number;
  budget?: number | null;
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