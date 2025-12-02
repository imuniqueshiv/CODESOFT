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

// Essential for Render Production
app.set('trust proxy', 1);

app.use(express.json());
app.use(cookieParser());

// --- CORS CONFIGURATION ---
const allowedOrigins = [
  'http://localhost:5173', // Localhost Frontend
  'https://codesoft-blond.vercel.app', 
  'https://codesoft-7ymdfyrh0-shiv-raj-singhs-projects.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }

        // Regex for Vercel Preview Deployments
        const vercelPreviewPattern = /^https:\/\/.*-shiv-raj-singhs-projects\.vercel\.app$/;
        if (vercelPreviewPattern.test(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // UPDATED: Added 'token' to this list so the browser allows it
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with', 'token'],
  })
);

app.get('/', (req, res) => res.send('API is Working'));

// --- ROUTES ---
if (authRouter) app.use('/api/auth', authRouter);
if (userRouter) app.use('/api/user', userRouter);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(port, () => console.log(`Server is running on ${port}.`));