import http from "http";
import request from "supertest";
import { io as Client } from "socket.io-client";
import { app } from "../src/app";
import { initSocket } from "../src/websocket/socket";

type ApiBody<T> = { success: boolean; data: T };

describe("work allocation API", () => {
  let token = "";
  let otherToken = "";
  let teamId = "";
  let projectId = "";
  let taskId = "";

  it("registers, logs in, rejects duplicates and bad passwords", async () => {
    const registered = await request(app).post("/api/auth/register").send({ name: "Test User", email: "test@example.com", password: "Password123!" }).expect(201);
    token = (registered.body as ApiBody<{ accessToken: string }>).data.accessToken;
    await request(app).post("/api/auth/register").send({ name: "Test User", email: "test@example.com", password: "Password123!" }).expect(409);
    await request(app).post("/api/auth/login").send({ email: "test@example.com", password: "bad" }).expect(401);
    const login = await request(app).post("/api/auth/login").send({ email: "test@example.com", password: "Password123!" }).expect(200);
    token = (login.body as ApiBody<{ accessToken: string }>).data.accessToken;
    const other = await request(app).post("/api/auth/register").send({ name: "Other User", email: "other@example.com", password: "Password123!" }).expect(201);
    otherToken = (other.body as ApiBody<{ accessToken: string }>).data.accessToken;
  });

  it("protects endpoints", async () => {
    await request(app).get("/api/users/me").expect(401);
    await request(app).get("/api/users/me").set("Authorization", `Bearer ${token}`).expect(200);
  });

  it("creates teams, projects, members and enforces authorization", async () => {
    const team = await request(app).post("/api/teams").set("Authorization", `Bearer ${token}`).send({ name: "QA Team" }).expect(201);
    teamId = (team.body as ApiBody<{ id: string }>).data.id;
    const otherMe = await request(app).get("/api/users/me").set("Authorization", `Bearer ${otherToken}`).expect(200);
    await request(app).get(`/api/teams/${teamId}`).set("Authorization", `Bearer ${otherToken}`).expect(403);
    await request(app).post(`/api/teams/${teamId}/members`).set("Authorization", `Bearer ${token}`).send({ userId: otherMe.body.data.id, role: "MEMBER" }).expect(201);
    const project = await request(app).post("/api/projects").set("Authorization", `Bearer ${token}`).send({ teamId, name: "QA Project" }).expect(201);
    projectId = project.body.data.id;
    await request(app).post(`/api/projects/${projectId}/members`).set("Authorization", `Bearer ${token}`).send({ userId: otherMe.body.data.id, role: "MEMBER" }).expect(201);
  });

  it("handles task CRUD, assignment, status, filtering, subtasks, comments, notifications and analytics", async () => {
    const me = await request(app).get("/api/users/me").set("Authorization", `Bearer ${token}`).expect(200);
    const task = await request(app).post("/api/tasks").set("Authorization", `Bearer ${token}`).send({ projectId, title: "Build test task", assigneeId: me.body.data.id, priority: "HIGH" }).expect(201);
    taskId = task.body.data.id;
    await request(app).patch(`/api/tasks/${taskId}`).set("Authorization", `Bearer ${token}`).send({ status: "IN_PROGRESS" }).expect(200);
    await request(app).get(`/api/tasks?projectId=${projectId}&status=IN_PROGRESS&priority=HIGH&page=1&limit=10`).set("Authorization", `Bearer ${token}`).expect(200);
    await request(app).post(`/api/tasks/${taskId}/subtasks`).set("Authorization", `Bearer ${token}`).send({ title: "Subtask" }).expect(201);
    await request(app).get(`/api/tasks/${taskId}/subtasks`).set("Authorization", `Bearer ${token}`).expect(200);
    await request(app).post(`/api/tasks/${taskId}/comments`).set("Authorization", `Bearer ${token}`).send({ content: "Looks good" }).expect(201);
    await request(app).get("/api/notifications").set("Authorization", `Bearer ${token}`).expect(200);
    await request(app).get(`/api/projects/${projectId}/activity`).set("Authorization", `Bearer ${token}`).expect(200);
    await request(app).get(`/api/projects/${projectId}/analytics`).set("Authorization", `Bearer ${token}`).expect(200);
    await request(app).get(`/api/teams/${teamId}/analytics`).set("Authorization", `Bearer ${token}`).expect(200);
  });

  it("authenticates sockets and authorizes rooms", async () => {
    const server = http.createServer(app);
    initSocket(server);
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("Server address unavailable");
    const socket = Client(`http://localhost:${address.port}`, { auth: { token }, transports: ["websocket"] });
    await new Promise<void>((resolve, reject) => {
      socket.on("connect", resolve);
      socket.on("connect_error", reject);
    });
    const joinResult = await new Promise<{ ok: boolean }>((resolve) => socket.emit("project.join", projectId, resolve));
    expect(joinResult.ok).toBe(true);
    socket.close();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });
});
