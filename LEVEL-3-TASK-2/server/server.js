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

// --- CRITICAL FIX FOR RENDER DEPLOYMENT ---
// This allows the app to trust that it's running on HTTPS behind Render's load balancer.
// Without this, 'secure: true' cookies will NOT be sent.
app.enable('trust proxy'); 

app.use(express.json());
app.use(cookieParser());

// --- UPDATED CORS CONFIGURATION ---
const allowedOrigins = [
  'http://localhost:5173',
  'https://codesoft-blond.vercel.app',
  'https://codesoft-7ymdfyrh0-shiv-raj-singhs-projects.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Check if origin matches specific list
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }

        // Check for Vercel preview deployments using Regex (The wildcard string approach fails)
        // This matches any subdomain ending in -shiv-raj-singhs-projects.vercel.app
        const vercelPreviewPattern = /^https:\/\/.*-shiv-raj-singhs-projects\.vercel\.app$/;
        if (vercelPreviewPattern.test(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
  })
);

app.get('/', (req, res) => res.send('API is Working'));

// --- ROUTES CONFIGURATION ---
if (authRouter) app.use('/api/auth', authRouter);
if (userRouter) app.use('/api/user', userRouter);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(port, () => console.log(`Server is running on ${port}.`));