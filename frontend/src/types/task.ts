import type { User } from "./user";

export type TaskStatus = "Pending" | "In Progress" | "Completed";

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
}
