import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";

const service = new AuthService();

export class AuthController {

  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {

      const result = await service.register(req.body);

      res.status(201).json(result);

    } catch (error) {

      next(error);

    }
  }

  async login(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {

      const result = await service.login(req.body);

      res.json(result);

    } catch (error) {

      next(error);

    }
  }

}