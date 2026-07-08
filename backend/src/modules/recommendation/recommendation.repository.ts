import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";

export class RecommendationRepository {

  async create(data: Prisma.RecommendationUncheckedCreateInput) {
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