import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/AuthRoutes.js';  
import contactRoutes from './routes/ContactsRoutes.js';
import setupSocket from './socket.js';
import messagesRoutes from './routes/MessagesRoutes.js';

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
app.use("/api/contacts",contactRoutes)
app.use('/api/messages',messagesRoutes );

 
const server = app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}🥰`);  
})

setupSocket(server) 

mongoose.connect(url)
.then(()=> console.log("Database connected ✅"))
.catch((err)=>console.log(err));