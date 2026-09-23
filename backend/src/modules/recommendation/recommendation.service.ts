import { EventRepository } from "../event/event.repository";
import recommendationRepo from "./recommendation.repository";
import recommendationAgent from "../ai/agents/recommendation.agent";

type Event = Awaited<ReturnType<EventRepository["findById"]>>;

type Vendor = Awaited<
ReturnType<typeof recommendationRepo.getCandidateVendors>

> [number];

const eventRepo = new EventRepository();

export class RecommendationService {

private scoreVendor(
vendor: Vendor,
event: NonNullable<Event>
) {


let score = 0;

const reasons: string[] = [];

// Same City
if (
  vendor.city.toLowerCase() ===
  event.city.toLowerCase()
) {
  score += 25;
  reasons.push("Located in the same city");
}

// Same State
if (
  vendor.state.toLowerCase() ===
  event.state.toLowerCase()
) {
  score += 10;
  reasons.push("Located in the same state");
}

// Budget Match
if (
  event.budget &&
  vendor.minimumPrice &&
  vendor.maximumPrice &&
  vendor.minimumPrice <= event.budget &&
  vendor.maximumPrice >= event.budget
) {
  score += 20;
  reasons.push("Fits within budget");
}

// Verified Vendor
if (vendor.verified) {
  score += 15;
  reasons.push("Verified vendor");
}

// Rating
score += vendor.rating * 3;

if (vendor.rating >= 4) {
  reasons.push("Highly rated vendor");
}

// Experience
if (vendor.experience) {
  score += Math.min(vendor.experience, 10);

  reasons.push(
    `${vendor.experience} years experience`
  );
}

// Event Type Match
const services: any[] = (vendor as any).services || [];
const supportsEvent = services.some((service: any) =>
  service.supportedEvents?.includes(event.eventType)
);

if (supportsEvent) {
  score += 20;

  reasons.push(
    `Supports ${event.eventType}`
  );
}

// Guest Capacity Match
const supportsGuests = services.some((service: any) => {
  if (
    event.guestCount == null ||
    service.minGuests == null ||
    service.maxGuests == null
  ) {
    return false;
  }

  return (
    event.guestCount >= service.minGuests &&
    event.guestCount <= service.maxGuests
  );
});

if (supportsGuests) {
  score += 10;

  reasons.push(
    "Suitable for guest count"
  );
}

const aiScore = Math.min(score, 100);

const confidence = Math.min(
  100,
  Math.round(aiScore * 1.1)
);

return {
  score,
  aiScore,
  confidence,
  reasons
};


}

async generateRecommendations(eventId: string) {


const event = await eventRepo.findById(eventId);

if (!event) {
  throw new Error("Event not found");
}

// Only filtered vendors
const vendors =
  await recommendationRepo.getCandidateVendors(eventId);

// Print number of candidate vendors
console.log(
  "Candidate Vendors:",
  vendors.length
);

await recommendationRepo.deleteByEvent(eventId);

// Step 8.3
// Send only filtered vendors to Gemini
const ranked =
  await recommendationAgent.recommend({

    event: {
  id: event.id,
  title: event.title,
  eventType: event.eventType,
  city: event.city,
  state: event.state,
  country: event.country,
  budget: event.budget,
  guestCount: event.guestCount ?? 0
},

    vendors: vendors.map(vendor => ({
      businessName: vendor.businessName,
      city: vendor.city,
      rating: vendor.rating,
      verified: vendor.verified,
      minPrice: vendor.minimumPrice ?? 0,
      maxPrice: vendor.maximumPrice ?? 0,
      description: vendor.description ?? undefined
    }))

  });

// Step 8.4
// Convert Gemini results into database recommendations
const recommendations = ranked
  .map(item => {

    const vendor = vendors.find(
      v => v.businessName === item.businessName
    );

    if (!vendor) {
      return null;
    }

    return {
      userId: event.userId,
      eventId: event.id,
      recommendedVendorId: vendor.id,
      score: item.score,
      aiScore: item.score,
      confidence: item.score,
      reason: item.reason,
      matchReasons: [
        ...item.pros,
        ...item.cons
      ]
    };

  })
  .filter(
    (
      item
    ): item is NonNullable<typeof item> =>
      item !== null
  );

await recommendationRepo.saveRecommendations(
  recommendations
);

// Step 8.5
// Return saved recommendations
return recommendationRepo.getRecommendations(
  event.id
);


}
}

export default new RecommendationService();
