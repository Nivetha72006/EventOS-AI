import prisma from "../../config/prisma";
import { VendorCategory } from "@prisma/client";
import { MarketplaceFilters } from "./marketplace.types";

class MarketplaceRepository {

  async getVendorsForEvent(
    eventId: string,
    filters: MarketplaceFilters = {}
  ) {

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

    const requiredCategories = event.requirements.map(
      requirement => requirement.category
    );

    const serviceWhere: any = {
      supportedEvents: {
        has: event.eventType
      },

      OR: [
        {
          minGuests: null
        },
        {
          minGuests: {
            lte: event.guestCount
          }
        }
      ],

      AND: [
        {
          OR: [
            {
              maxGuests: null
            },
            {
              maxGuests: {
                gte: event.guestCount
              }
            }
          ]
        }
      ]
    };

    /*
     * If the event has vendor requirements,
     * only show services belonging to those categories.
     */
    if (requiredCategories.length > 0) {
      serviceWhere.category = {
        in: requiredCategories
      };
    }

    /*
     * Marketplace category filter.
     */
    if (filters.category) {
      serviceWhere.category = filters.category as VendorCategory;
    }

    /*
     * Price filters.
     */
    if (
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined
    ) {
      serviceWhere.basePrice = {};

      if (filters.minPrice !== undefined) {
        serviceWhere.basePrice.gte = filters.minPrice;
      }

      if (filters.maxPrice !== undefined) {
        serviceWhere.basePrice.lte = filters.maxPrice;
      }
    }

    return prisma.vendor.findMany({

      where: {

        verified: true,

        status: "APPROVED",

        city: event.city,

        services: {
          some: serviceWhere
        }

      },

      include: {

        services: {
          where: serviceWhere
        },

        portfolios: true

      }

    });
  }

  async getEmergencyCandidates(
  eventId: string,
  vendorCategory: string
) {

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
      city: event.city,

      services: {
        some: {
          category: vendorCategory as any,
          supportedEvents: {
            has: event.eventType
          },
          minGuests: event.guestCount != null ? { lte: event.guestCount } : undefined,
          maxGuests: event.guestCount != null ? { gte: event.guestCount } : undefined,
        }
      }
    },

    include: {
      services: {
        where: {
          category: vendorCategory as any,
          supportedEvents: {
            has: event.eventType
          }
        }
      },

      portfolios: true
    }
  });
}

async getEventForAI(eventId: string) {

  const event = await prisma.event.findUnique({
    where: {
      id: eventId
    },

    select: {
      id: true,
      eventType: true,
      city: true,
      state: true,
      country: true,
      guestCount: true,
      budget: true
    }
  });

  if (!event) {
    throw new Error("Event not found");
  }

  return event;
}
}

export default new MarketplaceRepository();