import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok } from "../../utils/responses";
import { idParam } from "../../utils/validation";
import { requireAuthenticated } from "../../middleware/authorization";
import { updateProfileSchema } from "./users.schemas";
import * as service from "./users.service";

export const usersRouter = Router();
usersRouter.use(authenticate);

usersRouter.get("/me", asyncHandler(async (req, res) => ok(res, await service.getUser(requireAuthenticated(req)))));
usersRouter.patch(
  "/me",
  validate({ body: updateProfileSchema }),
  asyncHandler(async (req, res) => ok(res, await service.updateProfile(requireAuthenticated(req), req.body)))
);
usersRouter.get("/:id", validate({ params: idParam }), asyncHandler(async (req, res) => ok(res, await service.getUser(req.params.id))));
