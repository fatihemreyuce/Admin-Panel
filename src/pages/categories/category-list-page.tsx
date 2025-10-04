import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useCategories, useDeleteCategory } from "@/hooks/use-categories";
import { Search, Plus, Edit, Trash2, Eye, Folder, Tag } from "lucide-react";

export default function CategoryListPage() {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(0);
	const [size] = useState(10);
	const [sort] = useState("id,asc");

	const languages = [
		{ code: "tr", name: "Türkçe", flag: "🇹🇷" },
		{ code: "en", name: "English", flag: "🇺🇸" },
		{ code: "de", name: "Deutsch", flag: "🇩🇪" },
	];

	const {
		data: categoriesResponse,
		isLoading,
		error,
	} = useCategories(search, page, size, sort);
	const categoriesData = categoriesResponse?.content || [];
	const deleteCategoryMutation = useDeleteCategory(0); // Default ID for the hook

	const handleDelete = async (_categoryId: number, categoryName: string) => {
		if (
			window.confirm(
				`${categoryName} kategorisini silmek istediğinizden emin misiniz?`
			)
		) {
			try {
				await deleteCategoryMutation.mutateAsync();
			} catch (error) {
				console.error("Delete error:", error);
			}
		}
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		setPage(0);
	};

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

	const getTurkishTranslation = (
		category: import("@/types/categories.types").CategoryResponse
	) => {
		if (!category.translations || !Array.isArray(category.translations)) {
			return null;
		}
		return category.translations.find((t) => t.languageCode === "tr");
	};

	if (error) {
		return (
			<div className="flex items-center justify-center h-64">
				<Card className="w-full max-w-md">
					<CardContent className="pt-6">
						<div className="text-center">
							<p className="text-red-600">
								Kategoriler yüklenirken hata oluştu
							</p>
							<p className="text-sm text-gray-500 mt-2">
								{error instanceof Error ? error.message : "Bilinmeyen hata"}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen">
			<div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
				<div className="px-4 py-2">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
								<Folder className="w-5 h-5 text-white" />
							</div>
							<div>
								<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
									Kategoriler
								</h1>
								<p className="text-gray-600 dark:text-gray-400 mt-1">
									Kategori yönetimi ve listesi
								</p>
							</div>
						</div>
						<Link to="/categories/create">
							<Button className="bg-black text-white shadow-lg shadow-blue-500/25 flex items-center gap-2 w-auto">
								<Plus className="w-4 h-4" />
								Yeni Kategori
							</Button>
						</Link>
					</div>
				</div>
			</div>

			<div className="px-4 py-2 space-y-4">
				<Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
					<CardHeader className="border-b border-gray-200 dark:border-gray-600">
						<CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
							<Search className="w-5 h-5" />
							<span>Kategori Ara</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSearch} className="flex space-x-3">
							<div className="flex-1">
								<Input
									placeholder="Kategori adı veya slug ile ara..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
								/>
							</div>
							<Button type="submit">
								<Search className="w-4 h-4 mr-2" />
								Ara
							</Button>
						</form>
					</CardContent>
				</Card>

				<Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
					<CardHeader className="border-b border-gray-200 dark:border-gray-600">
						<CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
							<Folder className="w-5 h-5" />
							<span>Kategori Listesi</span>
							{categoriesResponse && (
								<span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
									({categoriesResponse.page?.totalElements || 0} kategori)
								</span>
							)}
						</CardTitle>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<div className="space-y-3">
								{[...Array(5)].map((_, i) => (
									<div
										key={i}
										className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse"
									>
										<div className="w-10 h-10 bg-gray-200 rounded-full" />
										<div className="flex-1">
											<div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
											<div className="h-3 bg-gray-200 rounded w-1/3" />
										</div>
										<div className="flex space-x-2">
											<div className="w-8 h-8 bg-gray-200 rounded" />
											<div className="w-8 h-8 bg-gray-200 rounded" />
											<div className="w-8 h-8 bg-gray-200 rounded" />
										</div>
									</div>
								))}
							</div>
						) : categoriesData?.length === 0 ? (
							<div className="text-center py-8">
								<Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
								<p className="text-gray-500">Kategori bulunamadı</p>
								{search && (
									<p className="text-sm text-gray-400 mt-2">
										"{search}" için sonuç bulunamadı
									</p>
								)}
							</div>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-[50px]">ID</TableHead>
										<TableHead>Kategori Adı</TableHead>
										<TableHead>Slug</TableHead>
										<TableHead>Açıklama</TableHead>
										<TableHead className="w-[120px]">Dil</TableHead>
										<TableHead className="w-[100px]">Durum</TableHead>
										<TableHead className="w-[120px]">İşlemler</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{categoriesData?.map(
										(
											category: import("@/types/categories.types").CategoryResponse
										) => {
											const turkishTranslation =
												getTurkishTranslation(category);
											const languageInfo = getLanguageInfo(
												turkishTranslation?.languageCode
											);
											return (
												<TableRow key={category.id}>
													<TableCell className="font-medium">
														{category.id}
													</TableCell>
													<TableCell className="font-medium">
														<div className="flex items-center space-x-2">
															<span>
																{turkishTranslation?.name ||
																	category.name ||
																	"İsimsiz"}
															</span>
															{category.subcategories &&
																category.subcategories.length > 0 && (
																	<span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
																		{category.subcategories.length} alt
																	</span>
																)}
														</div>
													</TableCell>
													<TableCell className="flex items-center space-x-2">
														<Tag className="w-4 h-4 text-gray-400" />
														<span className="text-sm font-mono">
															{category.slug}
														</span>
													</TableCell>
													<TableCell className="max-w-xs truncate">
														{turkishTranslation?.description ||
															category.description || (
																<span className="text-gray-400 italic">
																	Açıklama yok
																</span>
															)}
													</TableCell>
													<TableCell>
														<div className="flex items-center space-x-2">
															<span className="text-lg">
																{languageInfo.flag}
															</span>
															<div className="flex flex-col">
																<span className="text-sm font-medium">
																	{languageInfo.name}
																</span>
																<span className="text-xs text-gray-500">
																	{languageInfo.code?.toUpperCase() ||
																		"UNKNOWN"}
																</span>
															</div>
														</div>
													</TableCell>
													<TableCell>
														<span
															className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
																category.isActive
																	? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
																	: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
															}`}
														>
															{category.isActive ? "Aktif" : "Pasif"}
														</span>
													</TableCell>
													<TableCell>
														<div className="flex space-x-2">
															<Link to={`/categories/${category.id}`}>
																<Button
																	variant="outline"
																	size="sm"
																	className="h-8 w-8 p-0"
																>
																	<Eye className="w-4 h-4" />
																</Button>
															</Link>
															<Link to={`/categories/${category.id}/edit`}>
																<Button
																	variant="outline"
																	size="sm"
																	className="h-8 w-8 p-0"
																>
																	<Edit className="w-4 h-4" />
																</Button>
															</Link>
															<Button
																variant="outline"
																size="sm"
																onClick={() =>
																	handleDelete(
																		category.id,
																		turkishTranslation?.name ||
																			category.name ||
																			"Kategori"
																	)
																}
																disabled={deleteCategoryMutation.isPending}
																className="h-8 w-8 p-0 text-red-600"
															>
																<Trash2 className="w-4 h-4" />
															</Button>
														</div>
													</TableCell>
												</TableRow>
											);
										}
									)}
								</TableBody>
							</Table>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
