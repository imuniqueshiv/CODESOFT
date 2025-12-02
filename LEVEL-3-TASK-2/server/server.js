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

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
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