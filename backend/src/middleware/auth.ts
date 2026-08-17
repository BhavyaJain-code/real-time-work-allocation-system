import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { prisma } from "../prisma/client";
import { errors } from "../utils/appError";
import { sanitizeUser } from "../utils/sanitize";

type AccessPayload = { sub: string; type: "access" };

export const authenticate: RequestHandler = async (req, _res, next) => {
  const authHeader = req.header("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  if (!token) return next(errors.unauthorized());

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessPayload;
    if (payload.type !== "access") return next(errors.unauthorized("Invalid token"));
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return next(errors.unauthorized("User no longer exists"));
    req.user = sanitizeUser(user);
    req.accessToken = token;
    return next();
  } catch {
    return next(errors.unauthorized("Invalid or expired token"));
  }
};
