import prisma from "../../config/prisma";

export class RecommendationRepository {

  async create(data: any) {
    return prisma.recommendation.create({
      data,
    });
  }

  async deleteByEvent(eventId: string) {
    return prisma.recommendation.deleteMany({
      where: {
        eventId,
      },
    });
  }

  async getByEvent(eventId: string) {
    return prisma.recommendation.findMany({
      where: {
        eventId,
      },
      include: {
        vendor: {
          include: {
            services: true,
          },
        },
      },
      orderBy: {
        score: "desc",
      },
    });
  }

}