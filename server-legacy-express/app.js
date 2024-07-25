import express from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import morganMiddleware from "./middlewares/logger.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/tasks.routes.js";
import usersRoutes from "./routes/users.routes.js";
import errorHandler from "./middlewares/errorhandler.middleware.js";

dotenv.config();

const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
};

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morganMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", usersRoutes);

app.use(errorHandler);

export default app;
