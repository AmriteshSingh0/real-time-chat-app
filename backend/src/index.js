import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import authcontroller from "./controllers/auth.controller.js";
import { connectDB } from "./lib/db.js";


const app = express();

dotenv.config();

app.use(express.json());

const PORT = process.env.PORT;

app.use("/api/auth",authRoutes)

app.get("/", (req, res) => {
  res.send("Hello world from backend 🚀");
});


//const PORT = 5002;
app.listen(PORT, () => {
  console.log("server is running on port: " + PORT);
  connectDB()
});
