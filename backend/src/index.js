import express from "express";
import http from "http"; 
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { initSocket } from "./lib/socket.js";
dotenv.config();
import path from "path";

const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });

}

app.get("/", (req, res) => {
  res.send("Hello world from backend 🚀");
});


const server = http.createServer(app);
initSocket(server); 


const PORT = process.env.PORT || 5002;
const __dirname = path.resolve();


server.listen(PORT, () => {
  console.log("🚀 Server is running on port: " + PORT);
  connectDB();
});
