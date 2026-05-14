export interface IUser {
  name: string;
  email: string;
  phone?: string;
  image?: string;
  role?: "CUSTOMER" | "SELLER" | "ADMIN";
  status?: "ACTIVE" | "BANNED";
}
