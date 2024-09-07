import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/AuthRoutes.js';  

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5174;

const url = process.env.MONGO_URI;

app.use(
    cors({
        origin: [process.env.ORIGIN],
        method: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,

    })
)

app.use("/uploads/profiles", express.static("uploads/profiles"));

app.use(cookieParser())
app.use(express.json())


app.use("/api/auth",authRoutes)


const start = () =>
    mongoose
        .connect(url)
        .then(() => {
            console.log('');
            console.log('Database Connected✅');
            app.listen(PORT, () => {
                console.log(`🥰Server is running on port ${PORT}🥰`);
            }); 
        })
        .catch((err) => {
            console.log('Database connection error:', err);
        });

start() 