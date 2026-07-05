// import prisma from "../../../config/prisma";

// export class MemoryRepository {

//   async save(data:any){

//     return prisma.memory.create({

//       data

//     });

//   }

//   async getUserMemory(userId:string){

//     return prisma.memory.findMany({

//       where:{

//         userId

//       }

//     });

//   }

// }




import prisma from "../../../config/prisma";

export class MemoryRepository {

  async create(data: any) {
    return prisma.memory.create({
      data,
    });
  }

  async get(eventId: string) {
    return prisma.memory.findUnique({
      where: {
        eventId,
      },
    });
  }

  async update(eventId: string, context: any) {
    return prisma.memory.update({
      where: {
        eventId,
      },
      data: {
        context,
      },
    });
  }

  async delete(eventId: string) {
    return prisma.memory.delete({
      where: {
        eventId,
      },
    });
  }

}