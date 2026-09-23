import prisma from "../../config/prisma";

class PlannerRepository {

    async getEvent(eventId: string) {

        return prisma.event.findUnique({

            where: {
                id: eventId
            },

            include: {

                user: true,

                bookings: {
                    include: {
                        vendor: true
                    }
                }

            }

        });

    }

    async createPlanner(eventId: string) {

        return prisma.planner.create({

            data: {

                eventId

            }

        });

    }

    async createTasks(plannerId: string, tasks: any[]) {

        return prisma.plannerTask.createMany({

            data: tasks.map(task => ({

                plannerId,

                title: task.title,

                description: task.description,

                dueDate: task.dueDate ? new Date(task.dueDate) : null

            }))

        });

    }

    async createReminders(plannerId: string, reminders: any[]) {

        return prisma.reminder.createMany({

            data: reminders.map(reminder => ({

                plannerId,

                title: reminder.title,

                reminderTime: new Date(reminder.reminderTime)

            }))

        });

    }

    async createVendorInstructions(plannerId: string, instructions: any[]) {

        return prisma.vendorInstruction.createMany({

            data: instructions.map(item => ({

                plannerId,

                vendorCategory: item.vendorCategory,

                instruction: item.instruction

            }))

        });

    }

    async getPlanner(eventId: string) {

        return prisma.planner.findUnique({

            where: {

                eventId

            },

            include: {

                tasks: true,

                reminders: true,

                vendorInstructions: true

            }

        });

    }

    async findPlanner(eventId: string) {

    return prisma.planner.findUnique({

        where: {

            eventId

        }

    });

    }

}

export default new PlannerRepository();