import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useUserList, useDeleteUserById } from "@/hooks/use-user";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  Mail,
  Shield
} from "lucide-react";

export default function UsersListPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [sort] = useState("id,asc");

  const { data: usersData, isLoading, error } = useUserList(search, page, size, sort);
  const deleteUserMutation = useDeleteUserById();

  const handleDelete = async (userId: number, username: string) => {
    if (window.confirm(`${username} kullanıcısını silmek istediğinizden emin misiniz?`)) {
      try {
        await deleteUserMutation.mutateAsync(userId);
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0); // Reset to first page when searching
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 0 && newPage < (usersData?.page.totalPages || 0)) {
      setPage(newPage);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600">Kullanıcılar yüklenirken hata oluştu</p>
              <p className="text-sm text-gray-500 mt-2">{error instanceof Error ? error.message : 'Bilinmeyen hata'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kullanıcılar</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Kullanıcı yönetimi ve listesi</p>
              </div>
            </div>
            <Link to="/users/create">
              <Button className="bg-black text-white shadow-lg shadow-blue-500/25 flex items-center gap-2 w-auto">
                <Plus className="w-4 h-4" />
                Yeni Kullanıcı
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 py-2 space-y-4">

        {/* Search */}
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
          <CardHeader className=" border-b border-gray-200 dark:border-gray-600">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Kullanıcı Ara</span>
            </CardTitle>
          </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex space-x-3">
            <div className="flex-1">
              <Input
                placeholder="Kullanıcı adı veya email ile ara..."
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

        {/* Users List */}
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
          <CardHeader className=" border-b border-gray-200 dark:border-gray-600">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Kullanıcı Listesi</span>
              {usersData && (
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                  ({usersData.page.totalElements} kullanıcı)
                </span>
              )}
            </CardTitle>
          </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
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
          ) : usersData?.content.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Kullanıcı bulunamadı</p>
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
                  <TableHead className="w-[50px]">Avatar</TableHead>
                  <TableHead>Kullanıcı Adı</TableHead>
                  <TableHead>Ad Soyad</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="w-[100px]">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersData?.content.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-xs">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                    <TableCell className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{user.email}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {user.role === 'ADMIN' ? 'Yönetici' : 
                           user.role === 'MODERATOR' ? 'Moderatör' : 
                           'Kullanıcı'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {user.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link to={`/users/${user.id}`}>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link to={`/users/${user.id}/edit`}>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(user.id, user.username)}
                          disabled={deleteUserMutation.isPending}
                          className="h-8 w-8 p-0 text-red-600"
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
        {usersData && usersData.page.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Sayfa {usersData.page.number + 1} / {usersData.page.totalPages}
              <span className="ml-2">
                ({usersData.page.totalElements} toplam kullanıcı)
              </span>
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => goToPage(page - 1)}
                    className={page === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, usersData.page.totalPages) }, (_, i) => {
                  const pageNumber = i;
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        onClick={() => goToPage(pageNumber)}
                        isActive={page === pageNumber}
                        className="cursor-pointer"
                      >
                        {pageNumber + 1}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => goToPage(page + 1)}
                    className={page >= usersData.page.totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />  
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
