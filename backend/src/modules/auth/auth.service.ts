import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../prisma/client";
import { env } from "../../config/env";
import { AppError, errors } from "../../utils/appError";
import { sanitizeUser } from "../../utils/sanitize";
import type { LoginInput, RegisterInput } from "./auth.schemas";

type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function durationToMs(value: string): number {
  const match = /^(\d+)([smhd])$/.exec(value);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const amount = Number(match[1]);
  const units: Record<string, number> = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return amount * units[match[2]];
}

function signAccessToken(userId: string): string {
  return jwt.sign({ sub: userId, type: "access" }, env.JWT_ACCESS_SECRET, { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as StringValue });
}

function signRefreshToken(userId: string): string {
  return jwt.sign({ sub: userId, type: "refresh", nonce: crypto.randomUUID() }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as StringValue
  });
}

async function issueTokens(userId: string): Promise<TokenPair> {
  const accessToken = signAccessToken(userId);
  const refreshToken = signRefreshToken(userId);
  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + durationToMs(env.REFRESH_TOKEN_EXPIRES_IN))
    }
  });
  return { accessToken, refreshToken };
}

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw errors.conflict("EMAIL_ALREADY_REGISTERED", "Email is already registered");
  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({
    data: { name: input.name, email: input.email, passwordHash, avatarUrl: input.avatarUrl }
  });
  return { user: sanitizeUser(user), ...(await issueTokens(user.id)) };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw new AppError("INVALID_CREDENTIALS", "Invalid email or password", StatusCodes.UNAUTHORIZED);
  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) throw new AppError("INVALID_CREDENTIALS", "Invalid email or password", StatusCodes.UNAUTHORIZED);
  return { user: sanitizeUser(user), ...(await issueTokens(user.id)) };
}

export async function refresh(refreshToken: string | undefined) {
  if (!refreshToken) throw errors.unauthorized("Refresh token required");
  try {
    const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { sub: string; type: string };
    if (payload.type !== "refresh") throw errors.unauthorized("Invalid refresh token");
    const stored = await prisma.refreshToken.findUnique({ where: { tokenHash: hashToken(refreshToken) } });
    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) throw errors.unauthorized("Refresh token revoked or expired");
    await prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });
    return issueTokens(payload.sub);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw errors.unauthorized("Invalid refresh token");
  }
}

export async function logout(refreshToken: string | undefined): Promise<void> {
  if (!refreshToken) return;
  await prisma.refreshToken.updateMany({
    where: { tokenHash: hashToken(refreshToken), revokedAt: null },
    data: { revokedAt: new Date() }
  });
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw errors.notFound("USER_NOT_FOUND", "User not found");
  return sanitizeUser(user);
}
