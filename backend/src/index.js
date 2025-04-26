import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import authcontroller from "./controllers/auth.controller.js";
import { connectDB } from "./lib/db.js";
import messageRoutes from "./routes/message.route.js";
import cookieParser from "cookie-parser";
dotenv.config();
import cors from "cors";
const app = express();



app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}))

const PORT = process.env.PORT ;

app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)

app.get("/", (req, res) => {
  res.send("Hello world from backend 🚀");
});


//const PORT = 5002;
app.listen(PORT, () => {
  console.log("server is running on port: " + PORT);
  connectDB()
});
