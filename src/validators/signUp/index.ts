import z from "zod";
import { Gender } from "../../redux/services/types/user";

export const registerSchema = z
  .object({
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
    firstName: z
      .string()
      .nonempty("First name is required")
      .min(2, "First name must be more than 2 characters")
      .max(50, "First name must be less than 50 characters")
      .regex(
        /^[a-zA-Z]{2,50}$/,
        "Not a valid first name format. Only Latin letters are allowed."
      ),
    lastName: z
      .string()
      .nonempty("Last name is required")
      .min(2, "Last name must be more than 2 characters")
      .max(50, "Last name must be less than 50 characters")
      .regex(
        /^[a-zA-Z]{2,50}$/,
        "Not a valid last name format. Only Latin letters are allowed."
      ),
    email: z.string().nonempty("Email is required").email("Invalid email"),
    passwordConfirm: z.string().nonempty("Please confirm your password"),
    birthday: z
      .date({
        required_error: "Please select a date",
        invalid_type_error: "Invalid date",
      })
      .min(new Date("1923-01-01"), "Too old")
      .max(
        new Date(new Date().setFullYear(new Date().getFullYear() - 3)),
        "Too young"
      ),
    gender: z.enum([Gender.Male, Gender.Female, Gender.Other], {
      invalid_type_error: "Choose gender",
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
  });

export type RegisterInput = z.TypeOf<typeof registerSchema>;
