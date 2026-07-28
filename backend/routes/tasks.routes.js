import { Router } from "express";
import { authorize } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
  getTasksQuerySchema,
} from "../validators/task.validator.js";

import {
  createTask,
  deleteTask,
  getAllTask,
  getTaskById,
  updateTask,
} from "../controllers/tasks.controller.js";

const taskRoute = Router();

// GET /api/v1/tasks
taskRoute.get(
  "/",
  authorize,
  validate(getTasksQuerySchema, "query"),
  getAllTask
);

// GET /api/v1/tasks/:id
taskRoute.get(
  "/:id",
  authorize,
  validate(taskIdParamSchema, "params"),
  getTaskById
);

// POST /api/v1/tasks
taskRoute.post("/", authorize, validate(createTaskSchema), createTask);

// PUT /api/v1/tasks/:id
taskRoute.put(
  "/:id",
  authorize,
  validate(taskIdParamSchema, "params"),
  validate(updateTaskSchema),
  updateTask
);

// DELETE /api/v1/tasks/:id
taskRoute.delete(
  "/:id",
  authorize,
  validate(taskIdParamSchema, "params"),
  deleteTask
);

export default taskRoute;
