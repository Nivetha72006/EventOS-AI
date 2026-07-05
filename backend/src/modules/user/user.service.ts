import { UserRepository } from "./user.repository";
import { UpdateUserDTO } from "./user.dto";

const repo = new UserRepository();

export class UserService {

  async getAllUsers() {
    return repo.findAll();
  }

  async getUser(id: string) {

    const user = await repo.findById(id);

    if (!user)
      throw new Error("User not found");

    return user;
  }

  async updateUser(id: string, data: UpdateUserDTO) {

    await this.getUser(id);

    return repo.update(id, data);
  }

  async deleteUser(id: string) {

    await this.getUser(id);

    return repo.delete(id);
  }

}