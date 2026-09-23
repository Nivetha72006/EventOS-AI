export interface CreateMessageDto{

    senderId:string;

    receiverId:string;

    eventId?:string;

    content:string;

}