import prisma from "../../config/prisma";
import { CreateNotificationDto } from "./notification.dto";
import { NotificationType } from "@prisma/client";

class NotificationRepository{

    create(data:CreateNotificationDto,type:NotificationType){

        return prisma.notification.create({

            data:{
                ...data,
                type
            }

        });

    }

    getUserNotifications(userId:string){

        return prisma.notification.findMany({

            where:{userId},

            orderBy:{
                createdAt:"desc"
            }

        });

    }

    markAsRead(id:string){

        return prisma.notification.update({

            where:{id},

            data:{
                isRead:true
            }

        });

    }

}

export default new NotificationRepository();