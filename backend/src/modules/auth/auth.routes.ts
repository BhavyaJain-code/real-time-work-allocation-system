import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { env, isProduction } from "../../config/env";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok } from "../../utils/responses";
import { requireAuthenticated } from "../../middleware/authorization";
import { loginSchema, registerSchema } from "./auth.schemas";
import * as service from "./auth.service";

export const authRouter = Router();

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "strict" as const,
  path: "/api/auth"
};

authRouter.post(
  "/register",
  validate({ body: registerSchema }),
  asyncHandler(async (req, res) => {
    const result = await service.register(req.body);
    res.cookie("refreshToken", result.refreshToken, cookieOptions);
    return ok(res, result, StatusCodes.CREATED);
  })
);

authRouter.post(
  "/login",
  validate({ body: loginSchema }),
  asyncHandler(async (req, res) => {
    const result = await service.login(req.body);
    res.cookie("refreshToken", result.refreshToken, cookieOptions);
    return ok(res, result);
  })
);

authRouter.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const result = await service.refresh(req.cookies.refreshToken as string | undefined);
    res.cookie("refreshToken", result.refreshToken, cookieOptions);
    return ok(res, result);
  })
);

authRouter.post(
  "/logout",
  asyncHandler(async (req, res) => {
    await service.logout(req.cookies.refreshToken as string | undefined);
    res.clearCookie("refreshToken", { path: "/api/auth" });
    return ok(res, { loggedOut: true });
  })
);

authRouter.get(
  "/me",
  authenticate,
  asyncHandler(async (req, res) => ok(res, await service.getMe(requireAuthenticated(req))))
);
