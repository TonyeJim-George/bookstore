import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import router from "./routes/bookRoutes";
import { apiLimiter } from "./middleware/rateLimiter";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/api/books", apiLimiter, router);


app.get("/", (req: Request, res: Response) => {
  res.send("Bookstore API is running!");
});

// Global Error Handler (optional)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Internal Server Error:", err.message);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
