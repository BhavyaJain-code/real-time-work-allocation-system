import type { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { env } from "../config/env";
import { prisma } from "../prisma/client";
import { assertProjectUser, requireTeamRole } from "../middleware/authorization";
import { logger } from "../config/logger";

let io: Server | undefined;
const onlineUsers = new Map<string, Set<string>>();

type SocketPayload = { sub: string; type: "access" };

export function initSocket(server: HttpServer): Server {
  io = new Server(server, {
    cors: { origin: env.CLIENT_URL, credentials: true }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token as string | undefined;
      if (!token) return next(new Error("Authentication required"));
      const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as SocketPayload;
      if (payload.type !== "access") return next(new Error("Invalid token"));
      const user = await prisma.user.findUnique({ where: { id: payload.sub }, select: { id: true } });
      if (!user) return next(new Error("User not found"));
      socket.data.userId = user.id;
      return next();
    } catch {
      return next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId as string;
    const sockets = onlineUsers.get(userId) ?? new Set<string>();
    sockets.add(socket.id);
    onlineUsers.set(userId, sockets);
    socket.join(`user:${userId}`);
    socket.broadcast.emit("user.online", { userId });

    socket.on("project.join", async (projectId: string, cb?: (result: { ok: boolean; error?: string }) => void) => {
      try {
        await assertProjectUser(projectId, userId);
        socket.join(`project:${projectId}`);
        cb?.({ ok: true });
      } catch (error) {
        cb?.({ ok: false, error: error instanceof Error ? error.message : "Unauthorized" });
      }
    });

    socket.on("project.leave", (projectId: string, cb?: (result: { ok: boolean }) => void) => {
      socket.leave(`project:${projectId}`);
      cb?.({ ok: true });
    });

    socket.on("team.join", async (teamId: string, cb?: (result: { ok: boolean; error?: string }) => void) => {
      try {
        await requireTeamRole(userId, teamId, "VIEWER");
        socket.join(`team:${teamId}`);
        cb?.({ ok: true });
      } catch (error) {
        cb?.({ ok: false, error: error instanceof Error ? error.message : "Unauthorized" });
      }
    });

    socket.on("team.leave", (teamId: string, cb?: (result: { ok: boolean }) => void) => {
      socket.leave(`team:${teamId}`);
      cb?.({ ok: true });
    });

    socket.on("disconnect", () => {
      const active = onlineUsers.get(userId);
      active?.delete(socket.id);
      if (!active || active.size === 0) {
        onlineUsers.delete(userId);
        socket.broadcast.emit("user.offline", { userId });
      }
    });
  });

  return io;
}

export function getIO(): Server | undefined {
  return io;
}

export function emitToProject(projectId: string, event: string, payload: unknown): void {
  io?.to(`project:${projectId}`).emit(event, payload);
}

export function emitToTeam(teamId: string, event: string, payload: unknown): void {
  io?.to(`team:${teamId}`).emit(event, payload);
}

export function emitToUser(userId: string, event: string, payload: unknown): void {
  io?.to(`user:${userId}`).emit(event, payload);
}

export function logSocketState(): void {
  logger.info({ onlineUsers: onlineUsers.size }, "Socket server active");
}
