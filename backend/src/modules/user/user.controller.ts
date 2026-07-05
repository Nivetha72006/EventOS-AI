import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { UserService } from "./user.service";

const service = new UserService();

export class UserController {

  async profile(req: AuthRequest, res: Response) {

    try {

      const user = await service.getUser(req.user!.id);

      res.json(user);

    } catch (err: any) {

      res.status(404).json({
        message: err.message,
      });

    }

  }

  async getAllUsers(req: AuthRequest, res: Response) {

    const users = await service.getAllUsers();

    res.json(users);

  }

  async getUser(req: AuthRequest, res: Response) {

    try {

      const user = await service.getUser(req.params.id);

      res.json(user);

    } catch (err: any) {

      res.status(404).json({
        message: err.message,
      });

    }

  }

  async update(req: AuthRequest, res: Response) {

    try {

      const user = await service.updateUser(
        req.params.id,
        req.body
      );

      res.json(user);

    } catch (err: any) {

      res.status(400).json({
        message: err.message,
      });

    }

  }

  async delete(req: AuthRequest, res: Response) {

    try {

      await service.deleteUser(req.params.id);

      res.json({
        message: "User deleted",
      });

    } catch (err: any) {

      res.status(400).json({
        message: err.message,
      });

    }

  }

}