import plannerRepository from "./planner.repository";
import plannerAgent from "../ai/agents/planner.agent";

class PlannerService {

    async generate(eventId: string) {

        // 1. Load Event
        const event = await plannerRepository.getEvent(eventId);

        if (!event) {
            throw new Error("Event not found");
        }

        // 2. Generate AI Plan
        const aiResponse = await plannerAgent.generate(event);

        // 3. Create Planner
        let planner = await plannerRepository.findPlanner(event.id);

        if (!planner) {
            planner = await plannerRepository.createPlanner(event.id);
        }

        // 4. Save Tasks
        if (aiResponse.tasks?.length) {
            await plannerRepository.createTasks(
                planner.id,
                aiResponse.tasks
            );
        }

        // 5. Save Reminders
        if (aiResponse.reminders?.length) {
            await plannerRepository.createReminders(
                planner.id,
                aiResponse.reminders
            );
        }

        // 6. Save Vendor Instructions
        if (aiResponse.vendorInstructions?.length) {
            await plannerRepository.createVendorInstructions(
                planner.id,
                aiResponse.vendorInstructions
            );
        }

        // 7. Return Complete Planner
        return await plannerRepository.getPlanner(event.id);

    }

}

export default new PlannerService();