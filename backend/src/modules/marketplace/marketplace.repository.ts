import prisma from "../../config/prisma";

class MarketplaceRepository {

  async getVendorsForEvent(eventId: string) {

    const event = await prisma.event.findUnique({

      where: {

        id: eventId

      }

    });

    if (!event) {

      throw new Error("Event not found");

    }

    return prisma.vendor.findMany({

      where: {

        verified: true,

        status: "APPROVED",

        city: event.city

      },

      include: {

        services:{
        where:{

            supportedEvents:{

            has:event.eventType
    }
}

},
        portfolios: true

      }

    });

  }

}

export default new MarketplaceRepository();