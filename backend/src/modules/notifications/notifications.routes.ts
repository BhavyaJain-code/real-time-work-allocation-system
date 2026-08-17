import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok } from "../../utils/responses";
import { idParam } from "../../utils/validation";
import { requireAuthenticated } from "../../middleware/authorization";
import * as service from "./notifications.service";

export const notificationsRouter = Router();
notificationsRouter.use(authenticate);
notificationsRouter.get("/", asyncHandler(async (req, res) => ok(res, await service.listNotifications(requireAuthenticated(req)))));
notificationsRouter.patch("/read-all", asyncHandler(async (req, res) => ok(res, await service.markAllRead(requireAuthenticated(req)))));
notificationsRouter.patch("/:id/read", validate({ params: idParam }), asyncHandler(async (req, res) => ok(res, await service.markRead(requireAuthenticated(req), req.params.id))));
