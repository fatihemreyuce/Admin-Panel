import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeleteModal } from "@/components/ui/modal";
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
	Eye,
	Share
} from "lucide-react";

export default function PostDetailPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const postId = parseInt(id || "0");

	const [deleteModal, setDeleteModal] = useState<{
		isOpen: boolean;
		postTitle: string;
	}>({
		isOpen: false,
		postTitle: "",
	});

	const { data: postData, isLoading, error } = usePostById(postId);
	const deletePostMutation = useDeletePost(postId);

	const handleDeleteClick = () => {
		if (postData) {
			setDeleteModal({
				isOpen: true,
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
			postTitle: "",
		});
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('tr-TR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Card className="w-full max-w-md">
					<CardContent className="pt-6">
						<div className="text-center">
							<p className="text-gray-600">Blog yazısı yükleniyor...</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (error || !postData) {
		return (
			<div className="flex items-center justify-center h-64">
				<Card className="w-full max-w-md">
					<CardContent className="pt-6">
						<div className="text-center">
							<p className="text-red-600">Blog yazısı bulunamadı</p>
							<Button 
								onClick={() => navigate("/posts")}
								className="mt-4"
							>
								Geri Dön
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
								variant="ghost"
								size="sm"
								onClick={() => navigate("/posts")}
								className="flex items-center space-x-2"
							>
								<ArrowLeft className="w-4 h-4" />
								<span>Geri</span>
							</Button>
							<div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
								<Eye className="w-5 h-5 text-white" />
							</div>
							<div>
								<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
									Blog Yazısı Detayı
								</h1>
								<p className="text-gray-600 dark:text-gray-400 mt-1">
									{postData.title}
								</p>
							</div>
						</div>
						<div className="flex items-center space-x-2">
							<Link to={`/posts/${postId}/edit`}>
								<Button
									variant="outline"
									className="flex items-center space-x-2"
								>
									<Edit className="w-4 h-4" />
									<span>Düzenle</span>
								</Button>
							</Link>
							<Button
								variant="outline"
								onClick={handleDeleteClick}
								disabled={deletePostMutation.isPending}
								className="flex items-center space-x-2 text-red-600 hover:text-red-700"
							>
								<Trash2 className="w-4 h-4" />
								<span>Sil</span>
							</Button>
						</div>
					</div>
				</div>
			</div>

			<div className="px-4 py-6">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Ana İçerik */}
					<div className="lg:col-span-2 space-y-6">
						<Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
							<CardHeader className="border-b border-gray-200 dark:border-gray-600">
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
											{postData.title}
										</CardTitle>
										<div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
											<div className="flex items-center space-x-1">
												<Calendar className="w-4 h-4" />
												<span>{formatDate(postData.publishedAt)}</span>
											</div>
											<div className="flex items-center space-x-1">
												<User className="w-4 h-4" />
												<span>{postData.authorUsername}</span>
											</div>
											<div className="flex items-center space-x-1">
												<FileText className="w-4 h-4" />
												<span>{postData.language}</span>
											</div>
										</div>
									</div>
									<Badge 
										variant="default"
										className="ml-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
									>
										Yayında
									</Badge>
								</div>
							</CardHeader>
							<CardContent className="pt-6">
								{postData.featuredImage && (
									<div className="mb-6">
										<img
											src={postData.featuredImage}
											alt={postData.title}
											className="w-full h-64 object-cover rounded-lg"
										/>
									</div>
								)}

								{postData.expert && (
									<div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
										<h3 className="font-semibold text-gray-900 dark:text-white mb-2">
											Özet
										</h3>
										<p className="text-gray-700 dark:text-gray-300">
											{postData.expert}
										</p>
									</div>
								)}

								<div className="prose dark:prose-invert max-w-none">
									<h3 className="font-semibold text-gray-900 dark:text-white mb-3">
										İçerik
									</h3>
									<div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
										{postData.content}
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Yan Panel */}
					<div className="space-y-6">
						{/* Kategori Bilgisi */}
						<Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
							<CardHeader className="border-b border-gray-200 dark:border-gray-600">
								<CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
									<Folder className="w-4 h-4" />
									<span>Kategori</span>
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-6">
								{postData.category ? (
									<div className="space-y-2">
										<Badge variant="outline" className="text-sm">
											{postData.category.name}
										</Badge>
										{postData.category.description && (
											<p className="text-sm text-gray-600 dark:text-gray-400">
												{postData.category.description}
											</p>
										)}
									</div>
								) : (
									<p className="text-sm text-gray-500">Kategori atanmamış</p>
								)}
							</CardContent>
						</Card>

						{/* Etiketler */}
						<Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
							<CardHeader className="border-b border-gray-200 dark:border-gray-600">
								<CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
									<Tag className="w-4 h-4" />
									<span>Etiketler</span>
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-6">
								{postData.tags && postData.tags.length > 0 ? (
									<div className="flex flex-wrap gap-2">
										{postData.tags.map((tag) => (
											<Badge key={tag.id} variant="secondary" className="text-xs">
												{tag.name}
											</Badge>
										))}
									</div>
								) : (
									<p className="text-sm text-gray-500">Etiket atanmamış</p>
								)}
							</CardContent>
						</Card>

						{/* Teknik Bilgiler */}
						<Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
							<CardHeader className="border-b border-gray-200 dark:border-gray-600">
								<CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
									Teknik Bilgiler
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-6 space-y-3">
								<div className="flex justify-between text-sm">
									<span className="text-gray-600 dark:text-gray-400">ID:</span>
									<span className="font-mono">{postData.id}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-600 dark:text-gray-400">Slug:</span>
									<span className="font-mono text-xs truncate max-w-[150px]">
										{postData.slug}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-600 dark:text-gray-400">Dil:</span>
									<span>{postData.language}</span>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			<DeleteModal
				isOpen={deleteModal.isOpen}
				onClose={handleDeleteCancel}
				onConfirm={handleDeleteConfirm}
				title="Blog Yazısı Sil"
				message="Bu blog yazısını silmek istediğinizden emin misiniz?"
				itemName={deleteModal.postTitle}
				isLoading={deletePostMutation.isPending}
				confirmText="Sil"
				cancelText="İptal"
			/>
		</div>
	);
}
