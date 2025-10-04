import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePostById } from "@/hooks/use-post";
import { ArrowLeft, Edit, Calendar, User, Tag, Folder } from "lucide-react";

export default function PostDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: post, isLoading, error } = usePostById(Number(id));

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (isLoading) {
        return (
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={() => navigate("/posts")}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Geri
                    </Button>
                    <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="h-64 bg-gray-200 rounded animate-pulse" />
                        <div className="space-y-4">
                            <div className="h-8 bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="h-48 bg-gray-200 rounded animate-pulse" />
                        <div className="h-32 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="text-center text-red-600">
                            <p>Hata: {error.message}</p>
                            <Button 
                                className="mt-4" 
                                onClick={() => navigate("/posts")}
                            >
                                Post Listesine Dön
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="text-center">
                            <p>Post bulunamadı</p>
                            <Button 
                                className="mt-4" 
                                onClick={() => navigate("/posts")}
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
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={() => navigate("/posts")}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Geri
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
                        <p className="text-gray-600">Post Detayları</p>
                    </div>
                </div>
                <Button onClick={() => navigate(`/posts/${post.id}/edit`)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Düzenle
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Featured Image */}
                    <Card>
                        <CardContent className="p-0">
                            <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-full h-64 object-cover rounded-t-lg"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                }}
                            />
                        </CardContent>
                    </Card>

                    {/* Post Content */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Folder className="w-5 h-5" />
                                İçerik
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose max-w-none">
                                <p className="text-gray-600 mb-4">{post.expert}</p>
                                <div 
                                    className="text-gray-800 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Post Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Post Bilgileri</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <User className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="font-medium">Yazar</p>
                                    <p className="text-sm text-gray-600">{post.authorUsername}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="font-medium">Yayın Tarihi</p>
                                    <p className="text-sm text-gray-600">{formatDate(post.publishedAt)}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Folder className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="font-medium">Kategori</p>
                                    <Badge variant="outline">{post.category.name}</Badge>
                                </div>
                            </div>

                            <div>
                                <p className="font-medium mb-2">Dil</p>
                                <Badge variant="secondary">{post.language.toUpperCase()}</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tags */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Tag className="w-5 h-5" />
                                Etiketler
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {post.tags && post.tags.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag) => (
                                        <Badge key={tag.id} variant="secondary">
                                            {tag.name}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">Etiket bulunmuyor</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Post Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle>İstatistikler</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Slug:</span>
                                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                    {post.slug}
                                </code>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">ID:</span>
                                <span className="text-sm">{post.id}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
