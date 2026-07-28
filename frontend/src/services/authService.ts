import { api } from "@/lib/api";
import type { User } from "@/types/user";

export interface AuthResponse {
  message: string;
  user: User;
  token?: string;
}

export const loginApi = async (email: string, password: string): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/login", { email, password });
  return res.data;
};

export const registerApi = async (
  name: string,
  email: string,
  password: string,
  role?: string
): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/register", {
    name,
    email,
    password,
    role,
  });
  return res.data;
};

export const logoutApi = async (): Promise<{ message: string }> => {
  const res = await api.post<{ message: string }>("/auth/logout");
  return res.data;
};

export const getMeApi = async (): Promise<{ user: User }> => {
  const res = await api.get<{ user: User }>("/auth/me");
  return res.data;
};
