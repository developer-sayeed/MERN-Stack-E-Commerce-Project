const express = require("express");
const morgan = require("morgan");
const colors = require("colors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const { userRouter } = require("./routes/userRoutes");
const { seedRouter } = require("./routes/seedRouter");
const { errorResponse } = require("./Helper/responseHandller");
const { authRouter } = require("./routes/authRouter");
const app = express();

// Confing limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 10, // Limit each IP to 5 requests per `window` (here, per minutes)
  message: "To many request from this IP address, please try again later",
});

// App Configration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(xssClean());
app.use(limiter);
app.use(morgan("dev"));
app.use(cookieParser());

// static folder
app.use(express.static("public"));
// Api Configuration
app.use("/api/v1/user", userRouter);
app.use("/api/v1/seed", seedRouter);
app.use("/api/v1/auth", authRouter);

// Client Error Handler  Middleware

app.use((req, res, next) => {
  next(createError(404, "Route not found"));
});

// Server  Error Handler Middleware
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message,
  });
});

module.exports = app;
