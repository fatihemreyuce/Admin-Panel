import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { usePosts, useDeletePost } from "@/hooks/use-post";
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react";
import type { PostResponse } from "@/types/post.types";

export default function PostListPage() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [sort, setSort] = useState("publishedAt,desc");

    const { data, isLoading, error } = usePosts(search, page - 1, size, sort);
    const deletePostMutation = useDeletePost(0);

    const handleDelete = async (id: number) => {
        if (window.confirm("Bu postu silmek istediğinizden emin misiniz?")) {
            await deletePostMutation.mutateAsync(id);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PUBLISHED":
                return <Badge className="bg-green-100 text-green-800">Yayınlandı</Badge>;
            case "DRAFT":
                return <Badge className="bg-yellow-100 text-yellow-800">Taslak</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (error) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="text-center text-red-600">
                            <p>Hata: {error.message}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Blog Yazıları</h1>
                    <p className="text-gray-600">Blog yazılarını yönetin</p>
                </div>
                <Link to="/posts/create">
                    <Button className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Yeni Post
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filtreler</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 items-center">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Post ara..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={sort} onValueChange={setSort}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Sıralama" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="publishedAt,desc">En Yeni</SelectItem>
                                <SelectItem value="publishedAt,asc">En Eski</SelectItem>
                                <SelectItem value="title,asc">Başlık A-Z</SelectItem>
                                <SelectItem value="title,desc">Başlık Z-A</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={size.toString()} onValueChange={(value) => setSize(Number(value))}>
                            <SelectTrigger className="w-24">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Posts Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Blog Yazıları ({data?.content.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
                            ))}
                        </div>
                    ) : data?.content.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p>Henüz blog yazısı bulunmuyor.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Başlık</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead>Yazar</TableHead>
                                    <TableHead>Durum</TableHead>
                                    <TableHead>Yayın Tarihi</TableHead>
                                    <TableHead>İşlemler</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.content.map((post: PostResponse) => (
                                    <TableRow key={post.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{post.title}</p>
                                                <p className="text-sm text-gray-500 truncate max-w-xs">
                                                    {post.expert}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{post.category.name}</Badge>
                                        </TableCell>
                                        <TableCell>{post.authorUsername}</TableCell>
                                        <TableCell>{getStatusBadge("PUBLISHED")}</TableCell>
                                        <TableCell>{formatDate(post.publishedAt)}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Link to={`/posts/${post.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Link to={`/posts/${post.id}/edit`}>
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(post.id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {data?.page && data.page.totalPages > 1 && (
                <div className="flex justify-center">
                    <Pagination
                        currentPage={page}
                        totalPages={data.page.totalPages}
                        onPageChange={setPage}
                    />
                </div>
            )}
        </div>
    );
}
