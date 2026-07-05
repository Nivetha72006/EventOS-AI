import prisma from "../../config/prisma";
import { BookingStatus } from "@prisma/client";
import { CreateBookingDto } from "./booking.dto";

class BookingRepository {

    async create(userId: string, data: CreateBookingDto) {

        return prisma.booking.create({

            data: {

                userId,

                eventId: data.eventId,

                vendorId: data.vendorId,

                serviceId: data.serviceId,

                notes: data.notes,

                status: BookingStatus.PENDING

            },

            include: {

                vendor: true,

                service: true,

                event: true

            }

        });

    }

    async getEventBookings(eventId: string) {

        return prisma.booking.findMany({

            where: {

                eventId

            },

            include: {

                vendor: true,

                service: true

            }

        });

    }

    async getVendorBookings(vendorId: string) {

        return prisma.booking.findMany({

            where: {

                vendorId

            },

            include: {

                event: true,

                service: true

            }

        });

    }

}

export default new BookingRepository();