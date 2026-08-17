import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, noContent } from "../../utils/responses";
import { idParam, userIdParam } from "../../utils/validation";
import { requireAuthenticated } from "../../middleware/authorization";
import { addTeamMemberSchema, createTeamSchema, updateTeamMemberSchema, updateTeamSchema } from "./teams.schemas";
import * as service from "./teams.service";

export const teamsRouter = Router();
teamsRouter.use(authenticate);

teamsRouter.post("/", validate({ body: createTeamSchema }), asyncHandler(async (req, res) => ok(res, await service.createTeam(requireAuthenticated(req), req.body), 201)));
teamsRouter.get("/", asyncHandler(async (req, res) => ok(res, await service.listTeams(requireAuthenticated(req)))));
teamsRouter.get("/:id", validate({ params: idParam }), asyncHandler(async (req, res) => ok(res, await service.getTeam(requireAuthenticated(req), req.params.id))));
teamsRouter.patch("/:id", validate({ params: idParam, body: updateTeamSchema }), asyncHandler(async (req, res) => ok(res, await service.updateTeam(requireAuthenticated(req), req.params.id, req.body))));
teamsRouter.delete("/:id", validate({ params: idParam }), asyncHandler(async (req, res) => { await service.deleteTeam(requireAuthenticated(req), req.params.id); return noContent(res); }));
teamsRouter.post("/:id/members", validate({ params: idParam, body: addTeamMemberSchema }), asyncHandler(async (req, res) => ok(res, await service.addMember(requireAuthenticated(req), req.params.id, req.body), 201)));
teamsRouter.patch("/:id/members/:userId", validate({ params: userIdParam, body: updateTeamMemberSchema }), asyncHandler(async (req, res) => ok(res, await service.updateMember(requireAuthenticated(req), req.params.id, req.params.userId, req.body.role))));
teamsRouter.delete("/:id/members/:userId", validate({ params: userIdParam }), asyncHandler(async (req, res) => { await service.removeMember(requireAuthenticated(req), req.params.id, req.params.userId); return noContent(res); }));
