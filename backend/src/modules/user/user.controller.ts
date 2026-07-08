import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { UserService } from "./user.service";

const service = new UserService();

export class UserController {

  async profile(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

      const user = await service.getUser(req.user!.id);

      res.json(user);

    } catch (error) {

      next(error);

    }
  }

  async getAllUsers(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

      const users = await service.getAllUsers();

      res.json(users);

    } catch (error) {

      next(error);

    }
  }

  async getUser(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

      const id = req.params.id as string;

      const user = await service.getUser(id);

      res.json(user);

    } catch (error) {

      next(error);

    }
  }

  async update(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

      const id = req.params.id as string;

      const user = await service.updateUser(
        id,
        req.body
      );

      res.json(user);

    } catch (error) {

      next(error);

    }
  }

  async delete(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

      const id = req.params.id as string;

      await service.deleteUser(id);

      res.json({
        message: "User deleted"
      });

    } catch (error) {

      next(error);

    }
  }

}