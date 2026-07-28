import { Router } from "express";
import { authorize } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
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
taskRoute.get("/tasks", authorize, getAllTask);

// GET /api/v1/tasks/:id
taskRoute.get(
  "/tasks/:id",
  authorize,
  validate(taskIdParamSchema, "params"),
  getTaskById,
);

// POST /api/v1/tasks
taskRoute.post("/tasks", authorize, validate(createTaskSchema), createTask);



// PUT /api/v1/tasks/:id
taskRoute.put(
  "/tasks/:id",
  authorize,
  validate(taskIdParamSchema, "params"),
  validate(updateTaskSchema),
  updateTask,
);

// DELETE /api/v1/tasks/:id
taskRoute.delete(
  "/tasks/:id",
  authorize,
  validate(taskIdParamSchema, "params"),
  deleteTask,
);

export default taskRoute;
