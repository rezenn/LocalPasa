import z from "zod";
import { UserRole } from "../types/user.type";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[0-9]/, "Password must contain a number");

const emailSchema = z.string().trim().toLowerCase().email("Invalid email");

const RegisterUserBaseSchema = z.object({
    fullName: z.string().trim().min(2).max(60),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    role: z
      .enum([UserRole.TOURIST, UserRole.ARTISAN])
      .default(UserRole.TOURIST)
      .optional(),
    phone: z.string().trim().min(7).max(20).optional(),
  });

export const RegisterUserDto = RegisterUserBaseSchema
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .transform(({ confirmPassword, ...rest }) => rest);
export type RegisterUserDto = z.infer<typeof RegisterUserDto>;

export const LoginUserDto = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});
export type LoginUserDto = z.infer<typeof LoginUserDto>;

export const CreateAdminSchema = RegisterUserBaseSchema.extend({
  role: z.literal("admin"),
}).transform(({ confirmPassword, ...rest }) => rest);
export type CreateAdminDto = z.infer<typeof CreateAdminSchema>;

export const UpdateUserDto = z.object({
  fullName: z.string().trim().min(2).max(60).optional(),
  phone: z.string().trim().min(7).max(20).optional(),
  avatar: z.string().url().optional(),
  preferredLanguage: z.string().trim().min(2).max(10).optional(),
  tourismPreferences: z.array(z.string().trim().min(1)).max(20).optional(),
});
export type UpdateUserDto = z.infer<typeof UpdateUserDto>;
