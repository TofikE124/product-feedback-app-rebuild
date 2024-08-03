import { z } from "zod";

const requiredMessage = "This field is required";

export const loginSchema = z.object({
  email: z.string().min(1, requiredMessage).email("Invalid email"),
  password: z.string().min(1, requiredMessage),
});
