import prisma from "../config/prisma";

class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async create(data: any) {
    return prisma.user.create({
      data,
    });
  }
}

export default new UserRepository();