import { TaskStatus } from "@prisma/client";
import z from "zod";

export const createTaskSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, "Title cannot be empty")
    .max(255, "Title must be at most 255 characters"),
  description: z.string().trim().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
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
    status: z.nativeEnum(TaskStatus).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const taskIdParamSchema = z.object({
  id: z
    .string({ required_error: "Task ID is required" })
    .regex(/^\d+$/, "Task ID must be a numeric integer"),
});
