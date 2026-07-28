export const validate = (schema, source = "body") => (req, res, next) => {
  if (!schema) return next();
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    const formattedErrors = result.error.flatten();
    return res.status(400).json({
      message: "Validation failed",
      errors: formattedErrors.fieldErrors,
      ...(formattedErrors.formErrors.length > 0 && { formErrors: formattedErrors.formErrors }),
    });
  }
  req[source] = result.data;
  next();
};
