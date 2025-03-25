import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

const v = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Try to validate params first, if that fails, validate body
      try {
        schema.parse(req.params);
      } catch {
        if (!req.body) {
          res.status(400).json({ msg: "Request Body is required" });
          return;
        }
        schema.parse(req.body);
      }
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        res.status(400).json({
          message: "Invalid request body",
          errors: e.errors,
        });
        return;
      }
      next(e);
    }
  };
};

export default v;
