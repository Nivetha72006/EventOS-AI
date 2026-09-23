export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role: "USER" | "VENDOR";
}

export interface LoginDTO {
  email: string;
  password: string;
}