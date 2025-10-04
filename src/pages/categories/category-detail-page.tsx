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
	Edit,
	Save,
	X,
	Folder,
	Tag,
	Globe,
	FileText,
	Plus,
	Trash2,
} from "lucide-react";
import type {
	CategoryRequest,
	TranslationRequest,
} from "@/types/categories.types";

export default function CategoryDetailPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const categoryId = parseInt(id || "0");
	const { data: category, isLoading, error } = useCategoryById(categoryId);
	const updateCategoryMutation = useUpdateCategory(categoryId);
	const [isEditing, setIsEditing] = useState(false);

	const languages = [
		{ code: "tr", name: "Türkçe", flag: "🇹🇷" },
		{ code: "en", name: "English", flag: "🇺🇸" },
		{ code: "de", name: "Deutsch", flag: "🇩🇪" },
	];

	const getLanguageInfo = (languageCode: string | undefined) => {
		if (!languageCode) {
			return {
				code: "unknown",
				name: "Bilinmeyen",
				flag: "🌐",
			};
		}

		return (
			languages.find((lang) => lang.code === languageCode) || {
				code: languageCode,
				name: languageCode.toUpperCase(),
				flag: "🌐",
			}
		);
	};

	const [formData, setFormData] = useState<CategoryRequest>({
		slug: "",
		parentId: 0,
		translations: [],
	});

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

	const handleInputChange = (
		field: keyof CategoryRequest,
		value: string | number | TranslationRequest[]
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await updateCategoryMutation.mutateAsync(formData);
			setIsEditing(false);
		} catch (error) {
			console.error("Update error:", error);
		}
	};

	const handleCancel = () => {
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
		setIsEditing(false);
	};

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
		<div className="min-h-screen bg-gray-50">
			<div className="bg-white border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<Button
								variant="outline"
								onClick={() => navigate("/categories")}
								className="text-black border-gray-300"
							>
								<ArrowLeft className="w-4 h-4 mr-2" />
								Geri
							</Button>
							<div>
								<h1 className="text-2xl font-bold text-gray-900">
									{isEditing ? "Kategori Düzenle" : "Kategori Detayları"}
								</h1>
								<p className="text-sm text-gray-600 mt-1">
									{category.name} - {category.slug}
								</p>
							</div>
						</div>
						{!isEditing && (
							<Button
								onClick={() => setIsEditing(true)}
								className="bg-black text-white"
							>
								<Edit className="w-4 h-4 mr-2" />
								Düzenle
							</Button>
						)}
					</div>
				</div>
			</div>

			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-1">
						<Card>
							<CardHeader className="text-center pb-4">
								<div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
									<Folder className="w-12 h-12 text-gray-400" />
								</div>
								<CardTitle className="text-xl">{category.name}</CardTitle>
								<p className="text-gray-600">#{category.slug}</p>
								<span
									className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-3 ${
										category.isActive
											? "bg-green-100 text-green-800"
											: "bg-red-100 text-red-800"
									}`}
								>
									<div
										className={`w-2 h-2 rounded-full mr-2 ${
											category.isActive ? "bg-green-500" : "bg-red-500"
										}`}
									/>
									{category.isActive ? "Aktif" : "Pasif"}
								</span>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center space-x-3">
									<Tag className="w-5 h-5 text-gray-400" />
									<div>
										<p className="text-sm text-gray-500">Slug</p>
										<p className="font-medium font-mono">{category.slug}</p>
									</div>
								</div>
								<div className="flex items-start space-x-3">
									<Globe className="w-5 h-5 text-gray-400 mt-1" />
									<div className="flex-1">
										<p className="text-sm text-gray-500 mb-2">Diller</p>
										<div className="flex flex-wrap gap-2">
											{category.translations && category.translations.length > 0 ? (
												category.translations.map((translation, index) => {
													const languageInfo = getLanguageInfo(translation.languageCode);
													return (
														<div
															key={index}
															className="inline-flex items-center justify-center bg-gray-100 rounded-full px-2 py-1 text-xs"
														>
															<span className="font-medium">
																{languageInfo.code?.toUpperCase()}
															</span>
														</div>
													);
												})
											) : (
												<span className="text-gray-400 italic text-sm">
													Çeviri yok
												</span>
											)}
										</div>
									</div>
								</div>
								<div className="flex items-center space-x-3">
									<Folder className="w-5 h-5 text-gray-400" />
									<div>
										<p className="text-sm text-gray-500">Üst Kategori ID</p>
										<p className="font-medium">{category.parentId}</p>
									</div>
								</div>
								{category.description && (
									<div className="pt-4 border-t flex items-start space-x-3">
										<FileText className="w-5 h-5 text-gray-400 mt-1" />
										<div>
											<p className="text-sm text-gray-500 mb-1">Açıklama</p>
											<p className="text-sm text-gray-700">
												{category.description}
											</p>
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					</div>

					<div className="lg:col-span-2">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									{isEditing ? (
										<>
											<Edit className="w-5 h-5" />
											<span>Kategori Bilgilerini Düzenle</span>
										</>
									) : (
										<>
											<Folder className="w-5 h-5" />
											<span>Kategori Bilgileri</span>
										</>
									)}
								</CardTitle>
							</CardHeader>
							<CardContent>
								{isEditing ? (
									<form onSubmit={handleSubmit} className="space-y-6">
										<div className="space-y-4">
											<h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
												Temel Bilgiler
											</h3>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor="slug">Slug *</Label>
													<Input
														id="slug"
														value={formData.slug}
														onChange={(e) =>
															handleInputChange("slug", e.target.value)
														}
														disabled={updateCategoryMutation.isPending}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="parentId">Üst Kategori ID</Label>
													<Input
														id="parentId"
														type="number"
														value={formData.parentId}
														onChange={(e) =>
															handleInputChange(
																"parentId",
																parseInt(e.target.value) || 0
															)
														}
														disabled={updateCategoryMutation.isPending}
													/>
												</div>
											</div>
										</div>
										<div className="space-y-4">
											<div className="flex items-center justify-between pb-2 border-b">
												<h3 className="text-lg font-semibold text-gray-900">
													Çeviriler
												</h3>
												<Button
													type="button"
													variant="outline"
													size="sm"
													onClick={addTranslation}
													disabled={
														updateCategoryMutation.isPending ||
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
															<CardTitle className="text-sm font-medium text-gray-700 flex items-center space-x-2">
																<span className="text-lg">
																	{
																		getLanguageInfo(translation.languageCode)
																			.flag
																	}
																</span>
																<span>
																	{
																		getLanguageInfo(translation.languageCode)
																			.name
																	}{" "}
																	(
																	{translation.languageCode?.toUpperCase() ||
																		"UNKNOWN"}
																	)
																</span>
															</CardTitle>
															{formData.translations.length > 1 && (
																<Button
																	type="button"
																	variant="outline"
																	size="sm"
																	onClick={() => removeTranslation(index)}
																	disabled={updateCategoryMutation.isPending}
																	className="h-6 w-6 p-0 text-red-600"
																>
																	<Trash2 className="w-3 h-3" />
																</Button>
															)}
														</div>
													</CardHeader>
													<CardContent className="space-y-4">
														<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
															<div className="space-y-2">
																<Label htmlFor={`language-${index}`}>
																	Dil *
																</Label>
																<Select
																	value={translation.languageCode}
																	onValueChange={(value) =>
																		handleTranslationChange(
																			index,
																			"languageCode",
																			value
																		)
																	}
																	disabled={updateCategoryMutation.isPending}
																>
																	<SelectTrigger className="w-full">
																		<SelectValue placeholder="Dil seçin" />
																	</SelectTrigger>
																	<SelectContent>
																		{languages.map((lang) => (
																			<SelectItem
																				key={lang.code}
																				value={lang.code}
																			>
																				<div className="flex items-center space-x-2">
																					<span>{lang.flag}</span>
																					<span>
																						{lang.name} (
																						{lang.code.toUpperCase()})
																					</span>
																				</div>
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
																	value={translation.name}
																	onChange={(e) =>
																		handleTranslationChange(
																			index,
																			"name",
																			e.target.value
																		)
																	}
																	disabled={updateCategoryMutation.isPending}
																/>
															</div>
															<div className="space-y-2">
																<Label htmlFor={`description-${index}`}>
																	Açıklama
																</Label>
																<Input
																	id={`description-${index}`}
																	value={translation.description}
																	onChange={(e) =>
																		handleTranslationChange(
																			index,
																			"description",
																			e.target.value
																		)
																	}
																	disabled={updateCategoryMutation.isPending}
																/>
															</div>
														</div>
													</CardContent>
												</Card>
											))}
										</div>
										<div className="flex justify-end space-x-4 pt-6 border-t">
											<Button
												type="button"
												variant="outline"
												onClick={handleCancel}
												disabled={updateCategoryMutation.isPending}
												className="text-white border-gray-300"
											>
												<X className="w-4 h-4 mr-2" />
												İptal
											</Button>
											<Button
												type="submit"
												disabled={updateCategoryMutation.isPending}
												className="bg-black text-white"
											>
												<Save className="w-4 h-4 mr-2" />
												{updateCategoryMutation.isPending
													? "Kaydediliyor..."
													: "Kaydet"}
											</Button>
										</div>
									</form>
								) : (
									<div className="space-y-6">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-4">
												<div>
													<p className="text-sm text-gray-500 mb-1">
														Kategori Adı
													</p>
													<p className="font-medium">{category.name}</p>
												</div>
												<div>
													<p className="text-sm text-gray-500 mb-1">Slug</p>
													<p className="font-medium font-mono">
														{category.slug}
													</p>
												</div>
											</div>
											<div className="space-y-4">
												<div>
													<p className="text-sm text-gray-500 mb-2">Diller</p>
													<div className="flex flex-wrap gap-1">
														{category.translations && category.translations.length > 0 ? (
															category.translations.map((translation, index) => {
																const languageInfo = getLanguageInfo(translation.languageCode);
																return (
																	<div
																		key={index}
																		className="inline-flex items-center justify-center bg-gray-100 rounded-full w-8 h-8"
																		title={`${languageInfo.name} (${languageInfo.code?.toUpperCase()})`}
																	>
																		<span className="text-lg">
																			{languageInfo.flag}
																		</span>
																	</div>
																);
															})
														) : (
															<span className="text-gray-400 italic text-sm">
																Çeviri yok
															</span>
														)}
													</div>
												</div>
												<div>
													<p className="text-sm text-gray-500 mb-1">Durum</p>
													<span
														className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
															category.isActive
																? "bg-green-100 text-green-800"
																: "bg-red-100 text-red-800"
														}`}
													>
														{category.isActive ? "Aktif" : "Pasif"}
													</span>
												</div>
											</div>
										</div>
										{category.description && (
											<div className="pt-4 border-t">
												<p className="text-sm text-gray-500 mb-2">Açıklama</p>
												<p className="text-gray-700">{category.description}</p>
											</div>
										)}
										<div className="pt-4 border-t">
											<div className="flex items-center space-x-3">
												<div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
													<span className="text-xs font-mono text-gray-600">
														ID
													</span>
												</div>
												<div>
													<p className="text-sm text-gray-500">Kategori ID</p>
													<p className="font-mono text-sm font-medium">
														{category.id}
													</p>
												</div>
											</div>
										</div>
										<div className="pt-4 border-t">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
												<div>
													<p className="text-gray-500">Üst Kategori ID</p>
													<p className="font-medium">{category.parentId}</p>
												</div>
												<div>
													<p className="text-gray-500">Alt Kategoriler</p>
													<p className="font-medium">
														{category.subcategories?.length || 0}
													</p>
												</div>
											</div>
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
