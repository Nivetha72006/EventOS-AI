import { Request, Response, NextFunction } from "express";
import negotiationAgent from "../agents/negotiation.agent";

class NegotiationController {

  async negotiate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {

    try {

      const {
        vendorName,
        currentPrice,
        userBudget
      } = req.body;

      if (!vendorName) {
        return res.status(400).json({
          success: false,
          message: "vendorName is required"
        });
      }

      if (
        currentPrice === undefined ||
        currentPrice === null
      ) {
        return res.status(400).json({
          success: false,
          message: "currentPrice is required"
        });
      }

      if (
        userBudget === undefined ||
        userBudget === null
      ) {
        return res.status(400).json({
          success: false,
          message: "userBudget is required"
        });
      }

      const result = await negotiationAgent.execute({
        vendorName,
        vendorPrice: Number(currentPrice),
        userBudget: Number(userBudget)
      });

      return res.json({
        success: true,
        data: result
      });

    } catch (error) {

      next(error);

    }

  }

}

export default new NegotiationController();