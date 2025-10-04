import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useCategoryById, useUpdateCategory } from "@/hooks/use-categories";
import {
	ArrowLeft,
	Save,
	Folder,
	Tag,
	Globe,
	FileText,
	Plus,
	X,
} from "lucide-react";
import { z } from "zod";
import type {
	CategoryRequest,
	TranslationRequest,
} from "@/types/categories.types";

// Zod şeması
const categoryEditSchema = z.object({
	slug: z
		.string()
		.min(1, "Slug gereklidir")
		.regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir"),
	parentId: z
		.number()
		.min(0, "Üst kategori ID 0 veya pozitif olmalıdır"),
	translations: z
		.array(
			z.object({
				languageCode: z
					.string()
					.min(1, "Dil kodu gereklidir"),
				name: z
					.string()
					.min(1, "Kategori adı gereklidir"),
				description: z.string().optional(),
			})
		)
		.min(1, "En az bir dil çevirisi gereklidir"),
});

export default function CategoryEditPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const categoryId = parseInt(id || "0");
	const { data: category, isLoading, error } = useCategoryById(categoryId);
	const updateCategoryMutation = useUpdateCategory(categoryId);

	const languages = [
		{ code: "tr", name: "Türkçe" },
		{ code: "en", name: "English" },
		{ code: "de", name: "Deutsch" },
	];

	const [formData, setFormData] = useState<CategoryRequest>({
		slug: "",
		parentId: 0,
		translations: [],
	});

	const [errors, setErrors] = useState<{
		slug?: string;
		parentId?: string;
		translations?: string;
		submit?: string;
	}>({});

	useEffect(() => {
		if (category) {
			// API'den gelen translations array'ini kullan
			const translations =
				category.translations && category.translations.length > 0
					? category.translations.map((t) => ({
							languageCode: t.languageCode,
							name: t.name,
							description: t.description,
					  }))
					: [
							{
								languageCode: "tr",
								name: category.name || "",
								description: category.description || "",
							},
					  ];

			setFormData({
				slug: category.slug || "",
				parentId: category.parentId || 0,
				translations: translations,
			});
		}
	}, [category]);

	const validateForm = (): boolean => {
		try {
			categoryEditSchema.parse(formData);
			setErrors({});
			return true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				const newErrors: { slug?: string; parentId?: string; translations?: string } = {};
				
				(error as any).errors.forEach((err: any) => {
					const path = err.path.join('.');
					if (path === 'slug') {
						newErrors.slug = err.message;
					} else if (path === 'parentId') {
						newErrors.parentId = err.message;
					} else if (path.startsWith('translations')) {
						newErrors.translations = err.message;
					}
				});
				
				setErrors(newErrors);
			}
			return false;
		}
	};

	const handleInputChange = (
		field: keyof CategoryRequest,
		value: string | number | TranslationRequest[]
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (field === "slug" && errors.slug) {
			setErrors((prev) => ({ ...prev, slug: undefined }));
		}
		if (field === "parentId" && errors.parentId) {
			setErrors((prev) => ({ ...prev, parentId: undefined }));
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
	};

	const getAvailableLanguages = (currentIndex: number) => {
		const usedLanguages = formData.translations
			.filter((_, index) => index !== currentIndex)
			.map((t) => t.languageCode);
		return languages.filter((lang) => !usedLanguages.includes(lang.code));
	};

	const addTranslation = () => {
		const usedLanguages = formData.translations.map((t) => t.languageCode);
		const availableLanguage = languages.find(
			(lang) => !usedLanguages.includes(lang.code)
		);
		if (availableLanguage) {
			const newTranslations = [
				...formData.translations,
				{
					languageCode: availableLanguage.code,
					name: "",
					description: "",
				},
			];
			handleInputChange("translations", newTranslations);
		}
	};

	const removeTranslation = (index: number) => {
		if (formData.translations.length > 1) {
			const newTranslations = formData.translations.filter(
				(_, i) => i !== index
			);
			handleInputChange("translations", newTranslations);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});
		
		if (!validateForm()) return;

		try {
			await updateCategoryMutation.mutateAsync(formData);
			navigate("/categories");
		} catch (error: any) {
			console.error("Update error:", error);
			
			// API'den gelen hata mesajını kullanıcı dostu hale getir
			let errorMessage = "Kategori güncellenirken bir hata oluştu";
			
			if (error?.response?.data?.message) {
				const apiMessage = error.response.data.message;
				if (apiMessage.includes("Parent category not found")) {
					errorMessage = "Belirtilen üst kategori ID'si bulunamadı. Lütfen geçerli bir ID girin veya ana kategori için 0 kullanın.";
					setErrors({ parentId: errorMessage });
				} else if (apiMessage.includes("already exists")) {
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

	const isFormDisabled = updateCategoryMutation.isPending;

	if (isLoading)
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4" />
					<p className="text-gray-600">Kategori bilgileri yükleniyor...</p>
				</div>
			</div>
		);

	if (error || !category)
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<Folder className="w-8 h-8 text-red-600" />
					</div>
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Kategori Bulunamadı
					</h2>
					<p className="text-gray-600 mb-6">
						Aradığınız kategori bulunamadı veya erişim hatası oluştu.
					</p>
					<Button
						onClick={() => navigate("/categories")}
						className="bg-black text-white"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Kategori Listesine Dön
					</Button>
				</div>
			</div>
		);

	return (
		<div className="min-h-screen w-full">
			<div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 w-full">
				<div className="px-8 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<Button
								variant="outline"
								size="sm"
								onClick={() => navigate("/categories")}
								className="text-black border-gray-300"
							>
								<ArrowLeft className="w-4 h-4 mr-2" />
								Geri
							</Button>
							<div className="flex items-center space-x-3">
								<div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
									<Save className="w-5 h-5 text-white" />
								</div>
								<div>
									<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
										Kategori Düzenle
									</h1>
									<p className="text-gray-600 dark:text-gray-400 mt-1">
										{category.name} kategorisini düzenleyin
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
							<Save className="w-5 h-5" />
							<span>Kategori Bilgilerini Düzenle</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="space-y-4">
								<div className="flex items-center space-x-2 pb-2 border-b">
									<Tag className="w-4 h-4 text-gray-600" />
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
												placeholder="kategori-slug"
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
										<Label htmlFor="parentId">Üst Kategori ID</Label>
										<Input
											id="parentId"
											type="number"
											placeholder="0 (ana kategori)"
											value={formData.parentId}
											onChange={(e) =>
												handleInputChange(
													"parentId",
													parseInt(e.target.value) || 0
												)
											}
											disabled={isFormDisabled}
											className={`${errors.parentId ? "border-red-500" : ""}`}
										/>
										{errors.parentId && (
											<p className="text-sm text-red-600">{errors.parentId}</p>
										)}
									</div>
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

								{formData.translations.map((translation, index) => (
									<Card key={index} className="border border-gray-200">
										<CardHeader className="pb-3">
											<div className="flex items-center justify-between">
												<CardTitle className="text-sm font-medium text-gray-700">
													{languages.find(
														(lang) => lang.code === translation.languageCode
													)?.name || "Çeviri"}{" "}
													({translation.languageCode.toUpperCase()})
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
											<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
													<Label htmlFor={`name-${index}`}>
														Kategori Adı *
													</Label>
													<Input
														id={`name-${index}`}
														placeholder="Kategori adı"
														value={translation.name}
														onChange={(e) =>
															handleTranslationChange(
																index,
																"name",
																e.target.value
															)
														}
														disabled={isFormDisabled}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor={`description-${index}`}>
														Açıklama
													</Label>
													<Input
														id={`description-${index}`}
														placeholder="Kategori açıklaması"
														value={translation.description}
														onChange={(e) =>
															handleTranslationChange(
																index,
																"description",
																e.target.value
															)
														}
														disabled={isFormDisabled}
													/>
												</div>
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
									onClick={() => navigate("/categories")}
									disabled={isFormDisabled}
								>
									İptal
								</Button>
								<Button
									type="submit"
									disabled={isFormDisabled}
									className="bg-black text-white"
								>
									{isFormDisabled ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>

				<Card className="shadow-lg border-0 bg-white dark:bg-gray-800 w-full">
					<CardHeader className="border-b border-gray-200 dark:border-gray-600">
						<CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
							<FileText className="w-4 h-4" />
							<span>Mevcut Kategori Bilgileri</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
							<div className="space-y-3">
								<div>
									<p className="text-gray-500 mb-1">Kategori Adı</p>
									<p className="font-medium">{category.name}</p>
								</div>
								<div>
									<p className="text-gray-500 mb-1">Slug</p>
									<p className="font-medium font-mono">{category.slug}</p>
								</div>
								<div>
									<p className="text-gray-500 mb-1">Dil</p>
									<p className="font-medium">{category.language}</p>
								</div>
							</div>
							<div className="space-y-3">
								<div>
									<p className="text-gray-500 mb-1">Üst Kategori ID</p>
									<p className="font-medium">{category.parentId}</p>
								</div>
								<div>
									<p className="text-gray-500 mb-1">Durum</p>
									<span
										className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
											category.isActive
												? "bg-green-100 text-green-800"
												: "bg-red-100 text-red-800"
										}`}
									>
										{category.isActive ? "Aktif" : "Pasif"}
									</span>
								</div>
								<div>
									<p className="text-gray-500 mb-1">Alt Kategoriler</p>
									<p className="font-medium">
										{category.subcategories?.length || 0}
									</p>
								</div>
							</div>
						</div>
						{category.description && (
							<div className="mt-4 pt-4 border-t">
								<p className="text-gray-500 mb-2">Açıklama</p>
								<p className="text-gray-700">{category.description}</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
