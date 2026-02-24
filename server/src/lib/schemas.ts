import { z } from "zod";

export const lineItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().int().positive(),
  rate: z.number().positive(),
});

export const createProposalSchema = z.object({
  clientCompany: z.string().min(1),
  clientContactName: z.string().min(1),
  clientContactEmail: z.string().email(),
  engagementType: z.string().min(1),
  duration: z.number().int().positive(),
  lineItems: z.array(lineItemSchema).min(1),
});

export const updateProposalSchema = createProposalSchema.extend({
  status: z.enum(["PENDING", "ACCEPTED", "REJECTED"]),
});
