import { z } from "zod";

// Tag translation schema
export const tagTranslationSchema = z.object({
	languageCode: z
		.string()
		.min(1, "Dil kodu gereklidir"),
	name: z
		.string()
		.min(1, "Tag adı gereklidir"),
});

// Tag create schema
export const tagCreateSchema = z.object({
	slug: z
		.string()
		.min(1, "Slug gereklidir")
		.regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir"),
	color: z
		.string()
		.min(1, "Renk gereklidir")
		.regex(/^#[0-9A-Fa-f]{6}$/, "Geçerli bir hex renk kodu giriniz (#RRGGBB)"),
	translations: z
		.array(tagTranslationSchema)
		.min(1, "En az bir dil çevirisi gereklidir"),
});

// Tag edit schema (same as create)
export const tagEditSchema = z.object({
	slug: z
		.string()
		.min(1, "Slug gereklidir")
		.regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir"),
	color: z
		.string()
		.min(1, "Renk gereklidir")
		.regex(/^#[0-9A-Fa-f]{6}$/, "Geçerli bir hex renk kodu giriniz (#RRGGBB)"),
	translations: z
		.array(tagTranslationSchema)
		.min(1, "En az bir dil çevirisi gereklidir"),
});

// Tag types
export type TagTranslationInput = z.infer<typeof tagTranslationSchema>;
export type TagCreateInput = z.infer<typeof tagCreateSchema>;
export type TagEditInput = z.infer<typeof tagEditSchema>;
