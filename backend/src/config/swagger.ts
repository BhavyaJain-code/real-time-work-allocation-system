export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Real-Time Work Allocation API",
    version: "1.0.0",
    description: "REST and Socket.IO backend for collaborative work allocation, teams, projects, tasks, comments, notifications, activity, and analytics."
  },
  servers: [{ url: "http://localhost:4000" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      refreshCookie: { type: "apiKey", in: "cookie", name: "refreshToken" }
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: { success: { type: "boolean" }, error: { type: "object", properties: { code: { type: "string" }, message: { type: "string" } } } }
      },
      SuccessResponse: { type: "object", properties: { success: { type: "boolean" }, data: { type: "object" } } }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: Object.fromEntries(
    [
      ["post", "/api/auth/register"], ["post", "/api/auth/login"], ["post", "/api/auth/refresh"], ["post", "/api/auth/logout"], ["get", "/api/auth/me"],
      ["get", "/api/users/me"], ["patch", "/api/users/me"], ["get", "/api/users/{id}"],
      ["post", "/api/teams"], ["get", "/api/teams"], ["get", "/api/teams/{id}"], ["patch", "/api/teams/{id}"], ["delete", "/api/teams/{id}"], ["post", "/api/teams/{id}/members"], ["patch", "/api/teams/{id}/members/{userId}"], ["delete", "/api/teams/{id}/members/{userId}"],
      ["post", "/api/projects"], ["get", "/api/projects"], ["get", "/api/projects/{id}"], ["patch", "/api/projects/{id}"], ["delete", "/api/projects/{id}"], ["post", "/api/projects/{id}/members"], ["delete", "/api/projects/{id}/members/{userId}"],
      ["post", "/api/tasks"], ["get", "/api/tasks"], ["get", "/api/tasks/{id}"], ["patch", "/api/tasks/{id}"], ["delete", "/api/tasks/{id}"], ["post", "/api/tasks/{id}/subtasks"], ["get", "/api/tasks/{id}/subtasks"], ["patch", "/api/tasks/{id}/position"],
      ["post", "/api/tasks/{taskId}/comments"], ["get", "/api/tasks/{taskId}/comments"], ["patch", "/api/comments/{id}"], ["delete", "/api/comments/{id}"],
      ["get", "/api/notifications"], ["patch", "/api/notifications/{id}/read"], ["patch", "/api/notifications/read-all"],
      ["get", "/api/projects/{projectId}/activity"], ["get", "/api/projects/{projectId}/analytics"], ["get", "/api/teams/{teamId}/analytics"]
    ].map(([method, path]) => [
      path,
      {
        [method]: {
          summary: `${method.toUpperCase()} ${path}`,
          responses: {
            "200": { description: "Successful response", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
            "400": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            "401": { description: "Authentication error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            "403": { description: "Authorization error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
          }
        }
      }
    ])
  )
};
