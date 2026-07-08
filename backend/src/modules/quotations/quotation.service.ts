import repository from "./quotation.repository";
import { CreateQuotationDto } from "./quotation.dto";
import { QuotationStatus } from "@prisma/client";

class QuotationService{

    createQuotation(data:CreateQuotationDto){

        return repository.create(data);

    }

    getBookingQuotations(bookingId:string){

        return repository.getBookingQuotations(bookingId);

    }

    updateStatus(id: string, status: QuotationStatus) {

        return repository.updateStatus(id,status);

    }

}

export default new QuotationService();