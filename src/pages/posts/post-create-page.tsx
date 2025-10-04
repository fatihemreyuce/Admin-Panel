import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreatePost } from "@/hooks/use-post";
import { useCategories } from "@/hooks/use-categories";
import { useTags } from "@/hooks/use-tags";
import { ArrowLeft, Save, FileText, Image, Tag } from "lucide-react";
import type { PostRequest } from "@/types/post.types";

export default function PostCreatePage() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState<Partial<PostRequest>>({
		slug: "",
		categoryId: 0,
		tags: [],
		status: "DRAFT",
		translations: [
			{
				languageCode: "tr",
				title: "",
				expert: "",
				content: ""
			}
		],
		image: undefined as File | undefined
	});

	const createPostMutation = useCreatePost();
	const { data: categoriesResponse } = useCategories("", 0, 100, "name,asc");
	const { data: tagsResponse } = useTags("", 0, 100, "name,asc");
	
	const categories = categoriesResponse?.content || [];
	const tags = tagsResponse?.content || [];

	const handleInputChange = (field: string, value: any) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}));
	};

	const handleTranslationChange = (field: string, value: string) => {
		setFormData(prev => ({
			...prev,
			translations: prev.translations?.map(t => 
				t.languageCode === "tr" ? { ...t, [field]: value } : t
			) || []
		}));
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setFormData(prev => ({ ...prev, image: file }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!formData.slug || !formData.categoryId || !formData.image) {
			alert("Lütfen tüm gerekli alanları doldurun");
			return;
		}

		try {
			await createPostMutation.mutateAsync(formData as PostRequest);
			navigate("/posts");
		} catch (error) {
			console.error("Create error:", error);
		}
	};

	return (
		<div className="min-h-screen">
			<div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
				<div className="px-4 py-2">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => navigate("/posts")}
								className="flex items-center space-x-2"
							>
								<ArrowLeft className="w-4 h-4" />
								<span>Geri</span>
							</Button>
							<div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
								<FileText className="w-5 h-5 text-white" />
							</div>
							<div>
								<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
									Yeni Blog Yazısı
								</h1>
								<p className="text-gray-600 dark:text-gray-400 mt-1">
									Yeni blog yazısı oluştur
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="px-4 py-6">
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Sol Kolon - Temel Bilgiler */}
						<div className="lg:col-span-2 space-y-6">
							<Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
								<CardHeader className="border-b border-gray-200 dark:border-gray-600">
									<CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
										Blog Yazısı Bilgileri
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4 pt-6">
									<div>
										<Label htmlFor="title">Başlık *</Label>
										<Input
											id="title"
											value={formData.translations?.[0]?.title || ""}
											onChange={(e) => handleTranslationChange("title", e.target.value)}
											placeholder="Blog yazısı başlığını girin"
											required
										/>
									</div>

									<div>
										<Label htmlFor="slug">Slug *</Label>
										<Input
											id="slug"
											value={formData.slug || ""}
											onChange={(e) => handleInputChange("slug", e.target.value)}
											placeholder="blog-yazisi-slug"
											required
										/>
									</div>

									<div>
										<Label htmlFor="expert">Özet</Label>
										<textarea
											id="expert"
											value={formData.translations?.[0]?.expert || ""}
											onChange={(e) => handleTranslationChange("expert", e.target.value)}
											placeholder="Blog yazısı özetini girin"
											className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>

									<div>
										<Label htmlFor="content">İçerik</Label>
										<textarea
											id="content"
											value={formData.translations?.[0]?.content || ""}
											onChange={(e) => handleTranslationChange("content", e.target.value)}
											placeholder="Blog yazısı içeriğini girin"
											className="w-full min-h-[200px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Sağ Kolon - Ayarlar */}
						<div className="space-y-6">
							<Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
								<CardHeader className="border-b border-gray-200 dark:border-gray-600">
									<CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
										Ayarlar
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4 pt-6">
									<div>
										<Label htmlFor="category">Kategori *</Label>
										<Select
											value={formData.categoryId?.toString() || ""}
											onValueChange={(value) => handleInputChange("categoryId", parseInt(value))}
										>
											<SelectTrigger>
												<SelectValue placeholder="Kategori seçin" />
											</SelectTrigger>
											<SelectContent>
												{categories.map((category) => (
													<SelectItem key={category.id} value={category.id.toString()}>
														{category.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div>
										<Label htmlFor="status">Durum</Label>
										<Select
											value={formData.status || "DRAFT"}
											onValueChange={(value) => handleInputChange("status", value)}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="DRAFT">Taslak</SelectItem>
												<SelectItem value="PUBLISHED">Yayında</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div>
										<Label htmlFor="image">Öne Çıkan Görsel *</Label>
										<div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
											<input
												type="file"
												id="image"
												accept="image/*"
												onChange={handleImageChange}
												className="w-full"
												required
											/>
											{formData.image && (
												<div className="mt-2 flex items-center space-x-2 text-sm text-green-600">
													<Image className="w-4 h-4" />
													<span>{formData.image.name}</span>
												</div>
											)}
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
								<CardHeader className="border-b border-gray-200 dark:border-gray-600">
									<CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
										<Tag className="w-4 h-4" />
										<span>Etiketler</span>
									</CardTitle>
								</CardHeader>
								<CardContent className="pt-6">
									<div className="space-y-2">
										{tags.map((tag) => (
											<label key={tag.id} className="flex items-center space-x-2">
												<input
													type="checkbox"
													checked={formData.tags?.some(t => t.id === tag.id) || false}
													onChange={(e) => {
														const isChecked = e.target.checked;
														const currentTags = formData.tags || [];
														const newTags = isChecked
															? [...currentTags, tag]
															: currentTags.filter(t => t.id !== tag.id);
														handleInputChange("tags", newTags);
													}}
													className="rounded"
												/>
												<span className="text-sm">{tag.name}</span>
											</label>
										))}
									</div>
								</CardContent>
							</Card>
						</div>
					</div>

					<div className="flex justify-end space-x-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => navigate("/posts")}
						>
							İptal
						</Button>
						<Button
							type="submit"
							disabled={createPostMutation.isPending}
							className="bg-black text-white flex items-center space-x-2"
						>
							<Save className="w-4 h-4" />
							<span>{createPostMutation.isPending ? "Kaydediliyor..." : "Kaydet"}</span>
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
