import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePostById, useDeletePost } from "@/hooks/use-post";
import {
	ArrowLeft,
	Edit,
	Trash2,
	FileText,
	Calendar,
	User,
	Tag,
	Folder,
	Globe,
	Image,
	Loader2,
} from "lucide-react";
import { DeleteModal } from "@/components/ui/modal";
import { useState } from "react";

export default function PostDetailPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const postId = parseInt(id || "0");

	const { data: postData, isLoading, error } = usePostById(postId);
	const [deleteModal, setDeleteModal] = useState<{
		isOpen: boolean;
		postId: number;
		postTitle: string;
	}>({
		isOpen: false,
		postId: 0,
		postTitle: "",
	});

	const deletePostMutation = useDeletePost(postId);

	const handleDeleteClick = () => {
		if (postData) {
			setDeleteModal({
				isOpen: true,
				postId: postData.id,
				postTitle: postData.title,
			});
		}
	};

	const handleDeleteConfirm = async () => {
		try {
			await deletePostMutation.mutateAsync();
			navigate("/posts");
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

	// Loading state
	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card className="w-full max-w-md">
					<CardContent className="pt-6">
						<div className="text-center">
							<Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
							<p className="text-gray-600">Post bilgileri yükleniyor...</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card className="w-full max-w-md">
					<CardContent className="pt-6">
						<div className="text-center">
							<p className="text-red-600">
								Post bilgileri yüklenirken hata oluştu
							</p>
							<p className="text-sm text-gray-500 mt-2">
								{error instanceof Error ? error.message : "Bilinmeyen hata"}
							</p>
							<Button
								onClick={() => navigate("/posts")}
								className="mt-4"
							>
								Post Listesine Dön
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Post not found
	if (!postData) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card className="w-full max-w-md">
					<CardContent className="pt-6">
						<div className="text-center">
							<p className="text-gray-600">Post bulunamadı</p>
							<Button
								onClick={() => navigate("/posts")}
								className="mt-4"
							>
								Post Listesine Dön
							</Button>
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
										Post Detayı
									</h1>
									<p className="text-gray-600 dark:text-gray-400 mt-1">
										Post bilgilerini görüntüleyin
									</p>
								</div>
							</div>
						</div>
						<div className="flex space-x-2">
							<Button
								variant="outline"
								onClick={() => navigate(`/posts/${postData.id}/edit`)}
								className="flex items-center gap-2"
							>
								<Edit className="w-4 h-4" />
								Düzenle
							</Button>
							<Button
								variant="outline"
								onClick={handleDeleteClick}
								disabled={deletePostMutation.isPending}
								className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
							>
								<Trash2 className="w-4 h-4" />
								Sil
							</Button>
						</div>
					</div>
				</div>
			</div>

			<div className="px-4 py-2 space-y-4">
				{/* Post Bilgileri */}
				<Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
					<CardHeader className="border-b border-gray-200 dark:border-gray-600">
						<CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
							<FileText className="w-5 h-5" />
							<span>Post Bilgileri</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Temel Bilgiler */}
							<div className="space-y-4">
								<div className="flex items-center space-x-2 pb-2 border-b">
									<FileText className="w-4 h-4 text-gray-600" />
									<h3 className="font-semibold text-gray-900">Temel Bilgiler</h3>
								</div>

								<div className="space-y-3">
									<div className="flex items-center space-x-3">
										<div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
											<FileText className="w-4 h-4 text-gray-600" />
										</div>
										<div>
											<p className="text-sm text-gray-500">ID</p>
											<p className="font-medium text-gray-900 dark:text-white">
												{postData.id}
											</p>
										</div>
									</div>

									<div className="flex items-center space-x-3">
										<div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
											<Tag className="w-4 h-4 text-gray-600" />
										</div>
										<div>
											<p className="text-sm text-gray-500">Slug</p>
											<p className="font-mono text-sm text-gray-900 dark:text-white">
												{postData.slug}
											</p>
										</div>
									</div>

									<div className="flex items-center space-x-3">
										<div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
											<Folder className="w-4 h-4 text-gray-600" />
										</div>
										<div>
											<p className="text-sm text-gray-500">Kategori</p>
											<p className="font-medium text-gray-900 dark:text-white">
												{postData.category?.name || "Kategori yok"}
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* Durum ve Tarih Bilgileri */}
							<div className="space-y-4">
								<div className="flex items-center space-x-2 pb-2 border-b">
									<Calendar className="w-4 h-4 text-gray-600" />
									<h3 className="font-semibold text-gray-900">Durum ve Tarih</h3>
								</div>

								<div className="space-y-3">
									<div className="flex items-center space-x-3">
										<div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
											<FileText className="w-4 h-4 text-gray-600" />
										</div>
										<div>
											<p className="text-sm text-gray-500">Durum</p>
											<Badge 
												variant="secondary" 
												className={
													postData.status === "PUBLISHED" 
														? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
														: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
												}
											>
												{postData.status === "PUBLISHED" ? "Yayında" : "Taslak"}
											</Badge>
										</div>
									</div>

									<div className="flex items-center space-x-3">
										<div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
											<Calendar className="w-4 h-4 text-gray-600" />
										</div>
										<div>
											<p className="text-sm text-gray-500">Yayın Tarihi</p>
											<p className="font-medium text-gray-900 dark:text-white">
												{postData.publishedAt ? new Date(postData.publishedAt).toLocaleDateString('tr-TR') : "Yayınlanmamış"}
											</p>
										</div>
									</div>

									<div className="flex items-center space-x-3">
										<div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
											<User className="w-4 h-4 text-gray-600" />
										</div>
										<div>
											<p className="text-sm text-gray-500">Yazar</p>
											<p className="font-medium text-gray-900 dark:text-white">
												{postData.authorUsername || "Bilinmeyen"}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Çeviriler */}
				<Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
					<CardHeader className="border-b border-gray-200 dark:border-gray-600">
						<CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
							<Globe className="w-5 h-5" />
							<span>Çeviriler</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{postData.translations?.map((translation: any, index: number) => (
								<Card key={index} className="border border-gray-200">
									<CardHeader className="pb-3">
										<CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
											{languages.find(
												(lang) => lang.code === translation.languageCode
											)?.name || "Çeviri"}
											<Badge variant="outline" className="text-xs">
												{translation.languageCode?.toUpperCase()}
											</Badge>
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div>
											<p className="text-sm text-gray-500 mb-1">Başlık</p>
											<p className="font-medium text-gray-900 dark:text-white">
												{translation.title}
											</p>
										</div>
										<div>
											<p className="text-sm text-gray-500 mb-1">Özet</p>
											<p className="text-gray-700 dark:text-gray-300">
												{translation.expert}
											</p>
										</div>
										<div>
											<p className="text-sm text-gray-500 mb-1">İçerik</p>
											<div className="prose max-w-none">
												<p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
													{translation.content}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							)) || (
								<p className="text-gray-500 italic">Çeviri bulunamadı</p>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Etiketler */}
				<Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
					<CardHeader className="border-b border-gray-200 dark:border-gray-600">
						<CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
							<Tag className="w-5 h-5" />
							<span>Etiketler</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-2">
							{postData.tags?.map((tag: any, index: number) => (
								<Badge 
									key={index}
									variant="secondary" 
									className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
								>
									{tag.name}
								</Badge>
							)) || (
								<p className="text-gray-500 italic">Etiket bulunamadı</p>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Öne Çıkan Resim */}
				{postData.featuredImage && (
					<Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
						<CardHeader className="border-b border-gray-200 dark:border-gray-600">
							<CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
								<Image className="w-5 h-5" />
								<span>Öne Çıkan Resim</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex justify-center">
								<img
									src={postData.featuredImage}
									alt="Öne çıkan resim"
									className="max-w-full h-auto rounded-lg shadow-lg"
								/>
							</div>
						</CardContent>
					</Card>
				)}
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

const languages = [
	{ code: "tr", name: "Türkçe" },
	{ code: "en", name: "English" },
	{ code: "de", name: "Deutsch" },
];