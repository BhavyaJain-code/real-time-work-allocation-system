import http from "http";
import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { initSocket, logSocketState } from "./websocket/socket";

const server = http.createServer(app);
initSocket(server);

server.listen(env.PORT, () => {
  logger.info(`Backend listening on port ${env.PORT}`);
  logSocketState();
});

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
