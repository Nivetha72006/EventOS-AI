import repository from "./booking.repository";
import { CreateBookingDto } from "./booking.dto";

class BookingService {

    createBooking(userId: string, data: CreateBookingDto) {

        return repository.create(userId, data);

    }

    getEventBookings(eventId: string) {

        return repository.getEventBookings(eventId);

    }

    getVendorBookings(vendorId: string) {

        return repository.getVendorBookings(vendorId);

    }

}

export default new BookingService();