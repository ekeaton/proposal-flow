import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const proposalFormSchema = z.object({
  clientCompany: z
    .string()
    .min(2, "Company name must be at least 2 characters"),
  clientContactName: z.string().min(2, "Name must be at least 2 characters"),
  clientContactEmail: z.email("Enter a valid email"),
  engagementType: z
    .string()
    .min(2, "Engagement type must be at least 2 characters"),
  duration: z.number().int().positive("Duration must be a positive number"),
  lineItems: z
    .array(
      z.object({
        description: z.string().min(1, "Description is required"),
        quantity: z.number().int().positive("Must be a positive whole number"),
        rate: z.number().positive("Must be a positive number"),
      }),
    )
    .min(1, "At least one line item is required"),
});

export type ProposalFormValues = z.infer<typeof proposalFormSchema>;
