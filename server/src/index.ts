import express from "express";
import "dotenv/config";
import cors from "cors";
import db from "./lib/db.js";
import authRoutes from "./routes/auth.js";
import proposalRoutes from "./routes/proposals.js";
import dashboardRoutes from "./routes/dashboard.js";

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "healthy",
    message: "Server is running smoothly",
  });
});

app.get("/health/db", async (_req, res) => {
  try {
    await db.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: "healthy",
      database: true,
    });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      database: false,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
