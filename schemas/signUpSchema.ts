import { z } from "zod";

const requiredMessage = "This field is required";

export const signUpSchema = z.object({
  email: z.string().min(1, requiredMessage).email("Invalid email"),
  password: z.string().min(1, requiredMessage).min(8, "Invalid password"),
  repeatedPassword: z.string().min(1, requiredMessage),
});
