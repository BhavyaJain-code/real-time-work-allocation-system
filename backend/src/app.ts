import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { openApiSpec } from "./config/swagger";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { authRouter } from "./modules/auth/auth.routes";
import { usersRouter } from "./modules/users/users.routes";
import { teamsRouter } from "./modules/teams/teams.routes";
import { projectsRouter } from "./modules/projects/projects.routes";
import { tasksRouter } from "./modules/tasks/tasks.routes";
import { commentsRouter } from "./modules/comments/comments.routes";
import { notificationsRouter } from "./modules/notifications/notifications.routes";
import { activityRouter } from "./modules/activity/activity.routes";
import { analyticsRouter } from "./modules/analytics/analytics.routes";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: env.NODE_ENV === "test" ? 10000 : 300 }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());
app.use(pinoHttp({ logger }));

app.get("/health", (_req, res) => res.json({ success: true, data: { status: "ok" } }));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/teams", teamsRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api", commentsRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api", activityRouter);
app.use("/api", analyticsRouter);

app.use(notFoundHandler);
app.use(errorHandler);
