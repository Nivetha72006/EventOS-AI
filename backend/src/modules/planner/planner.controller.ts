import { Request, Response } from "express";
import plannerService from "./planner.service";

class PlannerController {

    async generate(req: Request, res: Response) {

        try {

            const planner = await plannerService.generate(
                req.body.eventId
            );

            res.status(200).json(planner);

        } catch (error: any) {

            res.status(500).json({
                message: error.message
            });

        }

    }

}

export default new PlannerController();