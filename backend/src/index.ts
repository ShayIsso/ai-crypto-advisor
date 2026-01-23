import dotenv from "dotenv";
import app from "@/app";
import { prisma } from "@/lib/prisma";

dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

const server = app.listen(PORT, async () => {
  console.log(`[server] API started | env=${NODE_ENV} | port=${PORT}`);

  try {
    await prisma.$connect();
    console.log("[database] Connected");
  } catch (error) {
    console.error("[database] Connection failed", error);
  }
});

const gracefulShutdown = async (signal: string) => {
  console.log(`[shutdown] Signal received: ${signal}`);

  server.close(async () => {
    console.log("[server] HTTP server closed");

    try {
      await prisma.$disconnect();
      console.log("[database] Disconnected");
      process.exit(0);
    } catch (error) {
      console.error("[shutdown] Error during shutdown", error);
      process.exit(1);
    }
  });

  setTimeout(() => {
    console.error("[shutdown] Forced exit after timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  console.error("[error] Unhandled rejection", reason);
  gracefulShutdown("unhandledRejection");
});
