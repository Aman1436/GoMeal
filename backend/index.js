import dotenv from 'dotenv';
import express from 'express';
dotenv.config();
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import cors from 'cors';
import passport from 'passport';
import './config/passport.js';
import userRouter from './routes/user.routes.js';
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true,
    }
));
app.use(passport.initialize());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});