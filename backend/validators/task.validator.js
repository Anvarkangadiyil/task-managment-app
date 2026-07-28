import { TaskStatus } from "@prisma/client";
import z from "zod";

const taskStatusSchema = z.preprocess((val) => {
  if (typeof val === "string") {
    const normalized = val.trim().replace(/\s+/g, "_");
    if (["Pending", "In_Progress", "Completed"].includes(normalized)) {
      return normalized;
    }
  }
  return val;
}, z.nativeEnum(TaskStatus));

export const createTaskSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, "Title cannot be empty")
    .max(255, "Title must be at most 255 characters"),
  description: z.string().trim().optional().nullable(),
  status: taskStatusSchema.optional(),
});

export const updateTaskSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title cannot be empty")
      .max(255, "Title must be at most 255 characters")
      .optional(),
    description: z.string().trim().optional().nullable(),
    status: taskStatusSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });


export const taskIdParamSchema = z.object({
  id: z
    .string({ required_error: "Task ID is required" })
    .regex(/^\d+$/, "Task ID must be a numeric integer"),
});

export const getTasksQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  status: z.string().optional(),
  userId: z.string().optional(),
});

