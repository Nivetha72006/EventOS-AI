import { EventRepository } from "../event/event.repository";
import vendorRepo from "../vendors/vendor.repository";
import { RecommendationRepository } from "./recommendation.repository";

type Event = Awaited<ReturnType<EventRepository["findById"]>>;
type Vendor = Awaited<ReturnType<typeof vendorRepo.findAll>>[number];

const eventRepo = new EventRepository();
const recommendationRepo = new RecommendationRepository();

export class RecommendationService {

  private scoreVendor(vendor: Vendor, event: NonNullable<Event>): number {

    let score = 0;

    // Location Match
    if (
      vendor.city.toLowerCase() === event.city.toLowerCase()
    ) {
      score += 40;
    }

    // Budget Match
    if (
      event.budget &&
      vendor.minimumPrice &&
      vendor.maximumPrice &&
      vendor.minimumPrice <= event.budget &&
      vendor.maximumPrice >= event.budget
    ) {
      score += 30;
    }

    // Verified Vendor
    if (vendor.verified) {
      score += 10;
    }

    // Rating (5 stars = 20 points)
    score += vendor.rating * 4;

    return score;
  }

  async generateRecommendations(eventId: string) {

    const event = await eventRepo.findById(eventId);

    if (!event) {
      throw new Error("Event not found");
    }

    const vendors = await vendorRepo.findAll();

    await recommendationRepo.deleteByEvent(eventId);

    const ranked: Array<{
      vendor: Vendor;
      score: number;
      recommendation: Awaited<
        ReturnType<RecommendationRepository["create"]>
      >;
    }> = [];

    for (const vendor of vendors) {

      const score = this.scoreVendor(vendor, event);

      const recommendation = await recommendationRepo.create({
        userId: event.userId,
        eventId,
        recommendedVendorId: vendor.id,
        score,
        reason: "AI recommendation will be generated later."
      });

      ranked.push({
        vendor,
        score,
        recommendation
      });

    }

    ranked.sort((a, b) => b.score - a.score);

    return ranked.slice(0, 5);

  }

}