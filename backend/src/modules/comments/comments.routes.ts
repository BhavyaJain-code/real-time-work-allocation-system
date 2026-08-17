import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, noContent } from "../../utils/responses";
import { commentIdParam, taskIdParam } from "../../utils/validation";
import { requireAuthenticated } from "../../middleware/authorization";
import { createCommentSchema, updateCommentSchema } from "./comments.schemas";
import * as service from "./comments.service";

export const commentsRouter = Router();
commentsRouter.use(authenticate);
commentsRouter.post("/tasks/:taskId/comments", validate({ params: taskIdParam, body: createCommentSchema }), asyncHandler(async (req, res) => ok(res, await service.createComment(requireAuthenticated(req), req.params.taskId, req.body.content), 201)));
commentsRouter.get("/tasks/:taskId/comments", validate({ params: taskIdParam }), asyncHandler(async (req, res) => ok(res, await service.listComments(requireAuthenticated(req), req.params.taskId))));
commentsRouter.patch("/comments/:id", validate({ params: commentIdParam, body: updateCommentSchema }), asyncHandler(async (req, res) => ok(res, await service.updateComment(requireAuthenticated(req), req.params.id, req.body.content))));
commentsRouter.delete("/comments/:id", validate({ params: commentIdParam }), asyncHandler(async (req, res) => { await service.deleteComment(requireAuthenticated(req), req.params.id); return noContent(res); }));
