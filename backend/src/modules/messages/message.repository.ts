import prisma from "../../config/prisma";
import { CreateMessageDto } from "./message.dto";

class MessageRepository{

    create(data:CreateMessageDto){

        return prisma.message.create({
            data
        });

    }

    getConversation(user1:string,user2:string){

        return prisma.message.findMany({

            where:{

                OR:[

                    {
                        senderId:user1,
                        receiverId:user2
                    },

                    {
                        senderId:user2,
                        receiverId:user1
                    }

                ]

            },

            orderBy:{
                createdAt:"asc"
            }

        });

    }

}

export default new MessageRepository();