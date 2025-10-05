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
import { DeleteModal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { usePosts, useDeletePost } from "@/hooks/use-post";
import { Search, Plus, Edit, Trash2, Eye, FileText, Tag } from "lucide-react";

export default function PostListPage() {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(0);
	const [size] = useState(10);
	const [sort] = useState("id,asc");
	const [deleteModal, setDeleteModal] = useState<{
		isOpen: boolean;
		postId: number;
		postTitle: string;
	}>({
		isOpen: false,
		postId: 0,
		postTitle: "",
	});

	const {
		data: postsResponse,
		isLoading,
		error,
	} = usePosts(search, page, size, sort);
	const postsData = postsResponse?.content || [];
	const deletePostMutation = useDeletePost(deleteModal.postId);

	const handleDeleteClick = (postId: number, postTitle: string) => {
		setDeleteModal({
			isOpen: true,
			postId,
			postTitle,
		});
	};

	const handleDeleteConfirm = async () => {
		try {
			await deletePostMutation.mutateAsync();
			setDeleteModal({
				isOpen: false,
				postId: 0,
				postTitle: "",
			});
		} catch (error) {
			console.error("Delete error:", error);
		}
	};

	const handleDeleteCancel = () => {
		setDeleteModal({
			isOpen: false,
			postId: 0,
			postTitle: "",
		});
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		setPage(0);
	};

	const getTurkishTranslation = (post: any) => {
		if (!post.translations || !Array.isArray(post.translations)) {
			return null;
		}
		return post.translations.find((t: any) => t.languageCode === "tr");
	};

	const getAllTranslations = (post: any) => {
		if (!post.translations || !Array.isArray(post.translations)) {
			return [];
		}
		return post.translations;
	};

	if (error) {
		return (
			<div className="flex items-center justify-center h-64">
				<Card className="w-full max-w-md">
					<CardContent className="pt-6">
						<div className="text-center">
							<p className="text-red-600">
								Postlar yüklenirken hata oluştu
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
								<FileText className="w-5 h-5 text-white" />
							</div>
							<div>
								<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
									Postlar
								</h1>
								<p className="text-gray-600 dark:text-gray-400 mt-1">
									Post yönetimi ve listesi
								</p>
							</div>
						</div>
						<Link to="/posts/create">
							<Button className="bg-black text-white shadow-lg shadow-blue-500/25 flex items-center gap-2 w-auto">
								<Plus className="w-4 h-4" />
								Yeni Post
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
							<span>Post Ara</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSearch} className="flex space-x-3">
							<div className="flex-1">
								<Input
									placeholder="Post başlığı veya slug ile ara..."
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
							<FileText className="w-5 h-5" />
							<span>Post Listesi</span>
							{postsResponse && (
								<span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
									({postsResponse.page?.totalElements || 0} post)
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
						) : postsData?.length === 0 ? (
							<div className="text-center py-8">
								<FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
								<p className="text-gray-500">Post bulunamadı</p>
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
										<TableHead>Post Başlığı</TableHead>
										<TableHead>Slug</TableHead>
										<TableHead>Kategori</TableHead>
										<TableHead className="w-[180px]">Diller</TableHead>
										<TableHead className="w-[100px]">Durum</TableHead>
										<TableHead className="w-[120px]">İşlemler</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{postsData?.map((post: any) => {
										const turkishTranslation = getTurkishTranslation(post);
										const allTranslations = getAllTranslations(post);
										return (
											<TableRow key={post.id}>
												<TableCell className="font-medium">
													{post.id}
												</TableCell>
												<TableCell className="font-medium">
													<div className="space-y-1">
														{allTranslations.map((translation: any, index: number) => (
															<div key={index} className="flex items-center gap-2">
																<span className="text-xs text-gray-500">
																	{translation.languageCode?.toUpperCase()}:
																</span>
																<span>{translation.title}</span>
															</div>
														)) || (
															<span>{post.title}</span>
														)}
													</div>
												</TableCell>
												<TableCell className="flex items-center space-x-2">
													<Tag className="w-4 h-4 text-gray-400" />
													<span className="text-sm font-mono">
														{post.slug}
													</span>
												</TableCell>
												<TableCell>
													<div className="flex items-center space-x-2">
														<span className="text-sm">
															{post.category?.name || "Kategori yok"}
														</span>
													</div>
												</TableCell>
												<TableCell>
													<div className="flex flex-wrap gap-1">
														{allTranslations.length > 0 ? (
															allTranslations.map((translation: any, index: number) => (
																<Badge 
																	key={index}
																	variant="secondary" 
																	className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
																>
																	{translation.languageCode?.toUpperCase() || "UN"}
																</Badge>
															))
														) : (
															<span className="text-gray-400 italic text-sm">
																Çeviri yok
															</span>
														)}
													</div>
												</TableCell>
												<TableCell>
													<Badge 
														variant="secondary" 
														className={
															post.status === "PUBLISHED" 
																? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
																: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
														}
													>
														{post.status === "PUBLISHED" ? "Yayında" : "Taslak"}
													</Badge>
												</TableCell>
												<TableCell>
													<div className="flex space-x-2">
														<Link to={`/posts/${post.id}`}>
															<Button
																variant="outline"
																size="sm"
																className="h-8 w-8 p-0"
															>
																<Eye className="w-4 h-4" />
															</Button>
														</Link>
														<Link to={`/posts/${post.id}/edit`}>
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
																handleDeleteClick(
																	post.id,
																	turkishTranslation?.title ||
																		post.title ||
																		"Post"
																)
															}
															disabled={deletePostMutation.isPending}
															className="h-8 w-8 p-0 text-red-600"
														>
															<Trash2 className="w-4 h-4" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Delete Modal */}
			<DeleteModal
				isOpen={deleteModal.isOpen}
				onClose={handleDeleteCancel}
				onConfirm={handleDeleteConfirm}
				title="Post Sil"
				message="Bu postu silmek istediğinizden emin misiniz?"
				itemName={deleteModal.postTitle}
				isLoading={deletePostMutation.isPending}
				confirmText="Sil"
				cancelText="İptal"
			/>
		</div>
	);
}