import { z } from "zod";

const requiredMessage = "This field is required";

export const signUpSchema = z.object({
  name: z
    .string()
    .min(1, requiredMessage)
    .max(16, "Name can't have more thatn 16 characters"),
  email: z.string().min(1, requiredMessage).email("Invalid email"),
  password: z
    .string()
    .min(1, requiredMessage)
    .min(8, "Password must contain at least 8 characters"),
  repeatedPassword: z.string().min(1, requiredMessage),
});
