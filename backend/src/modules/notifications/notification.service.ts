import repository from "./notification.repository";
import { CreateNotificationDto } from "./notification.dto";
import { NotificationType } from "@prisma/client";

class NotificationService{

    createNotification(data:CreateNotificationDto,type:NotificationType){

        return repository.create(data,type);

    }

    getNotifications(userId:string){

        return repository.getUserNotifications(userId);

    }

    markRead(id:string){

        return repository.markAsRead(id);

    }

}

export default new NotificationService();