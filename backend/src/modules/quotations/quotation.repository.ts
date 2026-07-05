import prisma from "../../config/prisma";
import { CreateQuotationDto } from "./quotation.dto";

class QuotationRepository {

    create(data:CreateQuotationDto){

        return prisma.quotation.create({
  data: {
    bookingId: data.bookingId,
    vendorId: data.vendorId,
    amount: data.amount,
    message: data.message,
    validTill: data.validTill ? new Date(data.validTill) : null,
  },
});

    }

    getBookingQuotations(bookingId:string){

        return prisma.quotation.findMany({

            where:{

                bookingId

            },

            orderBy:{

                amount:"asc"

            }

        });

    }

    updateStatus(id:string,status:any){

        return prisma.quotation.update({

            where:{id},

            data:{status}

        });

    }

}

export default new QuotationRepository();