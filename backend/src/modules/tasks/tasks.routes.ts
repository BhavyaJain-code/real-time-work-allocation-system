import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, noContent } from "../../utils/responses";
import { idParam } from "../../utils/validation";
import { requireAuthenticated } from "../../middleware/authorization";
import { createTaskSchema, reorderTaskSchema, taskQuerySchema, updateTaskSchema } from "./tasks.schemas";
import * as service from "./tasks.service";

export const tasksRouter = Router();
tasksRouter.use(authenticate);

tasksRouter.post("/", validate({ body: createTaskSchema }), asyncHandler(async (req, res) => ok(res, await service.createTask(requireAuthenticated(req), req.body), 201)));
tasksRouter.get("/", validate({ query: taskQuerySchema }), asyncHandler(async (req, res) => ok(res, await service.listTasks(requireAuthenticated(req), req.query as never))));
tasksRouter.get("/:id", validate({ params: idParam }), asyncHandler(async (req, res) => ok(res, await service.getTask(requireAuthenticated(req), req.params.id))));
tasksRouter.patch("/:id", validate({ params: idParam, body: updateTaskSchema }), asyncHandler(async (req, res) => ok(res, await service.updateTask(requireAuthenticated(req), req.params.id, req.body))));
tasksRouter.delete("/:id", validate({ params: idParam }), asyncHandler(async (req, res) => { await service.deleteTask(requireAuthenticated(req), req.params.id); return noContent(res); }));
tasksRouter.post("/:id/subtasks", validate({ params: idParam, body: createTaskSchema.omit({ projectId: true, parentTaskId: true }) }), asyncHandler(async (req, res) => ok(res, await service.createSubtask(requireAuthenticated(req), req.params.id, req.body), 201)));
tasksRouter.get("/:id/subtasks", validate({ params: idParam }), asyncHandler(async (req, res) => ok(res, await service.listSubtasks(requireAuthenticated(req), req.params.id))));
tasksRouter.patch("/:id/position", validate({ params: idParam, body: reorderTaskSchema }), asyncHandler(async (req, res) => ok(res, await service.reorderTask(requireAuthenticated(req), req.params.id, req.body))));
