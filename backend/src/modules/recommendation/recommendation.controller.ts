import { Request, Response, NextFunction } from "express";
import { RecommendationService } from "./recommendation.service";

const service = new RecommendationService();

export class RecommendationController {

  async generate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {

      const eventId = req.params.eventId as string;

      const recommendations =
        await service.generateRecommendations(eventId);

      res.status(200).json(recommendations);

    } catch (error) {

      next(error);

    }
  }

}