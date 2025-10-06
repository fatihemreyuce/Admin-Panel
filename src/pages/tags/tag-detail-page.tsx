import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTagById } from "@/hooks/use-tags";
import {
	ArrowLeft,
	Tag,
	Edit,
	Trash2,
	Palette,
	Globe,
	Calendar,
	Hash,
	Loader2,
} from "lucide-react";
import { DeleteModal } from "@/components/ui/modal";
import { useState } from "react";
import { useDeleteTag } from "@/hooks/use-tags";

export default function TagDetailPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const tagId = parseInt(id || "0");

	const { data: tagData, isLoading, error } = useTagById(tagId);
	const [deleteModal, setDeleteModal] = useState<{
		isOpen: boolean;
		tagId: number;
		tagName: string;
	}>({
		isOpen: false,
		tagId: 0,
		tagName: "",
	});

	const deleteTagMutation = useDeleteTag(deleteModal.tagId);

	const handleDeleteClick = () => {
		if (tagData) {
			setDeleteModal({
				isOpen: true,
				tagId: tagData.id,
				tagName: tagData.name,
			});
		}
	};

	const handleDeleteConfirm = async () => {
		try {
			await deleteTagMutation.mutateAsync();
			navigate("/tags");
		} catch (error) {
			console.error("Delete error:", error);
		}
	};

	const handleDeleteCancel = () => {
		setDeleteModal({
			isOpen: false,
			tagId: 0,
			tagName: "",
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
							<p className="text-gray-600">Tag bilgileri yükleniyor...</p>
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
								Tag bilgileri yüklenirken hata oluştu
							</p>
							<p className="text-sm text-gray-500 mt-2">
								{error instanceof Error ? error.message : "Bilinmeyen hata"}
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
		<div className="min-h-screen">
			<div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
				<div className="px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
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
										Tag Detayı
									</h1>
									<p className="text-gray-600 dark:text-gray-400 mt-1">
										Tag bilgilerini görüntüleyin
									</p>
								</div>
							</div>
						</div>
						<div className="flex space-x-2">
							<Button
								variant="outline"
								onClick={() => navigate(`/tags/${tagData.id}/edit`)}
								className="flex items-center gap-2"
							>
								<Edit className="w-4 h-4" />
								Düzenle
							</Button>
							<Button
								variant="outline"
								onClick={handleDeleteClick}
								disabled={deleteTagMutation.isPending}
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
				{/* Tag Bilgileri */}
				<Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
					<CardHeader className="border-b border-gray-200 dark:border-gray-600">
						<CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
							<Tag className="w-5 h-5" />
							<span>Tag Bilgileri</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Temel Bilgiler */}
							<div className="space-y-4">
								<div className="flex items-center space-x-2 pb-2 border-b">
									<Hash className="w-4 h-4 text-gray-600" />
									<h3 className="font-semibold text-gray-900">Temel Bilgiler</h3>
								</div>

								<div className="space-y-3">
									<div className="flex items-center space-x-3">
										<div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
											<Hash className="w-4 h-4 text-gray-600" />
										</div>
										<div>
											<p className="text-sm text-gray-500">ID</p>
											<p className="font-medium text-gray-900 dark:text-white">
												{tagData.id}
											</p>
										</div>
									</div>

									<div className="flex items-center space-x-3">
										<div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
											<Tag className="w-4 h-4 text-gray-600" />
										</div>
										<div>
											<p className="text-sm text-gray-500">Tag Adları</p>
											<div className="space-y-1">
												{tagData.translations?.map((translation, index) => (
													<div key={index} className="flex items-center gap-2">
														<span className="text-xs text-gray-500">
															{translation.languageCode?.toUpperCase()}:
														</span>
														<span className="font-medium text-gray-900 dark:text-white">
															{translation.name}
														</span>
													</div>
												)) || (
													<p className="font-medium text-gray-900 dark:text-white">
														{tagData.name}
													</p>
												)}
											</div>
										</div>
									</div>

									<div className="flex items-center space-x-3">
										<div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
											<Tag className="w-4 h-4 text-gray-600" />
										</div>
										<div>
											<p className="text-sm text-gray-500">Slug</p>
											<p className="font-mono text-sm text-gray-900 dark:text-white">
												{tagData.slug}
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* Renk ve Dil Bilgileri */}
							<div className="space-y-4">
								<div className="flex items-center space-x-2 pb-2 border-b">
									<Palette className="w-4 h-4 text-gray-600" />
									<h3 className="font-semibold text-gray-900">Görsel Bilgiler</h3>
								</div>

								<div className="space-y-3">
									<div className="flex items-center space-x-3">
										<div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
											<Palette className="w-4 h-4 text-gray-600" />
										</div>
										<div className="flex items-center space-x-3">
											<div>
												<p className="text-sm text-gray-500">Renk</p>
												<p className="font-medium text-gray-900 dark:text-white">
													{tagData.color}
												</p>
											</div>
											<div
												className="w-8 h-8 rounded-lg border border-gray-300 shadow-sm"
												style={{ backgroundColor: tagData.color }}
											/>
										</div>
									</div>

									<div className="flex items-center space-x-3">
										<div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
											<Globe className="w-4 h-4 text-gray-600" />
										</div>
										<div>
											<p className="text-sm text-gray-500">Dil</p>
											<div className="flex flex-wrap gap-1">
												{tagData.translations?.map((translation, index) => (
													<Badge 
														key={index}
														variant="secondary" 
														className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
													>
														{translation.languageCode?.toUpperCase() || "TR"}
													</Badge>
												)) || (
													<Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
														TR
													</Badge>
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Renk Önizleme */}
				<Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
					<CardHeader className="border-b border-gray-200 dark:border-gray-600">
						<CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
							<Palette className="w-5 h-5" />
							<span>Renk Önizleme</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex items-center space-x-4">
								<div
									className="w-16 h-16 rounded-lg border border-gray-300 shadow-lg flex items-center justify-center"
									style={{ backgroundColor: tagData.color }}
								>
									<Tag className="w-8 h-8 text-white drop-shadow-sm" />
								</div>
								<div>
									<p className="text-sm text-gray-500">Tag Önizleme</p>
									<p className="font-medium text-gray-900 dark:text-white">
										Bu tag nasıl görünecek
									</p>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="text-center">
									<div
										className="w-full h-12 rounded-lg border border-gray-300 shadow-sm flex items-center justify-center mb-2"
										style={{ backgroundColor: tagData.color }}
									>
										<span className="text-white font-medium text-sm">
											{tagData.translations?.[0]?.name || tagData.name}
										</span>
									</div>
									<p className="text-xs text-gray-500">Küçük Boyut</p>
								</div>
								<div className="text-center">
									<div
										className="w-full h-16 rounded-lg border border-gray-300 shadow-sm flex items-center justify-center mb-2"
										style={{ backgroundColor: tagData.color }}
									>
										<span className="text-white font-medium">
											{tagData.translations?.[0]?.name || tagData.name}
										</span>
									</div>
									<p className="text-xs text-gray-500">Orta Boyut</p>
								</div>
								<div className="text-center">
									<div
										className="w-full h-20 rounded-lg border border-gray-300 shadow-sm flex items-center justify-center mb-2"
										style={{ backgroundColor: tagData.color }}
									>
										<span className="text-white font-medium text-lg">
											{tagData.translations?.[0]?.name || tagData.name}
										</span>
									</div>
									<p className="text-xs text-gray-500">Büyük Boyut</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Teknik Bilgiler */}
				<Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
					<CardHeader className="border-b border-gray-200 dark:border-gray-600">
						<CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
							<Calendar className="w-5 h-5" />
							<span>Teknik Bilgiler</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-3">
								<div className="flex items-center space-x-3">
									<div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
										<Hash className="w-4 h-4 text-gray-600" />
									</div>
									<div>
										<p className="text-sm text-gray-500">Tag ID</p>
										<p className="font-mono text-sm text-gray-900 dark:text-white">
											{tagData.id}
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
											{tagData.slug}
										</p>
									</div>
								</div>
							</div>

							<div className="space-y-3">
								<div className="flex items-center space-x-3">
									<div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
										<Palette className="w-4 h-4 text-gray-600" />
									</div>
									<div>
										<p className="text-sm text-gray-500">Hex Kodu</p>
										<p className="font-mono text-sm text-gray-900 dark:text-white">
											{tagData.color}
										</p>
									</div>
								</div>

								<div className="flex items-center space-x-3">
									<div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
										<Globe className="w-4 h-4 text-gray-600" />
									</div>
									<div>
										<p className="text-sm text-gray-500">Dil Kodları</p>
										<div className="flex flex-wrap gap-1">
											{tagData.translations?.map((translation, index) => (
												<span 
													key={index}
													className="font-mono text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
												>
													{translation.languageCode || "tr"}
												</span>
											)) || (
												<span className="font-mono text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
													tr
												</span>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Delete Modal */}
			<DeleteModal
				isOpen={deleteModal.isOpen}
				onClose={handleDeleteCancel}
				onConfirm={handleDeleteConfirm}
				title="Tag Sil"
				message="Bu tagi silmek istediğinizden emin misiniz?"
				itemName={deleteModal.tagName}
				isLoading={deleteTagMutation.isPending}
				confirmText="Sil"
				cancelText="İptal"
			/>
		</div>
	);
}
