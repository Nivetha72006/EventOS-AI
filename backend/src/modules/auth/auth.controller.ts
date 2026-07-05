import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const service = new AuthService();

export class AuthController {

  async register(req: Request, res: Response) {

    try {

      const result = await service.register(req.body);

      res.status(201).json(result);

    } catch (error: any) {

      res.status(400).json({
        message: error.message,
      });

    }

  }

  async login(req: Request, res: Response) {

    try {

      const result = await service.login(req.body);

      res.json(result);

    } catch (error: any) {

      res.status(401).json({
        message: error.message,
      });

    }

  }

}