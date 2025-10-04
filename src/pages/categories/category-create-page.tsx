import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useCreateCategory } from "@/hooks/use-categories";
import {
	ArrowLeft,
	FolderPlus,
	Tag,
	Globe,
	FileText,
	Plus,
	X,
} from "lucide-react";
import type {
	CategoryRequest,
	TranslationRequest,
} from "@/types/categories.types";

export default function CategoryCreatePage() {
	const navigate = useNavigate();
	const createCategoryMutation = useCreateCategory();

	const languages = [
		{ code: "tr", name: "Türkçe" },
		{ code: "en", name: "English" },
		{ code: "de", name: "Deutsch" },
	];

	const [formData, setFormData] = useState<CategoryRequest>({
		slug: "",
		parentId: 0,
		translations: [
			{
				languageCode: "tr",
				name: "",
				description: "",
			},
		],
	});

	const [errors, setErrors] = useState<{
		slug?: string;
		translations?: string;
	}>({});

	const validateForm = (): boolean => {
		const newErrors: { slug?: string; translations?: string } = {};

		if (!formData.slug.trim()) {
			newErrors.slug = "Slug gereklidir";
		} else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
			newErrors.slug = "Slug sadece küçük harf, rakam ve tire içerebilir";
		}

		if (formData.translations.length === 0) {
			newErrors.translations = "En az bir dil çevirisi gereklidir";
		}

		formData.translations.forEach((translation) => {
			if (!translation.name.trim()) {
				newErrors.translations = "Tüm çevirilerde kategori adı gereklidir";
			}
			if (!translation.languageCode.trim()) {
				newErrors.translations = "Tüm çevirilerde dil kodu gereklidir";
			}
		});

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;

		try {
			await createCategoryMutation.mutateAsync(formData);
			navigate("/categories");
		} catch (error) {
			console.error("Create category error:", error);
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
		if (field === "translations" && errors.translations) {
			setErrors((prev) => ({ ...prev, translations: undefined }));
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

	const isFormDisabled = createCategoryMutation.isPending;

	return (
		<div className="min-h-screen w-full">
			<div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 w-full">
				<div className="px-8 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<Button
								variant="default"
								size="sm"
								onClick={() => navigate("/categories")}
							>
								<ArrowLeft className="w-4 h-4 mr-2" />
								Geri
							</Button>
							<div className="flex items-center space-x-3">
								<div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
									<FolderPlus className="w-5 h-5 text-white" />
								</div>
								<div>
									<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
										Yeni Kategori Ekle
									</h1>
									<p className="text-gray-600 dark:text-gray-400 mt-1">
										Sisteme yeni kategori ekleyin
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
							<FolderPlus className="w-5 h-5" />
							<span>Kategori Bilgileri</span>
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
										/>
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
															{languages.map((lang) => (
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
									{isFormDisabled ? "Oluşturuluyor..." : "Kategori Oluştur"}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>

				<Card className="shadow-lg border-0 bg-white dark:bg-gray-800 w-full">
					<CardHeader className="border-b border-gray-200 dark:border-gray-600">
						<CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
							<FileText className="w-4 h-4" />
							<span>Form Kuralları</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
							<div>
								<h4 className="font-medium text-gray-900 mb-2">
									Zorunlu Alanlar:
								</h4>
								<ul className="space-y-1">
									<li className="flex items-center space-x-2">
										<div className="w-1 h-1 bg-blue-500 rounded-full"></div>
										<span>Slug (küçük harf, rakam, tire)</span>
									</li>
									<li className="flex items-center space-x-2">
										<div className="w-1 h-1 bg-blue-500 rounded-full"></div>
										<span>En az bir çeviri</span>
									</li>
									<li className="flex items-center space-x-2">
										<div className="w-1 h-1 bg-blue-500 rounded-full"></div>
										<span>Dil kodu ve kategori adı</span>
									</li>
								</ul>
							</div>
							<div>
								<h4 className="font-medium text-gray-900 mb-2">
									Varsayılan Ayarlar:
								</h4>
								<ul className="space-y-1">
									<li className="flex items-center space-x-2">
										<div className="w-1 h-1 bg-green-500 rounded-full"></div>
										<span>Ana kategori (parentId: 0)</span>
									</li>
									<li className="flex items-center space-x-2">
										<div className="w-1 h-1 bg-green-500 rounded-full"></div>
										<span>Otomatik ID atanır</span>
									</li>
									<li className="flex items-center space-x-2">
										<div className="w-1 h-1 bg-green-500 rounded-full"></div>
										<span>Oluşturulma tarihi kaydedilir</span>
									</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
