import express, { Request, Response, NextFunction } from "express";
import Auth from "../Routes/AuthRoutes";

const app = express();

app.use(express.json());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.use("/Auth", Auth);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
