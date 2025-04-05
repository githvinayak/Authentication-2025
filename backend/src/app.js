import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit"
import { errorMiddleware } from "./middlewares/error.js";
import { config } from "dotenv";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";
import session from "express-session"
import cookieParser from "cookie-parser";
import { dbConnection } from "./db/connect.js";
import authRoute from "./routes/auth.js"
import userRoute from "./routes/user.js"
import { redisClient } from "./config/redis.js";


config({
  path: "./.env",
});

const Limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 20, // Max 5 requests per 10 minutes for authentication routes
    message: "Too many attempts, please try again later.",
  });
  
//db connect
const port = process.env.PORT || 5000;
const mongoURI = process.env.DATABASE_URL || "";
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);
console.log("github_CLIENT_ID:", process.env.GITHUB_CLIENT_ID);
console.log("github_CLIENT_SECRET:", process.env.GITHUB_CLIENT_SECRET);

dbConnection(mongoURI);
//creating instance of cache
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(helmet());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    exposedHeaders: ["Set-Cookie"],
  })
);
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/v1/auth", Limiter);
app.use("/api/v1/user", Limiter);


app.get("/", (req, res) => {
  res.send("Api is working with /api/v1");
});

//using routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);

app.use(errorMiddleware);6
app.listen(port, () => {
  console.log("server is literning on http://localhost:" + port);
});