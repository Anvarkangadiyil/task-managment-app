import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import prisma from "../config/prisma.js";

export const authorize = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized, no token provided",
        success: false,
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized, no user found",
        success: false,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized or invalid token",
      error: error.message,
    });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to ${roles.join(", ")} role(s)`,
      });
    }
    next();
  };
};

