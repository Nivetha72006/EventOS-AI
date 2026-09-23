import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";

class RecommendationRepository {

  async getEvent(eventId: string) {
    return prisma.event.findUnique({
      where: {
        id: eventId
      },
      include: {
        user: true,
        bookings: {
          include: {
            vendor: true
          }
        },
        requirements: true
      }
    });
  }

  async create(data: Prisma.RecommendationUncheckedCreateInput) {
  return prisma.recommendation.create({
    data,
    include: {
      vendor: {
        include: {
          services: true
        }
      }
    }
  });
}

  async deleteByEvent(eventId: string) {
  return prisma.recommendation.deleteMany({
    where: {
      eventId
    }
  });
}

  async getCandidateVendors(eventId: string) {

    const event = await prisma.event.findUnique({

        where: {
            id: eventId
        },

        include: {
            requirements: true
        }

    });

    if (!event) {
        throw new Error("Event not found");
    }

    const categories = event.requirements.map(r => r.category);

    return prisma.vendor.findMany({

        where: {

            verified: true,

            status: "APPROVED",

            services: {

                some: {

                    category: {
                        in: categories
                    },

                    supportedEvents: {
                        has: event.eventType
                    },

                    OR: event.guestCount != null ? [
                        { minGuests: null },
                        { minGuests: { lte: event.guestCount } }
                    ] : undefined
                }

            }

        },

        include: {

            services: true

        }

    });

}

  async getRecommendations(eventId: string) {
    return prisma.recommendation.findMany({
      where: {
        eventId
      },
      include: {
        vendor: {
          include: {
            services: true
          }
        }
      },
      orderBy: {
        aiScore: "desc"
      }
    });
  }

  async saveRecommendations(data: {
    userId: string;
    eventId: string;
    recommendedVendorId: string;
    score: number;
    reason: string;
    aiScore?: number;
    confidence?: number;
    matchReasons?: any;
}[]) {
    return prisma.recommendation.createMany({
        data: data.map(item => ({
            userId: item.userId,
            eventId: item.eventId,
            recommendedVendorId: item.recommendedVendorId,
            score: item.score,
            reason: item.reason,
            aiScore: item.aiScore,
            confidence: item.confidence,
            matchReasons: item.matchReasons
        }))
    });
}

}

export default new RecommendationRepository();