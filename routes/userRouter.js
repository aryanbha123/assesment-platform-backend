import { Router } from "express";
import User from "../models/User.js";

const userRouter = Router();

userRouter.post("/register", async (req, res) => {
  try {
    const { name, email, skillLevel } = req.body;

    // Validate
    if (!name || !email || !skillLevel) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    // Check email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "User with this email already exists",
      });
    }

    // Generate userId
    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Map assessment by skill level
    const ASSESSMENT_IDS = {
      easy: "6984415ac5f11adf882af70c",
      medium: "69844287c5f11adf882afdb0",
      hard: "6984415ac5f11adf882af70c",
    };

    const assessmentId = ASSESSMENT_IDS[skillLevel];

    // Save user
    const newUser = new User({
      userId: userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      skillLevel,
      assessmentId,
      createdAt: new Date(),
    });

    await newUser.save();

    // Return response
    return res.status(200).json({
      success: true,
      userId: newUser._id,
      assessmentId,
      skillLevel,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});
export default userRouter;
