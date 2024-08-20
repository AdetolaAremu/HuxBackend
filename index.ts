import express, { Application } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import bodyParser from "body-parser";
const authRouter = require("./routes/Auth.route");

const app: Application = express();

const AppError = require("./utils/AppError");
const globalErrorHandler = require("./utils/GlobalErrorHandler");

app.use(helmet());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const limit = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});

app.use("/api", limit);
app.use(express.json({ limit: "10kb" }));
app.use(mongoSanitize());

// serving static files
app.use(express.static(`${__dirname}/public`));

if (process.env.NODE_ENV === "development") {
  console.log("Development Mode 💥");
}

// routers should be here
app.use("/api/v1/auth", authRouter);

app.use("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// global error handler for every request
app.use(globalErrorHandler);

module.exports = app;
