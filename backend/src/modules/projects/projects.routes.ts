import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, noContent } from "../../utils/responses";
import { idParam, userIdParam } from "../../utils/validation";
import { requireAuthenticated } from "../../middleware/authorization";
import { addProjectMemberSchema, createProjectSchema, updateProjectSchema } from "./projects.schemas";
import * as service from "./projects.service";

export const projectsRouter = Router();
projectsRouter.use(authenticate);

projectsRouter.post("/", validate({ body: createProjectSchema }), asyncHandler(async (req, res) => ok(res, await service.createProject(requireAuthenticated(req), req.body), 201)));
projectsRouter.get("/", asyncHandler(async (req, res) => ok(res, await service.listProjects(requireAuthenticated(req)))));
projectsRouter.get("/:id", validate({ params: idParam }), asyncHandler(async (req, res) => ok(res, await service.getProject(requireAuthenticated(req), req.params.id))));
projectsRouter.patch("/:id", validate({ params: idParam, body: updateProjectSchema }), asyncHandler(async (req, res) => ok(res, await service.updateProject(requireAuthenticated(req), req.params.id, req.body))));
projectsRouter.delete("/:id", validate({ params: idParam }), asyncHandler(async (req, res) => { await service.deleteProject(requireAuthenticated(req), req.params.id); return noContent(res); }));
projectsRouter.post("/:id/members", validate({ params: idParam, body: addProjectMemberSchema }), asyncHandler(async (req, res) => ok(res, await service.addMember(requireAuthenticated(req), req.params.id, req.body), 201)));
projectsRouter.delete("/:id/members/:userId", validate({ params: userIdParam }), asyncHandler(async (req, res) => { await service.removeMember(requireAuthenticated(req), req.params.id, req.params.userId); return noContent(res); }));
