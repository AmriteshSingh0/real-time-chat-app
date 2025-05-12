import {server} from '../server.js';    
import http from 'http';
import express from "express";


const app= express();
const server = http.createServer(app);

const io= new Server(server, {
    corse:{
        origin:["http://localhost:5173"],

    },
});

io.on("connection", (socket) => {
    console.log("New user connected", socket.id);

    socket.on("disconnected",()=>{
        console.log("User disconnected", socket.id);
   });
});

export {io, app,server}