import { Category, Status } from "@prisma/client";
import { z } from "zod";

const categoriesValues = Object.values(Category) as [string, ...string[]];
const statusValues = Object.values(Status) as [string, ...string[]];

const requiredMessage = "This field is required";

export const feedbackSchema = z.object({
  title: z.string({ message: requiredMessage }).min(1, requiredMessage),
  description: z.string({ message: requiredMessage }).min(1, requiredMessage),
  category: z.enum(categoriesValues),
  status: z.enum(statusValues),
});
