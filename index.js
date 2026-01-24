import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { corsConfig, db } from "./config/config.js";
import { isAuthenticated } from "./middlewares/isAuthenticated.js";
import helmet from "helmet";
import morgan from "morgan";
import "./config/redisconn.js";
import { generalRateLimiter } from "./config/rateLimiter.js";
import { setupMorgan } from "./config/morgan.js";
dotenv.config();

const app = express();

/* Trust proxy */
app.set("trust proxy", true);

/* Morgan */
setupMorgan(app);
/* Database */
await db();

/* ======================
   Security (Helmet)
====================== */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: process.env.NODE_ENV === "PROD" ? undefined : false, // disable CSP in dev (avoids headaches)
  }),
);

/* ======================
   Morgan: Proper logging
====================== */

// Custom tokens
morgan.token(
  "remote-ip",
  (req) => req.headers["x-forwarded-for"] || req.socket.remoteAddress,
);

const logFormat =
  ':date[iso] | :remote-ip | :method :url | :status | :res[content-length] bytes | :response-time ms | ":referrer" | ":user-agent"';

if (process.env.NODE_ENV === "PROD") {
  // Log only errors in production
  app.use(
    morgan(logFormat, {
      skip: (req, res) => res.statusCode < 400,
    }),
  );
} else {
  // Full logs in dev
  app.use(morgan(logFormat));
}

/* Middleware */
app.use(cors(corsConfig));
app.use(express.json());
app.use(isAuthenticated);

/* Routes */
// app.use('/api/v1/auth');
// app.use('/api/v1/assesments');

/*--------------------------------------
        Rate Limiter 
--------------------------------------*/
app.use(generalRateLimiter);
/*--------------------------------------
        Health Check 
--------------------------------------*/
app.get("/health", (req, res) => {
  res.json({ message: "OK" });
});

/* Global error handler */
app.use((err, req, res, next) => {
  console.error({
    message: err.message,
    stack: err.stack,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    url: req.originalUrl,
    method: req.method,
  });

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server started on port 3000");
});
