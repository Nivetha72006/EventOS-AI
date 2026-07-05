import repository from "./quotation.repository";
import { CreateQuotationDto } from "./quotation.dto";

class QuotationService{

    createQuotation(data:CreateQuotationDto){

        return repository.create(data);

    }

    getBookingQuotations(bookingId:string){

        return repository.getBookingQuotations(bookingId);

    }

    updateStatus(id:string,status:any){

        return repository.updateStatus(id,status);

    }

}

export default new QuotationService();