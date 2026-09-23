import { Request, Response, NextFunction } from "express";
import service from "./message.service";
import { getIO } from "../../sockets/socket";

class MessageController {

  async send(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {

      const message = await service.send(req.body);

      const io = getIO();

      io.to(req.body.receiverId).emit(
        "receive-message",
        message
      );

      res.status(201).json(message);

    } catch (error) {
      next(error);
    }
  }

  async conversation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {

      const user1 = req.params.user1 as string;
      const user2 = req.params.user2 as string;

      const messages = await service.conversation(
        user1,
        user2
      );

      res.json(messages);

    } catch (error) {
      next(error);
    }
  }

}

export default new MessageController();