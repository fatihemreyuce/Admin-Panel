import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useCreatePost } from "@/hooks/use-post";
import { useCategories } from "@/hooks/use-categories";
import { useTags } from "@/hooks/use-tags";
import {
	ArrowLeft,
	FileText,
	Globe,
	Plus,
	X,
	Image,
	Loader2,
	Tag,
	Folder,
} from "lucide-react";
import { z } from "zod";
import type { PostRequest, TranslationRequest } from "@/types/post.types";

// Zod şeması
const blogSchema = z.object({
	slug: z
		.string()
		.min(1, "Slug gereklidir")
		.regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir"),
	categoryId: z
		.number()
		.min(1, "Kategori seçimi gereklidir"),
	status: z.enum(["DRAFT", "PUBLISHED"]),
	translations: z
		.array(
			z.object({
				languageCode: z
					.string()
					.min(1, "Dil kodu gereklidir"),
				title: z
					.string()
					.min(1, "Blog başlığı gereklidir"),
				expert: z
					.string()
					.min(1, "Özet gereklidir"),
				content: z
					.string()
					.min(1, "İçerik gereklidir"),
			})
		)
		.min(1, "En az bir dil çevirisi gereklidir"),
});

export default function PostCreatePage() {
	const navigate = useNavigate();
	const createPostMutation = useCreatePost();
	const { data: categoriesResponse, isLoading: categoriesLoading, error: categoriesError } = useCategories("", 0, 100, "id,asc");
	const { data: tagsResponse, isLoading: tagsLoading, error: tagsError } = useTags("", 0, 100, "id,asc");

	const languages = [
		{ code: "tr", name: "Türkçe" },
		{ code: "en", name: "English" },
		{ code: "de", name: "Deutsch" },
	];

	const [formData, setFormData] = useState<PostRequest>({
		slug: "",
		categoryId: 0,
		tags: [],
		status: "DRAFT",
		translations: [
			{
				languageCode: "tr",
				title: "",
				expert: "",
				content: "",
			},
		],
		image: null as any,
	});

	const [errors, setErrors] = useState<{
		slug?: string;
		categoryId?: string;
		translations?: string;
		submit?: string;
	}>({});

	const validateForm = (): boolean => {
		try {
			blogSchema.parse(formData);
			setErrors({});
			return true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				const newErrors: { slug?: string; categoryId?: string; translations?: string } = {};
				
				error.issues.forEach((err) => {
					const path = err.path.join('.');
					if (path === 'slug') {
						newErrors.slug = err.message;
					} else if (path === 'categoryId') {
						newErrors.categoryId = err.message;
					} else if (path.startsWith('translations')) {
						// Check if it's a specific translation field error
						if (path.includes('title')) {
							newErrors.translations = "Tüm çeviriler için blog başlığı gereklidir";
						} else if (path.includes('expert')) {
							newErrors.translations = "Tüm çeviriler için özet gereklidir";
						} else if (path.includes('content')) {
							newErrors.translations = "Tüm çeviriler için içerik gereklidir";
						} else {
							newErrors.translations = err.message;
						}
					}
				});
				
				setErrors(newErrors);
			}
			return false;
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});
		
		if (!validateForm()) return;

		try {
			// Prepare data for API - convert tags to tagIds array
			const apiData = {
				...formData,
				tags: formData.tags.map((tag: any) => tag.id), // API expects tagIds but we'll send as tags
			};
			
			await createPostMutation.mutateAsync(apiData);
			navigate("/posts");
		} catch (error: any) {
			console.error("Create blog error:", error);
			
			// API'den gelen hata mesajını kullanıcı dostu hale getir
			let errorMessage = "Blog oluşturulurken bir hata oluştu";
			
			if (error?.response?.data?.message) {
				const apiMessage = error.response.data.message;
				if (apiMessage.includes("already exists")) {
					errorMessage = "Bu slug zaten kullanılıyor. Lütfen farklı bir slug deneyin.";
					setErrors({ slug: errorMessage });
				} else {
					setErrors({ submit: apiMessage });
				}
			} else {
				setErrors({ submit: errorMessage });
			}
		}
	};

	const handleInputChange = (
		field: keyof PostRequest,
		value: string | number | TranslationRequest[] | any[] | File | null
	) => {
		setFormData((prev: PostRequest) => ({ ...prev, [field]: value }));
		if (field === "slug" && errors.slug) {
			setErrors((prev) => ({ ...prev, slug: undefined }));
		}
		if (field === "categoryId" && errors.categoryId) {
			setErrors((prev) => ({ ...prev, categoryId: undefined }));
		}
		if (field === "translations" && errors.translations) {
			setErrors((prev) => ({ ...prev, translations: undefined }));
		}
		if (errors.submit) {
			setErrors((prev) => ({ ...prev, submit: undefined }));
		}
	};

	const handleTranslationChange = (
		index: number,
		field: keyof TranslationRequest,
		value: string
	) => {
		const newTranslations = [...formData.translations];
		newTranslations[index] = { ...newTranslations[index], [field]: value };
		handleInputChange("translations", newTranslations);
		
		// Clear translation errors when user starts typing
		if (errors.translations) {
			setErrors((prev) => ({ ...prev, translations: undefined }));
		}
	};

	const getAvailableLanguages = (currentIndex: number) => {
		const usedLanguages = formData.translations
			.filter((_: TranslationRequest, index: number) => index !== currentIndex)
			.map((t: TranslationRequest) => t.languageCode);
		return languages.filter((lang) => !usedLanguages.includes(lang.code));
	};

	const addTranslation = () => {
		const usedLanguages = formData.translations.map((t: TranslationRequest) => t.languageCode);
		const availableLanguage = languages.find(
			(lang) => !usedLanguages.includes(lang.code)
		);
		if (availableLanguage) {
			const newTranslations = [
				...formData.translations,
				{
					languageCode: availableLanguage.code,
					title: "",
					expert: "",
					content: "",
				},
			];
			handleInputChange("translations", newTranslations);
		}
	};

	const removeTranslation = (index: number) => {
		if (formData.translations.length > 1) {
			const newTranslations = formData.translations.filter(
				(_: TranslationRequest, i: number) => i !== index
			);
			handleInputChange("translations", newTranslations);
		}
	};

	const handleTagToggle = (tag: any) => {
		const isSelected = formData.tags.some((t: any) => t.id === tag.id);
		if (isSelected) {
			const newTags = formData.tags.filter((t: any) => t.id !== tag.id);
			handleInputChange("tags", newTags);
		} else {
			const newTags = [...formData.tags, tag];
			handleInputChange("tags", newTags);
		}
	};

	const isFormDisabled = createPostMutation.isPending;

	return (
		<div className="min-h-screen w-full">
			<div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 w-full">
				<div className="px-8 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<Button
								variant="default"
								size="sm"
								onClick={() => navigate("/posts")}
							>
								<ArrowLeft className="w-4 h-4 mr-2" />
								Geri
							</Button>
							<div className="flex items-center space-x-3">
								<div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
									<FileText className="w-5 h-5 text-white" />
								</div>
								<div>
									<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
										Yeni Blog Oluştur
									</h1>
									<p className="text-gray-600 dark:text-gray-400 mt-1">
										Yeni bir blog yazısı ekleyin
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="px-8 py-6 space-y-6 w-full">
				<Card className="shadow-lg border-0 bg-white dark:bg-gray-800 w-full">
					<CardHeader className="border-b border-gray-200 dark:border-gray-600">
						<CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
							<FileText className="w-5 h-5" />
							<span>Blog Bilgileri</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="space-y-4">
								<div className="flex items-center space-x-2 pb-2 border-b">
									<FileText className="w-4 h-4 text-gray-600" />
									<h3 className="font-semibold text-gray-900">
										Temel Bilgiler
									</h3>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="slug">Slug *</Label>
										<div className="relative">
											<Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
											<Input
												id="slug"
												placeholder="blog-slug"
												value={formData.slug}
												onChange={(e) =>
													handleInputChange("slug", e.target.value)
												}
												disabled={isFormDisabled}
												className={`pl-10 ${
													errors.slug ? "border-red-500" : ""
												}`}
											/>
										</div>
										{errors.slug && (
											<p className="text-sm text-red-600">{errors.slug}</p>
										)}
									</div>

									<div className="space-y-2">
										<Label htmlFor="categoryId">Kategori *</Label>
										<div className="relative">
											<Folder className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
											<Select
												value={formData.categoryId.toString()}
												onValueChange={(value) =>
													handleInputChange("categoryId", parseInt(value))
												}
												disabled={isFormDisabled}
											>
												<SelectTrigger className={`pl-10 ${
													errors.categoryId ? "border-red-500" : ""
												}`}>
													<SelectValue placeholder="Kategori seçin" />
												</SelectTrigger>
												<SelectContent>
													{categoriesLoading ? (
														<SelectItem value="loading" disabled>
															Kategoriler yükleniyor...
														</SelectItem>
													) : categoriesError ? (
														<SelectItem value="error" disabled>
															Kategoriler yüklenemedi
														</SelectItem>
													) : (categoriesResponse?.content?.length ?? 0) > 0 ? (
														categoriesResponse?.content?.map((category: any) => (
															<SelectItem key={category.id} value={category.id.toString()}>
																{category.name || category.translations?.[0]?.name || `Kategori ${category.id}`}
															</SelectItem>
														))
													) : (
														<SelectItem value="empty" disabled>
															Kategori bulunamadı
														</SelectItem>
													)}
												</SelectContent>
											</Select>
										</div>
										{errors.categoryId && (
											<p className="text-sm text-red-600">{errors.categoryId}</p>
										)}
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="status">Durum</Label>
										<Select
											value={formData.status}
											onValueChange={(value: "DRAFT" | "PUBLISHED") =>
												handleInputChange("status", value)
											}
											disabled={isFormDisabled}
										>
											<SelectTrigger>
												<SelectValue placeholder="Durum seçin" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="DRAFT">Taslak</SelectItem>
												<SelectItem value="PUBLISHED">Yayında</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label htmlFor="image">Öne Çıkan Resim</Label>
										<div className="flex items-center space-x-4">
											<div className="flex-1">
												<input
													id="image"
													type="file"
													accept="image/*"
													onChange={(e) => {
														const file = e.target.files?.[0];
														if (file) handleInputChange("image", file);
													}}
													disabled={isFormDisabled}
													className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700"
												/>
											</div>
											<div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
												<Image className="w-8 h-8 text-gray-400" />
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="space-y-4">
								<div className="flex items-center justify-between pb-2 border-b">
									<div className="flex items-center space-x-2">
										<Tag className="w-4 h-4 text-gray-600" />
										<h3 className="font-semibold text-gray-900">Etiketler</h3>
									</div>
								</div>

								<div className="flex flex-wrap gap-2">
									{tagsLoading ? (
										<Badge variant="outline" className="animate-pulse">
											Etiketler yükleniyor...
										</Badge>
									) : tagsError ? (
										<Badge variant="outline" className="text-red-600">
											Etiketler yüklenemedi
										</Badge>
													) : (tagsResponse?.content?.length ?? 0) > 0 ? (
														tagsResponse?.content?.map((tag: any) => {
											const isSelected = formData.tags.some((t: any) => t.id === tag.id);
											return (
												<Badge
													key={tag.id}
													variant={isSelected ? "default" : "outline"}
													className={`cursor-pointer ${
														isSelected 
															? "bg-blue-600 text-white" 
															: "hover:bg-blue-50"
													}`}
													onClick={() => handleTagToggle(tag)}
												>
													{tag.name || tag.translations?.[0]?.name || `Etiket ${tag.id}`}
												</Badge>
											);
										})
									) : (
										<Badge variant="outline" className="text-gray-500">
											Etiket bulunamadı
										</Badge>
									)}
								</div>
							</div>

							<div className="space-y-4">
								<div className="flex items-center justify-between pb-2 border-b">
									<div className="flex items-center space-x-2">
										<Globe className="w-4 h-4 text-gray-600" />
										<h3 className="font-semibold text-gray-900">Çeviriler</h3>
									</div>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={addTranslation}
										disabled={
											isFormDisabled ||
											formData.translations.length >= languages.length
										}
									>
										<Plus className="w-4 h-4 mr-2" />
										Çeviri Ekle
									</Button>
								</div>

								{formData.translations.map((translation: TranslationRequest, index: number) => (
									<Card key={index} className="border border-gray-200">
										<CardHeader className="pb-3">
											<div className="flex items-center justify-between">
												<CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
													{languages.find(
														(lang) => lang.code === translation.languageCode
													)?.name || "Çeviri"}
													<Badge variant="outline" className="text-xs">
														{translation.languageCode.toUpperCase()}
													</Badge>
												</CardTitle>
												{formData.translations.length > 1 && (
													<Button
														type="button"
														variant="outline"
														size="sm"
														onClick={() => removeTranslation(index)}
														disabled={isFormDisabled}
														className="h-6 w-6 p-0 text-red-600"
													>
														<X className="w-3 h-3" />
													</Button>
												)}
											</div>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor={`language-${index}`}>Dil *</Label>
													<Select
														value={translation.languageCode}
														onValueChange={(value) =>
															handleTranslationChange(
																index,
																"languageCode",
																value
															)
														}
														disabled={isFormDisabled}
													>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Dil seçin" />
														</SelectTrigger>
														<SelectContent>
															{getAvailableLanguages(index).map((lang) => (
																<SelectItem key={lang.code} value={lang.code}>
																	{lang.name} ({lang.code.toUpperCase()})
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
												<div className="space-y-2">
													<Label htmlFor={`title-${index}`}>
														Blog Başlığı *
													</Label>
													<Input
														id={`title-${index}`}
														placeholder="Blog başlığı"
														value={translation.title}
														onChange={(e) =>
															handleTranslationChange(
																index,
																"title",
																e.target.value
															)
														}
														disabled={isFormDisabled}
													/>
												</div>
											</div>
											<div className="space-y-2">
												<Label htmlFor={`expert-${index}`}>
													Özet *
												</Label>
												<textarea
													id={`expert-${index}`}
													placeholder="Blog özeti"
													value={translation.expert}
													onChange={(e) =>
														handleTranslationChange(
															index,
															"expert",
															e.target.value
														)
													}
													disabled={isFormDisabled}
													rows={3}
													className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor={`content-${index}`}>
													İçerik *
												</Label>
												<textarea
													id={`content-${index}`}
													placeholder="Blog içeriği"
													value={translation.content}
													onChange={(e) =>
														handleTranslationChange(
															index,
															"content",
															e.target.value
														)
													}
													disabled={isFormDisabled}
													rows={8}
													className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
												/>
											</div>
										</CardContent>
									</Card>
								))}
								{errors.translations && (
									<p className="text-sm text-red-600">{errors.translations}</p>
								)}
							</div>

							{errors.submit && (
								<div className="bg-red-50 border border-red-200 rounded-lg p-4">
									<p className="text-sm text-red-600">{errors.submit}</p>
								</div>
							)}

							<div className="flex justify-end space-x-4 pt-4 border-t">
								<Button
									type="button"
									variant="default"
									onClick={() => navigate("/posts")}
									disabled={isFormDisabled}
								>
									İptal
								</Button>
								<Button
									type="submit"
									disabled={isFormDisabled}
									className="bg-black text-white"
								>
									{isFormDisabled ? (
										<>
											<Loader2 className="w-4 h-4 mr-2 animate-spin" />
											Oluşturuluyor...
										</>
									) : (
										"Blog Oluştur"
									)}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}