export interface CreateQuotationDto {

    bookingId:string;

    vendorId:string;

    amount:number;

    message?:string;

    validTill?:Date;

}