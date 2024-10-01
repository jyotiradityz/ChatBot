import { Server as SokcetIOServer } from "socket.io";
import Message from "./models/MessegeModel.js";
import User from './models/UserModel.js';
const setupSocket = (server) => {

    const io = new SokcetIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: [
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE"
            ],
            credentials: true

        }
    });

    const userSocketMap = new Map();

    const disconnect = (socket) => {
        console.log(`Client Disconnected: ${socket.id} `);
        for (const [userId, sockerId] of userSocketMap.entries()) {
            if (sockerId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    };

    const sendMessage = async (message) => {

        console.log(message);


        const sendSocketId = userSocketMap.get(message.sender);
        const recipentSockerId = userSocketMap.get(message.recipient);

        const createMessage = await Message.create(message);
        console.log(createMessage); 
        

        const messageData = await Message.findById(createMessage._id)
            .populate("sender", "id email firstName lastName image color")
            .populate("recipient", "id email firstName lastName image color");
        
        console.log(messageData);
        

        if (recipentSockerId) {
            io.to(recipentSockerId).emit("receiveMessage", messageData);
        }

        if (sendSocketId) {
            io.to(sendSocketId).emit("receiveMessage", messageData);
        }


    }

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User Connected: ${userId} with socket ID: ${socket.id}`);
        }
        else {
            console.log("UseriD not provided");
        }

        socket.on("sendMessage", sendMessage)
        socket.on("disconnect", () => disconnect(socket))

    })

};



export default setupSocket;  