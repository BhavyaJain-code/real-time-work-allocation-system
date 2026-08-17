import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok } from "../../utils/responses";
import { projectIdParam, teamIdParam } from "../../utils/validation";
import { requireAuthenticated } from "../../middleware/authorization";
import * as service from "./analytics.service";

export const analyticsRouter = Router();
analyticsRouter.use(authenticate);
analyticsRouter.get("/projects/:projectId/analytics", validate({ params: projectIdParam }), asyncHandler(async (req, res) => ok(res, await service.projectAnalytics(requireAuthenticated(req), req.params.projectId))));
analyticsRouter.get("/teams/:teamId/analytics", validate({ params: teamIdParam }), asyncHandler(async (req, res) => ok(res, await service.teamAnalytics(requireAuthenticated(req), req.params.teamId))));
