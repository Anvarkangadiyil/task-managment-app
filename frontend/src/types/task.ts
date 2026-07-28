import type { User } from "./user";

export type TaskStatus = "Pending" | "In_Progress" | "Completed" | "In Progress";


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

export interface PaginationMeta {
  totalTasks: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface TaskQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  userId?: string | number;
}

