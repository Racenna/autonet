import z from "zod";
import { Gender } from "../../redux/services/types/user";

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .optional()
    .refine(
      (value) => !value || value.length > 2,
      "First name must be more than 2 characters"
    )
    .refine(
      (value) => !value || value.length < 50,
      "First name must be less than 50 characters"
    )
    .refine(
      (value) => !value || /^[a-zA-Z]{2,50}$/.test(value),
      "Not a valid first name format. Only Latin letters are allowed."
    ),
  lastName: z
    .string()
    .optional()
    .refine(
      (value) => !value || value.length > 2,
      "Last name must be more than 2 characters"
    )
    .refine(
      (value) => !value || value.length < 50,
      "Last name must be less than 50 characters"
    )
    .refine(
      (value) => !value || /^[a-zA-Z]{2,50}$/.test(value),
      "Not a valid last name format. Only Latin letters are allowed."
    ),
  birthday: z
    .date()
    .optional()
    .refine((value) => !value || value.getFullYear() >= 1923, "Too old")
    .refine(
      (value) => !value || value.getFullYear() <= new Date().getFullYear() - 3,
      "Too young"
    ),
  avatar: z.any(),
  description: z.string().optional(),
  gender: z.enum([Gender.Male, Gender.Female, Gender.Other]).nullable(),
  password: z
    .string()
    .optional()
    .refine(
      (value) => !value || value.length > 8,
      "Password must be more than 8 characters"
    )
    .refine(
      (value) => !value || value.length < 50,
      "Password must be less than 50 characters"
    )
    .refine(
      (value) =>
        !value || /^[A-Za-z0-9\\d!@#$%^&*()\\-_=+{};:,<.>]{8,50}$/.test(value),
      "Not a valid password format. Only Latin letters and digits are allowed."
    ),
});

export type UpdateProfileInput = z.TypeOf<typeof updateProfileSchema>;
