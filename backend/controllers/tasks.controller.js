import { Role } from "@prisma/client";
import prisma from "../config/prisma.js";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
};

export const getAllTask = async (req, res) => {
  try {
    const where = req.user.role === Role.admin ? {} : { userId: req.user.id };

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: userSelect,
        },
      },
    });

    return res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error("Get all tasks error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id: Number(id) },
      include: {
        user: {
          select: userSelect,
        },
      },
    });

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // RBAC check: Only admin or the task's creator can view the task
    if (req.user.role !== Role.admin && task.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to view another user's task",
      });
    }

    return res.status(200).json({ success: true, task });
  } catch (error) {
    console.error("Get task by ID error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        ...(status && { status }),
        userId: req.user.id,
      },
      include: {
        user: {
          select: userSelect,
        },
      },
    });

    return res.status(201).json({ success: true, task });
  } catch (error) {
    console.error("Create task error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const existingTask = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!existingTask) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }


    if (req.user.role !== Role.admin && existingTask.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to modify another user's task",
      });
    }

    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
      },
      include: {
        user: {
          select: userSelect,
        },
      },
    });

    return res.status(200).json({ success: true, task });
  } catch (error) {
    console.error("Update task error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const existingTask = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!existingTask) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

   
    if (req.user.role !== Role.admin && existingTask.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to delete another user's task",
      });
    }

    const task = await prisma.task.delete({
      where: { id: Number(id) },
    });
    return res.status(200).json({ success: true, task });
  } catch (error) {
    console.error("Delete task error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

