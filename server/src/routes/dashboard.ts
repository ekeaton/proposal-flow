import { Router } from "express";
import db from "../lib/db.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();
router.use(authMiddleware);

/**
 * GET /api/dashboard
 * Returns aggregated proposal stats for the logged-in user
 */
router.get("/", async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.userId;

    const [totalProposals, statusCounts, acceptedStats] = await Promise.all([
      db.proposal.count({ where: { userId } }),
      db.proposal.groupBy({
        by: ["status"],
        where: { userId },
        _count: { status: true },
      }),
      db.proposal.aggregate({
        where: { userId, status: "ACCEPTED" },
        _sum: { totalAmount: true },
        _avg: { totalAmount: true },
      }),
    ]);
    return res.status(200).json({
      totalProposals,
      statusCounts: {
        pending:
          statusCounts.find((s) => s.status === "PENDING")?._count.status ?? 0,
        accepted:
          statusCounts.find((s) => s.status === "ACCEPTED")?._count.status ?? 0,
        rejected:
          statusCounts.find((s) => s.status === "REJECTED")?._count.status ?? 0,
      },
      totalRevenue: acceptedStats._sum.totalAmount ?? 0,
      averageValue: acceptedStats._avg.totalAmount ?? 0,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch the dashboard" });
  }
});

export default router;
