import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {generateToken} from "../lib/utils.js";

const authcontroller = {
  signup: async (req, res) => {
    const { fullname, email, password } = req.body;

    try {
        console.log("🟢 Signup request received:", req.body);



      if (!fullname || !email || !password) {
        console.log("❌ Missing required fields");
        return res.status(400).json({ message: "All fields are required" });
      }

      if (password.length < 6) {
        console.log("❌ Password too short");
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        console.log("❌ Email already exists");
        return res.status(400).json({ message: "Email already exists" });
      }
      console.log("🔐 Hashing password...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      console.log("📦 Creating new user...");
      const newUser = new User({
        fullname,
        email,
        password: hashedPassword,
      });

      if (newUser){

        await newUser.save();
        console.log("🎫 Generating token...");
        generateToken(newUser._id, res)
     
        console.log("✅ User created successfully");
        res.status(201).json({ message: "User created successfully", user: newUser });
      }}
      catch (error) {
        console.error("❌ Error in signup controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
      
  },

  login: async(req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      generateToken(user._id, res);
  
      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      });
    } catch (error) {
      console.log("Error in login controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  logout: async(req, res) => {
    try {
      res.cookie("jwt", "", { maxAge: 0 });
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.log("Error in logout controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

export const { signup, login, logout } = authcontroller;
export default authcontroller;
