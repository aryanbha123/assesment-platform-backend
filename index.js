// =================================================================
//                      IMPORTS
// =================================================================
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// Local imports
import { corsConfig, db } from "./config/config.js";
import "./config/redisconn.js"; // This initializes the Redis connection
import { generalRateLimiter } from "./config/rateLimiter.js";
import { setupMorgan } from "./config/morgan.js";
import assesmentRouter from "./routes/assesmentRouter.js";

// Load environment variables from .env file
dotenv.config();

// =================================================================
//                  EXPRESS APP INITIALIZATION
// =================================================================
const app = express();

// Trust proxy to allow Express to correctly handle proxy headers (e.g., X-Forwarded-For)
// This is important when the application is behind a reverse proxy (like Nginx or a load balancer).
app.set("trust proxy", true);

// =================================================================
//                      INITIALIZATION
// =================================================================

// Setup Morgan for logging. This needs to be done before other middleware.
setupMorgan(app);

// Establish database connection on startup
await db();


// =================================================================
//                      SECURITY MIDDLEWARE
// =================================================================

// Apply Helmet to set various HTTP headers for security.
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    // Disable Content Security Policy in development to avoid issues with tools like hot-reloading.
    contentSecurityPolicy: process.env.NODE_ENV === "PROD" ? undefined : false,
  }),
);

// =================================================================
//                        LOGGING MIDDLEWARE
// =================================================================

// Define a custom Morgan token to get the real IP address from behind a proxy.
morgan.token(
  "remote-ip",
  (req) => req.headers["x-forwarded-for"] || req.socket.remoteAddress,
);

// Define the log format for Morgan.
const logFormat =
  ':date[iso] | :remote-ip | :method :url | :status | :res[content-length] bytes | :response-time ms | ":referrer" | ":user-agent"';

// Apply different logging strategies based on the environment.
if (process.env.NODE_ENV === "PROD") {
  // In production, log only error responses (status code 400 and above).
  app.use(
    morgan(logFormat, {
      skip: (req, res) => res.statusCode < 400,
    }),
  );
} else {
  // In development, log all requests.
  app.use(morgan(logFormat));
}

// =================================================================
//                      CORE MIDDLEWARE
// =================================================================

// Enable Cross-Origin Resource Sharing (CORS) with the specified configuration.
app.use(cors(corsConfig));

// Parse incoming JSON payloads.
app.use(express.json());


// =================================================================
//                            ROUTES
// =================================================================

// Mount the assessment router for all routes starting with /api/v1/assesments.
app.use('/api/v1/assesments', assesmentRouter);
// Example of another router that could be added:
// app.use('/api/v1/auth', authRouter);

// Mount the test router for testing purposes.
import testRouter from './routes/testRouter.js';
app.use('/api/v1/test', testRouter);



// =================================================================
//                      RATE LIMITER
// =================================================================

// Apply a general rate limiter to all requests to prevent abuse.
app.use(generalRateLimiter);


// =================================================================
//                      HEALTH CHECK
// =================================================================

// A simple endpoint to check if the service is running.
app.get('/api/v1/health', (req, res) => {
  res.json({ message: "OK" });
});

// =================================================================
//                      GLOBAL ERROR HANDLER
// =================================================================

// This middleware catches any errors that occur in the route handlers.
app.use((err, req, res, next) => {
  // Log the error for debugging purposes.
  console.error({
    message: err.message,
    stack: err.stack,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    url: req.originalUrl,
    method: req.method,
  });

  // Send a generic error response to the client.
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});


// =================================================================
//                      SERVER STARTUP
// =================================================================

// Start the Express server and listen for incoming connections.
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});



