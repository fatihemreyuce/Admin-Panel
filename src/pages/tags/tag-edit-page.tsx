import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { useTagById, useUpdateTag } from "@/hooks/use-tags";
import {
	ArrowLeft,
	Edit,
	Tag,
	Globe,
	Plus,
	X,
	Palette,
	Loader2,
} from "lucide-react";
import { z } from "zod";
import type { TagRequest, TranslationRequest } from "@/types/tags.types";
import { tagEditSchema } from "@/validations";

export default function TagEditPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const tagId = parseInt(id || "0");

	const { data: tagData, isLoading: isLoadingTag, error: tagError } = useTagById(tagId);
	const updateTagMutation = useUpdateTag(tagId);

	const languages = [
		{ code: "tr", name: "Türkçe" },
		{ code: "en", name: "English" },
		{ code: "de", name: "Deutsch" },
	];

	const [formData, setFormData] = useState<TagRequest>({
		slug: "",
		color: "#3B82F6",
		translations: [
			{
				languageCode: "tr",
				name: "",
			},
		],
	});

	const [errors, setErrors] = useState<{
		slug?: string;
		color?: string;
		translations?: string;
		submit?: string;
	}>({});

	// Tag verilerini form'a yükle
	useEffect(() => {
		if (tagData) {
			setFormData({
				slug: tagData.slug || "",
				color: tagData.color || "#3B82F6",
				translations: tagData.translations && tagData.translations.length > 0 
					? tagData.translations.map(translation => ({
						languageCode: translation.languageCode || "tr",
						name: translation.name || "",
					}))
					: [
						{
							languageCode: "tr",
							name: tagData.name || "",
						},
					],
			});
		}
	}, [tagData]);

	const validateForm = (): boolean => {
		try {
			tagEditSchema.parse(formData);
			setErrors({});
			return true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				const newErrors: { slug?: string; color?: string; translations?: string } = {};
				
				error.issues.forEach((err) => {
					const path = err.path.join('.');
					if (path === 'slug') {
						newErrors.slug = err.message;
					} else if (path === 'color') {
						newErrors.color = err.message;
					} else if (path.startsWith('translations')) {
						// Check if it's a specific translation field error
						if (path.includes('name')) {
							newErrors.translations = "Tüm çeviriler için tag adı gereklidir";
						} else if (path.includes('languageCode')) {
							newErrors.translations = "Tüm çeviriler için dil kodu gereklidir";
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
			await updateTagMutation.mutateAsync(formData);
			navigate("/tags");
		} catch (error: any) {
			console.error("Update tag error:", error);
			
			// API'den gelen hata mesajını kullanıcı dostu hale getir
			let errorMessage = "Tag güncellenirken bir hata oluştu";
			
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
		field: keyof TagRequest,
		value: string | TranslationRequest[]
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (field === "slug" && errors.slug) {
			setErrors((prev) => ({ ...prev, slug: undefined }));
		}
		if (field === "color" && errors.color) {
			setErrors((prev) => ({ ...prev, color: undefined }));
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

	const isFormDisabled = updateTagMutation.isPending || isLoadingTag;

	// Loading state
	if (isLoadingTag) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card className="w-full max-w-md">
					<CardContent className="pt-6">
						<div className="text-center">
							<Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
							<p className="text-gray-600">Tag bilgileri yükleniyor...</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Error state
	if (tagError) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card className="w-full max-w-md">
					<CardContent className="pt-6">
						<div className="text-center">
							<p className="text-red-600">
								Tag bilgileri yüklenirken hata oluştu
							</p>
							<p className="text-sm text-gray-500 mt-2">
								{tagError instanceof Error ? tagError.message : "Bilinmeyen hata"}
							</p>
							<Button
								onClick={() => navigate("/tags")}
								className="mt-4"
							>
								Tag Listesine Dön
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Tag not found
	if (!tagData) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card className="w-full max-w-md">
					<CardContent className="pt-6">
						<div className="text-center">
							<p className="text-gray-600">Tag bulunamadı</p>
							<Button
								onClick={() => navigate("/tags")}
								className="mt-4"
							>
								Tag Listesine Dön
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen w-full">
			<div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 w-full">
				<div className="px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<Button
								variant="default"
								size="sm"
								onClick={() => navigate("/tags")}
							>
								<ArrowLeft className="w-4 h-4 mr-2" />
								Geri
							</Button>
							<div className="flex items-center space-x-3">
								<div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
									<Edit className="w-5 h-5 text-white" />
								</div>
								<div>
									<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
										Tag Düzenle
									</h1>
									<p className="text-gray-600 dark:text-gray-400 mt-1">
										Tag bilgilerini güncelleyin
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
							<Edit className="w-5 h-5" />
							<span>Tag Bilgileri</span>
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
												placeholder="tag-slug"
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
										<Label htmlFor="color">Renk *</Label>
										<div className="relative">
											<Palette className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
											<Input
												id="color"
												type="color"
												value={formData.color}
												onChange={(e) =>
													handleInputChange("color", e.target.value)
												}
												disabled={isFormDisabled}
												className={`pl-10 h-12 ${
													errors.color ? "border-red-500" : ""
												}`}
											/>
										</div>
										{errors.color && (
											<p className="text-sm text-red-600">{errors.color}</p>
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
													<Label htmlFor={`name-${index}`}>
														Tag Adı *
													</Label>
													<Input
														id={`name-${index}`}
														placeholder="Tag adı"
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
									onClick={() => navigate("/tags")}
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
											Güncelleniyor...
										</>
									) : (
										"Tag Güncelle"
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
