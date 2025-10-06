import { z } from "zod";

// Category translation schema
export const categoryTranslationSchema = z.object({
	languageCode: z
		.string()
		.min(1, "Dil kodu gereklidir"),
	name: z
		.string()
		.min(1, "Kategori adı gereklidir"),
	description: z.string().optional(),
});

// Category create schema
export const categoryCreateSchema = z.object({
	slug: z
		.string()
		.min(1, "Slug gereklidir")
		.regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir"),
	parentId: z
		.union([z.number().min(0, "Üst kategori ID 0 veya pozitif olmalıdır"), z.null()]),
	translations: z
		.array(categoryTranslationSchema)
		.min(1, "En az bir dil çevirisi gereklidir"),
});

// Category edit schema (same as create)
export const categoryEditSchema = z.object({
	slug: z
		.string()
		.min(1, "Slug gereklidir")
		.regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir"),
	parentId: z
		.union([z.number().min(0, "Üst kategori ID 0 veya pozitif olmalıdır"), z.null()]),
	translations: z
		.array(categoryTranslationSchema)
		.min(1, "En az bir dil çevirisi gereklidir"),
});

// Category types
export type CategoryTranslationInput = z.infer<typeof categoryTranslationSchema>;
export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryEditInput = z.infer<typeof categoryEditSchema>;
