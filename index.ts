import express, { Application } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import bodyParser from "body-parser";
import authRouter from "./routes/Auth.route";
import contactRouter from "./routes/Contact.route";
import userRouter from "./routes/User.route";
import AppError from "./utils/AppError";
import globalErrorHandler from "./utils/GlobalErrorHandler";

let app = express();
app.use(cors({ credentials: true, origin: true }));
app.use(helmet());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// const limit = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: "Too many requests from this IP, please try again in an hour",
// });

// app.use("/api", limit);
app.use(express.json({ limit: "10kb" }));
app.use(mongoSanitize());

// Serving static files
app.use(express.static(`${__dirname}/public`));

if (process.env.NODE_ENV === "development") {
  console.log("Development Mode 💥");
}

// Routers should be here
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/contacts", contactRouter);
app.use("/api/v1/users", userRouter);

app.use("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// Global error handler for every request
app.use(globalErrorHandler);

export default app;
