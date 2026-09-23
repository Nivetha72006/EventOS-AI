import repository from "./message.repository";
import { CreateMessageDto } from "./message.dto";

class MessageService{

    send(data:CreateMessageDto){

        return repository.create(data);

    }

    conversation(user1:string,user2:string){

        return repository.getConversation(user1,user2);

    }

}

export default new MessageService();