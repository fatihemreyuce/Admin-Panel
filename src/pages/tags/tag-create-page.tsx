import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useCreateTag } from "@/hooks/use-tags";
import {
	ArrowLeft,
	Tag,
	Globe,
	Plus,
	X,
	Palette,
	Loader2,
} from "lucide-react";
import { tagCreateSchema, type TagCreateInput } from "@/validations";

export default function TagCreatePage() {
	const navigate = useNavigate();
	const createTagMutation = useCreateTag();

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
	} = useForm<TagCreateInput>({
		resolver: zodResolver(tagCreateSchema),
		defaultValues: {
			slug: "",
			color: "#3B82F6",
			translations: [
				{
					languageCode: "tr",
					name: "",
				},
			],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "translations",
	});

	const [submitError, setSubmitError] = useState<string>("");

	const onSubmit = async (data: TagCreateInput) => {
		setSubmitError("");
		
		try {
			await createTagMutation.mutateAsync(data);
			navigate("/tags");
		} catch (error: any) {
			console.error("Create tag error:", error);
			
			// API'den gelen hata mesajını kullanıcı dostu hale getir
			let errorMessage = "Tag oluşturulurken bir hata oluştu";
			
			if (error?.response?.data?.message) {
				const apiMessage = error.response.data.message;
				if (apiMessage.includes("already exists")) {
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
			});
		}
	};

	const isFormDisabled = createTagMutation.isPending || isSubmitting;

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
									<Tag className="w-5 h-5 text-white" />
								</div>
								<div>
									<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
										Yeni Tag Oluştur
									</h1>
									<p className="text-gray-600 dark:text-gray-400 mt-1">
										Yeni bir tag ekleyin
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
							<Tag className="w-5 h-5" />
							<span>Tag Bilgileri</span>
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
												placeholder="tag-slug"
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
										<Label htmlFor="color">Renk *</Label>
										<div className="relative">
											<Palette className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
											<Input
												id="color"
												type="color"
												{...register("color")}
												disabled={isFormDisabled}
												className={`pl-10 h-12 ${
													errors.color ? "border-red-500" : ""
												}`}
											/>
										</div>
										{errors.color && (
											<p className="text-sm text-red-600">{errors.color.message}</p>
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
												<CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
													{languages.find(
														(lang) => lang.code === translation.languageCode
													)?.name || "Çeviri"}
													<Badge variant="outline" className="text-xs">
														{translation.languageCode.toUpperCase()}
													</Badge>
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
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
														Tag Adı *
													</Label>
													<Input
														id={`name-${index}`}
														placeholder="Tag adı"
														{...register(`translations.${index}.name`)}
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
											Oluşturuluyor...
										</>
									) : (
										"Tag Oluştur"
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
