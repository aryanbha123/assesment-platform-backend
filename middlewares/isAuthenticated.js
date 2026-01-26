import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { USER_JWT_SECRET } from '../config/config.js';

/**
 * Middleware to check if the user is authenticated.
 * It verifies the JWT token from the request headers.
 * If the token is valid, it attaches the user to the request object.
 * 
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const isAuthenticated = async (req, res, next) => {
    // TODO: Implement actual authentication logic
    // 1. Get the token from the request header (e.g., 'Authorization: Bearer <token>').
    // 2. Verify the token using jwt.verify and the USER_JWT_SECRET.
    // 3. If verification is successful, find the user in the database by the id from the token payload.
    // 4. If the user is found, attach the user object to the request (e.g., req.user = user).
    // 5. If the token is invalid or the user is not found, send an appropriate error response (e.g., 401 Unauthorized).
    next();
};
