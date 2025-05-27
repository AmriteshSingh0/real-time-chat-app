import {server} from '../server.js';    
import http from 'http';
import express from "express";


const app= express();
const server = http.createServer(app);

const io= new Server(server, {
    cors:{
        origin:["http://localhost:5173"],

    },
});

export function getReceiverSocketId(userId){
 return userSocketMap[userId];
}

const userSocketMap={};

io.on("connection", (socket) => {
    console.log("New user connected", socket.id);

    const useId=socket.handshake.query.userId;
    if(useId) userSocketMap[useId]=socket.id;

    io.emit("getOnilneUsers",Object.keys(userSoketMap))

    socket.on("disconnected",()=>{
        console.log("User disconnected", socket.id);
        delete userSocketMap[useId];
        io.emit("getOnilneUsers",Object.keys(userSoketMap))
   });
});

export {io, app,server}