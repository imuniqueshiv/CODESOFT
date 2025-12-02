import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js'; 
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import projectRoutes from './routes/projects.js';
import taskRoutes from './routes/tasks.js';

const app = express();
const port = process.env.PORT || 4000;

await connectDB(); 

app.use(express.json());
app.use(cookieParser());

// --- UPDATED CORS CONFIGURATION (MOST ROBUST METHOD) ---
const allowedOrigins = [
  'http://localhost:5173', 
  'https://codesoft-blond.vercel.app', 
  'https://codesoft-7ymdfyrh0-shiv-raj-singhs-projects.vercel.app', 
  // Add a wildcard for temporary Vercel domains for better long-term stability
  'https://*-shiv-raj-singhs-projects.vercel.app', 
];

app.use(
  cors({
    origin: allowedOrigins, // Use the array directly
    credentials: true,
    // Add explicit headers to help Chrome's preflight check
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
  })
);

app.get('/', (req, res) => res.send('API is Working'));

// --- ROUTES CONFIGURATION ---
// 1. Auth & User
if (authRouter) app.use('/api/auth', authRouter);
if (userRouter) app.use('/api/user', userRouter);

// 2. Projects (MUST be /api/projects)
app.use('/api/projects', projectRoutes);

// 3. Tasks (MUST be /api/tasks)
app.use('/api/tasks', taskRoutes);

app.listen(port, () => console.log(`Server is running on ${port}.`));