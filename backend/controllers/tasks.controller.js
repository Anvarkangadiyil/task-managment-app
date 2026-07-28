import { Role, TaskStatus } from "@prisma/client";
import prisma from "../config/prisma.js";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
};

export const getAllTask = async (req, res) => {
  try {
    const { page, limit, search, status, userId } = req.query;

    // Parse pagination query parameters
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

   
    const where = {};

    // RBAC: Standard users can ONLY view their own tasks
    if (req.user.role !== Role.admin) {
      where.userId = req.user.id;
    } else if (userId && !isNaN(Number(userId))) {
      // Admins can optionally filter by a specific user ID
      where.userId = Number(userId);
    }

    // Search filter: Case-insensitive search on task title
    if (search && typeof search === "string" && search.trim() !== "") {
      where.title = {
        contains: search.trim(),
        mode: "insensitive",
      };
    }

   
    if (status && typeof status === "string" && status.trim() !== "" && status.trim() !== "ALL") {
      const normalizedStatus = status.trim().replace(/\s+/g, "_");
      if (Object.values(TaskStatus).includes(normalizedStatus)) {
        where.status = normalizedStatus;
      }
    }

    const [totalTasks, tasks] = await prisma.$transaction([
      prisma.task.count({ where }),
      prisma.task.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: userSelect,
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalTasks / limitNum) || 1;

    return res.status(200).json({
      success: true,
      tasks,
      pagination: {
        totalTasks,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
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

