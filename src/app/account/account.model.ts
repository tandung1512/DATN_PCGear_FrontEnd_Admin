// src/app/account/account.model.ts
export interface Account {
  id: string;          // Custom ID
  name: string;
  password: string;
  phone: string;
  email: string;
  // address: string;
  image: string;
  admin: boolean;
  status: boolean;
  confirm: boolean;
  otp?: string | null;
}
