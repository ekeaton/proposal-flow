import { Router } from "express";
import db from "../lib/db.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();
router.use(authMiddleware);

type LineItem = {
  quantity: number;
  rate: number;
  description: string;
};

/**
 * POST /api/proposals
 * Creates a new proposal with line items
 */
router.post("/", async (req, res) => {
  try {
    const { clientInfo, engagementType, duration, lineItems } = req.body;

    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!Array.isArray(lineItems)) {
      return res.status(400).json({ error: "lineItems must be an array" });
    }
    const userId = req.userId;

    const totalAmount = lineItems.reduce((total: number, item: LineItem) => {
      return total + item.quantity * item.rate;
    }, 0);

    const proposal = await db.$transaction(async (tx) => {
      return await tx.proposal.create({
        data: {
          clientInfo,
          engagementType,
          duration,
          totalAmount,
          user: { connect: { id: userId } },
          proposalLineItems: {
            create: lineItems.map((item: LineItem) => ({
              description: item.description,
              quantity: item.quantity,
              rate: item.rate,
            })),
          },
        },
        include: {
          proposalLineItems: true,
        },
      });
    });
    return res.status(201).json({ message: "Proposal created", proposal });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create proposal" });
  }
});

/**
 * GET /api/proposals
 * Retrieves all proposal with line items
 */
router.get("/", async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const userId = req.userId;

    const proposals = await db.proposal.findMany({
      where: { userId },
      include: { proposalLineItems: true },
    });
    return res.status(200).json({ message: "Proposals fetched", proposals });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch proposals" });
  }
});

/**
 * GET /api/proposals/:id
 *  Retrieves a proposal by id
 */
router.get("/:id", async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const userId = req.userId;

    const id = req.params.id;

    const proposal = await db.proposal.findFirst({
      where: { id, userId },
      include: { proposalLineItems: true },
    });

    if (!proposal) {
      return res.status(404).json({ error: "Proposal not found" });
    }

    return res.status(200).json({ message: "Proposal fetched", proposal });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch proposal" });
  }
});

/**
 * PATCH /api/proposals/:id
 *  Updates a proposal by id
 */
router.patch("/:id", async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const userId = req.userId;

    const id = req.params.id;

    const { clientInfo, engagementType, duration, status, lineItems } =
      req.body;

    const proposal = await db.proposal.findFirst({
      where: { id, userId },
      include: { proposalLineItems: true },
    });

    if (!proposal) {
      return res.status(404).json({ error: "Proposal not found" });
    }

    let newTotalAmount = 0;
    if (lineItems) {
      newTotalAmount = lineItems.reduce((total: number, item: LineItem) => {
        return total + item.quantity * item.rate;
      }, 0);
    }

    const updatedProposal = await db.$transaction(async (tx) => {
      return await tx.proposal.update({
        where: { id },
        data: {
          clientInfo,
          engagementType,
          duration,
          status,
          ...(lineItems && {
            totalAmount: newTotalAmount,
            proposalLineItems: {
              deleteMany: {},
              create: lineItems.map((item: LineItem) => ({
                description: item.description,
                quantity: item.quantity,
                rate: item.rate,
              })),
            },
          }),
        },
        include: { proposalLineItems: true },
      });
    });
    return res
      .status(200)
      .json({ message: "Proposal updated", proposal: updatedProposal });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update the proposal" });
  }
});

/**
 * DELETE /api/proposals/:id
 *  Delete a proposal by id
 */
router.delete("/:id", async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const userId = req.userId;

    const id = req.params.id;

    const proposal = await db.proposal.deleteMany({
      where: { id, userId },
    });

    if (proposal.count === 0) {
      return res.status(404).json({ error: "Proposal not found" });
    }

    return res.status(200).json({ message: "Proposal deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete the proposal" });
  }
});

export default router;
