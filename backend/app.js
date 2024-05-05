import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './config/db.js';
import notesRouter from './routes/notes.js';
import authRouter from './routes/auth.js';
import { verifyToken } from './middleware/authMiddleware.js';

dotenv.config()

const app = express();

// Establish connection to the database
connectDB();

// Middleware's
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/notes', verifyToken, notesRouter);
app.use('/api/auth', authRouter);

// Response Handler middleware 
app.use((obj, req, res, next)=>{
    const statusCode = obj.status || 500;
    const message = obj.message || "Something Went Wrong!";

    return res.status(statusCode).json({
        success: [200, 201, 204].some(a=> a === obj.status) ? true: false,
        status: statusCode,
        message: message,
        data: obj.data
        // stack: obj.stack
    });
});

// Listen to the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port http://localhost:${PORT}`));