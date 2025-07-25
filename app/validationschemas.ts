import { z } from "zod";

export const requestSchema = z.object({
  title: z.string().min(1, "Must have a title.").max(255),
  description: z.string().min(1, "Must have a description").max(65535),
});

export const chatMessageSchema = z.object({
  chatMsg: z.string().min(1, { message: "Message is required" }), // Match the sent field
});

export const patchRequestSchema = z.object({
  title: z.string().min(1, "Must have a title.").max(255).optional(),
  description: z
    .string()
    .min(1, "Must have a description")
    .max(65535)
    .optional(),

  assignedToUserId: z
    .string()
    .min(1, "AssignedToUserId is required.")
    .max(255)
    .optional()
    .nullable(),
});
