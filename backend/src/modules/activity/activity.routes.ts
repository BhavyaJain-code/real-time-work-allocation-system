import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok } from "../../utils/responses";
import { projectIdParam } from "../../utils/validation";
import { requireAuthenticated } from "../../middleware/authorization";
import * as service from "./activity.service";

export const activityRouter = Router();
activityRouter.use(authenticate);
activityRouter.get("/projects/:projectId/activity", validate({ params: projectIdParam }), asyncHandler(async (req, res) => ok(res, await service.listProjectActivity(requireAuthenticated(req), req.params.projectId))));
