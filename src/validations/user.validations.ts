import { z } from "zod";

// User create schema
export const userCreateSchema = z.object({
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
	firstName: z
		.string()
		.min(1, "Ad gereklidir")
		.min(2, "Ad en az 2 karakter olmalıdır"),
	lastName: z
		.string()
		.min(1, "Soyad gereklidir")
		.min(2, "Soyad en az 2 karakter olmalıdır"),
	isActive: z.boolean().optional(),
	role: z.enum(["USER", "ADMIN", "MODERATOR"]).optional(),
	bio: z.string().optional(),
	profileImage: z.any().optional(),
});

// User edit schema (password optional)
export const userEditSchema = z.object({
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
		.optional()
		.refine((val) => !val || val.length >= 6, "Şifre en az 6 karakter olmalıdır"),
	firstName: z
		.string()
		.min(1, "Ad gereklidir")
		.min(2, "Ad en az 2 karakter olmalıdır"),
	lastName: z
		.string()
		.min(1, "Soyad gereklidir")
		.min(2, "Soyad en az 2 karakter olmalıdır"),
	isActive: z.boolean().optional(),
	role: z.enum(["USER", "ADMIN", "MODERATOR"]).optional(),
	bio: z.string().optional(),
	profileImage: z.any().optional(),
});

// User types
export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserEditInput = z.infer<typeof userEditSchema>;
