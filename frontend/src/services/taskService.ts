import { api } from "@/lib/api";
import type { Task, CreateTaskInput, UpdateTaskInput } from "@/types/task";

export interface TasksResponse {
  success: boolean;
  tasks: Task[];
  message?: string;
}

export interface TaskResponse {
  success: boolean;
  task: Task;
  message?: string;
}

export const getTasksApi = async (): Promise<TasksResponse> => {
  const response = await api.get<TasksResponse>("/tasks");
  return response.data;
};

export const getTaskByIdApi = async (id: number | string): Promise<TaskResponse> => {
  const response = await api.get<TaskResponse>(`/tasks/${id}`);
  return response.data;
};

export const createTaskApi = async (data: CreateTaskInput): Promise<TaskResponse> => {
  const response = await api.post<TaskResponse>("/tasks", data);
  return response.data;
};

export const updateTaskApi = async (
  id: number | string,
  data: UpdateTaskInput
): Promise<TaskResponse> => {
  const response = await api.put<TaskResponse>(`/tasks/${id}`, data);
  return response.data;
};

export const deleteTaskApi = async (id: number | string): Promise<TaskResponse> => {
  const response = await api.delete<TaskResponse>(`/tasks/${id}`);
  return response.data;
};
