import marketplaceRepository from "../../marketplace/marketplace.repository";
import emergencyAgent from "../agents/emergency.agent";

class EmergencyService {

  async findReplacement(
    eventId: string,
    vendorCategory: string,
    unavailableVendor: string
  ) {

    const candidates =
      await marketplaceRepository.getEmergencyCandidates(
        eventId,
        vendorCategory
      );

    if (candidates.length === 0) {
      throw new Error(
        "No suitable replacement vendors found"
      );
    }

    const event = await marketplaceRepository.getEventForAI(
      eventId
    );

    const result = await emergencyAgent.execute({

      eventType: event.eventType,

      city: event.city,

      guestCount: event.guestCount ?? 0,

      budget: event.budget ?? undefined,

      vendorCategory,

      unavailableVendor,

      candidates

    });

    return result;
  }

}

export default new EmergencyService();