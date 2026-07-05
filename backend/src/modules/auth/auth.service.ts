import bcrypt from "bcryptjs";
import { UserRepository } from "../user/user.repository";
import { generateToken } from "../../utils/jwt";
import { RegisterDTO, LoginDTO } from "./auth.dto";

const userRepo = new UserRepository();

export class AuthService {

  async register(data: RegisterDTO) {

    const existing = await userRepo.findByEmail(data.email);

    if (existing)
      throw new Error("Email already exists");

    const hashed = await bcrypt.hash(data.password, 10);

    const user = await userRepo.create({
      name: data.name,
      email: data.email,
      password: hashed,
      role: "USER",
    });

    const token = generateToken(user.id);

    return {
      token,
      user,
    };
  }

  async login(data: LoginDTO) {

    const user = await userRepo.findByEmail(data.email);

    if (!user)
      throw new Error("Invalid credentials");

    const match = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!match)
      throw new Error("Invalid credentials");

    const token = generateToken(user.id);

    return {
      token,
      user,
    };
  }

}