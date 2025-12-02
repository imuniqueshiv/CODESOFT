import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import projectRoutes from "./routes/projects.js";
import taskRoutes from "./routes/tasks.js";

const app = express();
const port = process.env.PORT || 4000;

await connectDB();

app.use(express.json());
app.use(cookieParser());

// --- UPDATED CORS CONFIGURATION ---
const allowedOrigins = [
  "http://localhost:5173", // For Local Development
  "https://codesoft-blond.vercel.app", // Production Alias 1 (Main Vercel Domain)
  "https://codesoft-7ymdfyrh0-shiv-raj-singhs-projects.vercel.app", // NEWEST Temporary Deployment URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // Log the blocked origin for debugging
        console.error(`CORS Blocked: ${origin}`);
        var msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.get("/", (req, res) => res.send("API is Working"));

// --- ROUTES CONFIGURATION ---
// 1. Auth & User
if (authRouter) app.use("/api/auth", authRouter);
if (userRouter) app.use("/api/user", userRouter);

// 2. Projects (MUST be /api/projects)
app.use("/api/projects", projectRoutes);

// 3. Tasks (MUST be /api/tasks)
app.use("/api/tasks", taskRoutes);

app.listen(port, () => console.log(`Server is running on ${port}.`));
