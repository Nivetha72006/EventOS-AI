import { Request, Response } from "express";
import { RecommendationService } from "./recommendation.service";

const service = new RecommendationService();

export class RecommendationController {

  async generate(req: Request, res: Response) {

    try {

      const eventId = req.params.eventId as string;

      const recommendations = await service.generateRecommendations(eventId);

      res.status(200).json(recommendations);

    } catch (error: any) {

      res.status(400).json({
        message: error.message
      });

    }

  }

}