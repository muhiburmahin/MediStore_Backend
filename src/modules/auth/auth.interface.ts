import { Role } from "../../generated/prisma/client";

export interface IRegisterUserPayload {
  name: string;
  email: string;
  password: string;
  role?: Role;
  phone?: string;
}

export interface ILoginUserPayload {
  email: string;
  password: string;
}

export interface IJWTPayload {
  id: string;
  email: string;
  role: Role;
}
