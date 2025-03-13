import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

const v = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.body) {
      res.status(400).json({ msg: "Request Body is required" });
      return;
    }

    try {
      schema.parse(req.body);
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        res.status(400).json({
          message: "Invalid request body",
          errors: e.errors,
        });
        return;
      }
      res.status(500).json({
        message: "Server error in validation.js",
        error: (e as Error).message,
      });
      return;
    }
  };
};

export default v;
