/**
 * Contextual Error Middleware for Express + Prisma + Zod + JWT Application.
 */
const errorMiddleware = (err, req, res, next) => {
  try {
    let statusCode = err.status || err.statusCode || 500;
    let message = err.message || "Internal server error";

    console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err);

    // 1. Prisma Unique Constraint Violation (e.g. duplicate email)
    if (err.code === "P2002") {
      const targets = err.meta?.target ? Array.isArray(err.meta.target) ? err.meta.target.join(", ") : err.meta.target : "field";
      message = `Duplicate ${targets} entered`;
      statusCode = 400;
    }

    // 2. Prisma Record Not Found
    if (err.code === "P2025") {
      message = "Requested resource not found";
      statusCode = 404;
    }

    // 3. Zod / Schema Validation Error
    if (err.name === "ZodError" || err.name === "ValidationError") {
      if (err.issues && Array.isArray(err.issues)) {
        message = err.issues.map((issue) => issue.message).join(", ");
      } else if (err.errors) {
        message = Object.values(err.errors).map((val) => val.message || val).join(", ");
      }
      statusCode = 400;
    }

    // 4. JWT Authentication Errors
    if (err.name === "JsonWebTokenError") {
      message = "Unauthorized: Invalid authentication token";
      statusCode = 401;
    }

    if (err.name === "TokenExpiredError") {
      message = "Unauthorized: Token expired, please log in again";
      statusCode = 401;
    }

    // 5. Invalid Object / Resource ID Error
    if (err.name === "CastError") {
      message = `Resource not found. Invalid: ${err.path}`;
      statusCode = 404;
    }


    return res.status(statusCode).json({
      success: false,
      message,
      error: message,
    });
  } catch (error) {
    return next(error);
  }
};

export default errorMiddleware;
