import { z } from "zod";

// Login schema
export const loginSchema = z.object({
	email: z
		.string()
		.min(1, "Email gereklidir")
		.email("Geçerli bir email adresi giriniz"),
	password: z
		.string()
		.min(1, "Şifre gereklidir")
		.min(6, "Şifre en az 6 karakter olmalıdır"),
});

// Register schema (if needed in the future)
export const registerSchema = z.object({
	username: z
		.string()
		.min(1, "Kullanıcı adı gereklidir")
		.min(3, "Kullanıcı adı en az 3 karakter olmalıdır"),
	email: z
		.string()
		.min(1, "Email gereklidir")
		.email("Geçerli bir email adresi giriniz"),
	password: z
		.string()
		.min(1, "Şifre gereklidir")
		.min(6, "Şifre en az 6 karakter olmalıdır"),
	confirmPassword: z
		.string()
		.min(1, "Şifre tekrarı gereklidir"),
	firstName: z
		.string()
		.min(1, "Ad gereklidir")
		.min(2, "Ad en az 2 karakter olmalıdır"),
	lastName: z
		.string()
		.min(1, "Soyad gereklidir")
		.min(2, "Soyad en az 2 karakter olmalıdır"),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Şifreler eşleşmiyor",
	path: ["confirmPassword"],
});

// Password reset schema
export const passwordResetSchema = z.object({
	email: z
		.string()
		.min(1, "Email gereklidir")
		.email("Geçerli bir email adresi giriniz"),
});

// Password change schema
export const passwordChangeSchema = z.object({
	currentPassword: z
		.string()
		.min(1, "Mevcut şifre gereklidir"),
	newPassword: z
		.string()
		.min(1, "Yeni şifre gereklidir")
		.min(6, "Yeni şifre en az 6 karakter olmalıdır"),
	confirmPassword: z
		.string()
		.min(1, "Şifre tekrarı gereklidir"),
}).refine((data) => data.newPassword === data.confirmPassword, {
	message: "Şifreler eşleşmiyor",
	path: ["confirmPassword"],
});

// Auth types
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
