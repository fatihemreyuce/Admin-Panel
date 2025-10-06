import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { categoryCreateSchema, type CategoryCreateInput } from "@/validations";

export default function CategoryCreatePage() {
	const navigate = useNavigate();
	const createCategoryMutation = useCreateCategory();

	const languages = [
		{ code: "tr", name: "Türkçe" },
		{ code: "en", name: "English" },
		{ code: "de", name: "Deutsch" },
	];

	const {
		register,
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
		setError,
		setValue,
		watch,
	} = useForm<CategoryCreateInput>({
		resolver: zodResolver(categoryCreateSchema),
		defaultValues: {
			slug: "",
			parentId: null,
			translations: [
				{
					languageCode: "tr",
					name: "",
					description: "",
				},
			],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "translations",
	});

	const [submitError, setSubmitError] = useState<string>("");


	const onSubmit = async (data: CategoryCreateInput) => {
		setSubmitError("");
		
		try {
			await createCategoryMutation.mutateAsync(data);
			navigate("/categories");
		} catch (error: any) {
			console.error("Create category error:", error);
			
			// API'den gelen hata mesajını kullanıcı dostu hale getir
			let errorMessage = "Kategori oluşturulurken bir hata oluştu";
			
			if (error?.response?.data?.message) {
				const apiMessage = error.response.data.message;
				if (apiMessage.includes("Parent category not found")) {
					errorMessage = "Belirtilen üst kategori ID'si bulunamadı. Lütfen geçerli bir ID girin veya ana kategori için 0 kullanın.";
					setError("parentId", { message: errorMessage });
				} else if (apiMessage.includes("already exists")) {
					errorMessage = "Bu slug zaten kullanılıyor. Lütfen farklı bir slug deneyin.";
					setError("slug", { message: errorMessage });
				} else {
					setSubmitError(apiMessage);
				}
			} else {
				setSubmitError(errorMessage);
			}
		}
	};


	const getAvailableLanguages = (currentIndex: number) => {
		const usedLanguages = fields
			.filter((_, index) => index !== currentIndex)
			.map((t) => t.languageCode);
		return languages.filter((lang) => !usedLanguages.includes(lang.code));
	};

	const addTranslation = () => {
		const usedLanguages = fields.map((t) => t.languageCode);
		const availableLanguage = languages.find(
			(lang) => !usedLanguages.includes(lang.code)
		);
		if (availableLanguage) {
			append({
				languageCode: availableLanguage.code,
				name: "",
				description: "",
			});
		}
	};

	const isFormDisabled = createCategoryMutation.isPending || isSubmitting;

	return (
		<div className="min-h-screen w-full">
			<div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 w-full">
				<div className="px-6 py-4">
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
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
												{...register("slug")}
												disabled={isFormDisabled}
												className={`pl-10 ${
													errors.slug ? "border-red-500" : ""
												}`}
											/>
										</div>
										{errors.slug && (
											<p className="text-sm text-red-600">{errors.slug.message}</p>
										)}
									</div>

									<div className="space-y-2">
		<Label htmlFor="parentId">Üst Kategori ID</Label>
		<Input
			id="parentId"
			type="text"
			placeholder="Boş bırakılırsa NULL olur"
			{...register("parentId", {
				setValueAs: (value) => {
					const raw = value.trim();
					return raw === "" ? null : Number.isNaN(Number(raw)) ? null : Math.max(0, Number(raw));
				}
			})}
			disabled={isFormDisabled}
			className={`${errors.parentId ? "border-red-500" : ""}`}
		/>
										{errors.parentId && (
											<p className="text-sm text-red-600">{errors.parentId.message}</p>
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
										fields.length >= languages.length
									}
									>
										<Plus className="w-4 h-4 mr-2" />
										Çeviri Ekle
									</Button>
								</div>

								{fields.map((translation, index) => (
									<Card key={index} className="border border-gray-200">
										<CardHeader className="pb-3">
											<div className="flex items-center justify-between">
												<CardTitle className="text-sm font-medium text-gray-700">
													{languages.find(
														(lang) => lang.code === translation.languageCode
													)?.name || "Çeviri"}{" "}
													({translation.languageCode.toUpperCase()})
												</CardTitle>
												{fields.length > 1 && (
													<Button
														type="button"
														variant="outline"
														size="sm"
														onClick={() => remove(index)}
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
													<Controller
														name={`translations.${index}.languageCode`}
														control={control}
														render={({ field }) => (
															<Select
																value={field.value}
																onValueChange={field.onChange}
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
														)}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor={`name-${index}`}>
														Kategori Adı *
													</Label>
													<Input
														id={`name-${index}`}
														placeholder="Kategori adı"
														{...register(`translations.${index}.name`)}
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
														{...register(`translations.${index}.description`)}
														disabled={isFormDisabled}
													/>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
								{errors.translations && (
									<p className="text-sm text-red-600">{errors.translations.message}</p>
								)}
							</div>

							{submitError && (
								<div className="bg-red-50 border border-red-200 rounded-lg p-4">
									<p className="text-sm text-red-600">{submitError}</p>
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
									{isFormDisabled ? "Oluşturuluyor..." : "Kategori Oluştur"}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
