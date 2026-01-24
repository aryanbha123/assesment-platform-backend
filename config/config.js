import { configDotenv } from "dotenv";
import mongoose from "mongoose";
configDotenv();

export const USER_JWT_SECRET = "FDSHHSDJDS";
export const ADMIN_JWT_SECRET = "shgdsjdsjds";
export const CALLBACK = ""
export const EXECUTION_API = process.env.EXECUTION_API
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || "http://localhost:3000";

export const corsConfig = {
    origin:ALLOWED_ORIGINS,
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

export const db = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.MONGODB_URI, {})
            .then(() => {
                console.log("Connected to MongoDB");
                resolve();
            })
            .catch((err) => {
                console.log("Error connecting to MongoDB");
                reject(err);
            });
    })
}

export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const redisConnection = {
    host: process.env.REDIS_HOST || 'localhost',//'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    // db: process.env.NODE_ENV == 'DEV' ? 0 : 1
};

export const ASSESSMENT_QUEUE = 'assessmentQueue';