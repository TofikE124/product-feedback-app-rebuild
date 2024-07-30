import { z } from "zod";

const requiredMessage = "This field is required";

export const createCommentSchema = z.object({
  feedbackId: z.string({ message: requiredMessage }).min(1, requiredMessage),
  content: z
    .string({ message: "p" })
    .min(1, requiredMessage)
    .max(250, "Comment can't have more than 250 charachters"),
  parentId: z.string().optional(),
});
