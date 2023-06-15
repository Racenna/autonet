import z from "zod";

export const loginSchema = z.object({
  login: z
    .string()
    .nonempty("Login is required")
    .min(6, "Login must be more than 6 characters")
    .max(30, "Login must be less than 30 characters")
    .regex(
      /^[a-zA-Z0-9_-]*$/,
      "Not a valid login format. Only Latin letters, digits, underscore and hyphen are allowed."
    ),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(50, "Password must be less than 50 characters")
    .regex(
      /^[A-Za-z0-9\\d!@#$%^&*()\\-_=+{};:,<.>]{8,50}$/,
      "Not a valid password format. Only Latin letters and digits are allowed."
    ),
  rememberMe: z.boolean(),
});

export type LoginInput = z.TypeOf<typeof loginSchema>;
