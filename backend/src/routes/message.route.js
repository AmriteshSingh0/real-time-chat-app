import express from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { getMessages, getuserForSidebar } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/user", protectRoute,getuserForSidebar)
router.get("/send/:id", pretectionRoute,getMessages);
router.post("/send/:id", protectRoute,sendMessages);

export default router;


