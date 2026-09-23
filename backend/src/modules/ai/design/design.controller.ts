import { Request, Response, NextFunction } from "express";
import designAgent from "../agents/design.agent";

class DesignController {

  async generate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {

    try {

      const result = await designAgent.generate({
        eventType: req.body.eventType,
        title: req.body.title,
        theme: req.body.theme,
        preferredColors: req.body.preferredColors,
        description: req.body.description,
        guestCount: req.body.guestCount,
        budget: req.body.budget,
        userSuggestion: req.body.userSuggestion,
        designType: req.body.designType
      });

      res.json({
        success: true,
        data: result
      });

    } catch (error) {

      next(error);

    }
  }


  async generateImage(
    req: Request,
    res: Response,
    next: NextFunction
  ) {

    try {

      const {
        imagePrompt,
        designType
      } = req.body;

      if (!imagePrompt) {

        return res.status(400).json({
          success: false,
          message: "imagePrompt is required"
        });

      }

      const result =
        await designAgent.generateImage(
          imagePrompt,
          designType
        );

      res.json({
        success: true,
        data: result
      });

    } catch (error) {

      next(error);

    }
  }

}

export default new DesignController();