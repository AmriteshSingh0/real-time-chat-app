import express from "express";
import {protectRoute} from "../middleware/auth.middleware.js";
import { getMessages, getUserForSiderbar, sendMessages } from "../controllers/message.controllers.js";

const router = express.Router();

router.get("/user", protectRoute,getUserForSiderbar)
router.get("/send/:id", protectRoute,getMessages);
router.post("/send/:id", protectRoute,sendMessages);

export default router;


