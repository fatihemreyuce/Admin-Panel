import { z } from "zod";

// Post translation schema
export const postTranslationSchema = z.object({
	languageCode: z
		.string()
		.min(1, "Dil kodu gereklidir"),
	title: z
		.string()
		.min(1, "Post başlığı gereklidir"),
	expert: z
		.string()
		.min(1, "Özet gereklidir"),
	content: z
		.string()
		.min(1, "İçerik gereklidir"),
});

// Post create schema (blog schema from post-create-page.tsx)
export const postCreateSchema = z.object({
	slug: z
		.string()
		.min(1, "Slug gereklidir")
		.regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir"),
	categoryId: z
		.number()
		.min(1, "Kategori seçimi gereklidir"),
	status: z.enum(["DRAFT", "PUBLISHED"]),
	translations: z
		.array(postTranslationSchema)
		.min(1, "En az bir dil çevirisi gereklidir"),
});

// Post edit schema (same as create)
export const postEditSchema = z.object({
	slug: z.string().min(1, "Slug gereklidir").regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir"),
	categoryId: z.number().min(1, "Kategori seçimi gereklidir"),
	status: z.enum(["DRAFT", "PUBLISHED"]),
	translations: z.array(postTranslationSchema).min(1, "En az bir dil çevirisi gereklidir"),
});

// Post types
export type PostTranslationInput = z.infer<typeof postTranslationSchema>;
export type PostCreateInput = z.infer<typeof postCreateSchema>;
export type PostEditInput = z.infer<typeof postEditSchema>;
