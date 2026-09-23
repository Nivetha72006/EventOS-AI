import { Request, Response, NextFunction } from "express";
import emergencyService from "../services/emergency.service";

class EmergencyController {

  async findReplacement(
    req: Request,
    res: Response,
    next: NextFunction
  ) {

    try {

      const {
        eventId,
        vendorCategory,
        unavailableVendor
      } = req.body;

      if (!eventId) {
        return res.status(400).json({
          success: false,
          message: "eventId is required"
        });
      }

      if (!vendorCategory) {
        return res.status(400).json({
          success: false,
          message: "vendorCategory is required"
        });
      }

      if (!unavailableVendor) {
        return res.status(400).json({
          success: false,
          message: "unavailableVendor is required"
        });
      }

      const result =
        await emergencyService.findReplacement(
          eventId,
          vendorCategory,
          unavailableVendor
        );

      return res.json({
        success: true,
        data: result
      });

    } catch (error) {

      next(error);

    }

  }

}

export default new EmergencyController();