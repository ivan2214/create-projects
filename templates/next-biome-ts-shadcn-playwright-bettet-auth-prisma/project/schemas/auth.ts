import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email("Email inválido"),
	password: z
		.string()
		.min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const registerSchema = z.object({
	email: z.string().email("Email inválido"),
	password: z
		.string()
		.min(6, "La contraseña debe tener al menos 6 caracteres"),
	name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
	phone: z.string().min(10, "Teléfono inválido"),
	address: z.string().min(5, "Dirección inválida"),
});

export const forgotAccountSchema = z.object({
	email: z.string().email("Email inválido").min(1),
});

export const forgotPasswordSchema = z.object({
	email: z.string().email("Email inválido").min(1),
});

export const resetPasswordSchema = z.object({
	password: z
		.string()
		.min(6, "La contraseña debe tener al menos 6 caracteres"),
	token: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotAccountInput = z.infer<typeof forgotAccountSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
