import dotenv from "dotenv";
import app from "@/app";
import { connectDB, disconnectDB } from "@/lib/prisma";

dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

let server: ReturnType<typeof app.listen> | undefined;

async function bootstrap() {
  // 1) Initialize dependencies
  await connectDB();

  // 2) Start accepting requests
  server = app.listen(PORT, () => {
    console.log(`[server] API started | env=${NODE_ENV} | port=${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("[startup] Fatal error during startup", error);
  process.exit(1);
});

let isShuttingDown = false;

async function cleanup() {
  console.log("[shutdown] Cleaning up resources");

  try {
    await disconnectDB();
    console.log("[shutdown] Database disconnected");
  } catch (err) {
    console.error("[shutdown] Failed to disconnect DB", err);
    throw err;
  }
}

function exitProcess(code: number) {
  console.log(`[shutdown] Exiting process with code ${code}`);
  process.exit(code);
}

const gracefulShutdown = (signal: string) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`[shutdown] Signal received: ${signal}`);

  const forceExitTimer = setTimeout(() => {
    console.error("[shutdown] Forced exit after timeout");
    exitProcess(1);
  }, 10000);

  if (server) {
    server.close(async () => {
      console.log("[server] HTTP server closed");

      try {
        await cleanup();
        clearTimeout(forceExitTimer);
        exitProcess(0);
      } catch {
        clearTimeout(forceExitTimer);
        exitProcess(1);
      }
    });
  } else {
    cleanup()
      .then(() => {
        clearTimeout(forceExitTimer);
        exitProcess(0);
      })
      .catch(() => {
        clearTimeout(forceExitTimer);
        exitProcess(1);
      });
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  console.error("[error] Unhandled rejection", reason);
  gracefulShutdown("unhandledRejection");
});
