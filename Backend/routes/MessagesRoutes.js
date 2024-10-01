import { getMessages } from "../controllers/MessagesController.js";
import { verifyToken } from '../middlewares/AuthMiddleware.js'
import express from 'express';
const messagesRoutes = express.Router();

messagesRoutes.post('/get-messages',verifyToken, getMessages);


export default messagesRoutes;