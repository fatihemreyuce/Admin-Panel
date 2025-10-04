import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserById, useUpdateUser } from "@/hooks/use-user";
import { ArrowLeft, Edit, Save, X, User, Mail, Calendar, Crown, FileText, Lock } from "lucide-react";
import type { UpdateUserRequest } from "@/types/user.types";

const getRoleDisplayName = (role: string) => 
  ({ ADMIN: 'Yönetici', MODERATOR: 'Moderatör', USER: 'Kullanıcı' }[role] || role);

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = parseInt(id || "0");
  const { data: user, isLoading, error } = useUserById(userId);
  const updateUserMutation = useUpdateUser(userId);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateUserRequest>({
    username: "", email: "", active: true, isActive: true, password: "",
    firstName: "", lastName: "", role: "USER", bio: "", profileImage: undefined,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "", email: user.email || "",
        active: user.isActive, isActive: user.isActive, password: "",
        firstName: user.firstName || "", lastName: user.lastName || "",
        role: user.role || "USER", bio: user.bio || "", profileImage: undefined,
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof UpdateUserRequest, value: string | boolean | File) => 
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updateData: UpdateUserRequest = { ...formData };
      if (!updateData.password || updateData.password.trim() === "") delete updateData.password;
      await updateUserMutation.mutateAsync(updateData);
      setIsEditing(false);
      setFormData(prev => ({ ...prev, password: "" }));
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        username: user.username || "", email: user.email || "",
        active: user.isActive, isActive: user.isActive, password: "",
        firstName: user.firstName || "", lastName: user.lastName || "",
        role: user.role || "USER", bio: user.bio || "", profileImage: undefined,
      });
    }
    setIsEditing(false);
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4" />
        <p className="text-gray-600">Kullanıcı bilgileri yükleniyor...</p>
      </div>
    </div>
  );

  if (error || !user) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Kullanıcı Bulunamadı</h2>
        <p className="text-gray-600 mb-6">Aradığınız kullanıcı bulunamadı veya erişim hatası oluştu.</p>
        <Button onClick={() => navigate("/users")} className="bg-black text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />Kullanıcı Listesine Dön
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate("/users")} className="text-white border-gray-300">
                <ArrowLeft className="w-4 h-4 mr-2" />Geri
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditing ? "Kullanıcı Düzenle" : "Kullanıcı Detayları"}
                </h1>
                <p className="text-sm text-gray-600 mt-1">{user.firstName} {user.lastName} - {user.username}</p>
              </div>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} className="bg-black text-white">
                <Edit className="w-4 h-4 mr-2" />Düzenle
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center pb-4">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Profil" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <CardTitle className="text-xl">{user.firstName} {user.lastName}</CardTitle>
                <p className="text-gray-600">@{user.username}</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-3 ${
                  user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                  {user.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Crown className="w-5 h-5 text-gray-400" />
                  <div><p className="text-sm text-gray-500">Rol</p><p className="font-medium">{getRoleDisplayName(user.role)}</p></div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div><p className="text-sm text-gray-500">Email</p><p className="font-medium text-sm break-all">{user.email}</p></div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div><p className="text-sm text-gray-500">Üyelik Tarihi</p><p className="font-medium">{new Date(user.createdAt).toLocaleDateString('tr-TR')}</p></div>
                </div>
                {user.bio && (
                  <div className="pt-4 border-t flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-gray-400 mt-1" />
                    <div><p className="text-sm text-gray-500 mb-1">Biyografi</p><p className="text-sm text-gray-700">{user.bio}</p></div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {isEditing ? <><Edit className="w-5 h-5" /><span>Kullanıcı Bilgilerini Düzenle</span></> : 
                    <><User className="w-5 h-5" /><span>Kullanıcı Bilgileri</span></>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Temel Bilgiler</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Ad *</Label>
                          <Input id="firstName" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} disabled={updateUserMutation.isPending} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Soyad *</Label>
                          <Input id="lastName" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} disabled={updateUserMutation.isPending} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Kullanıcı Adı *</Label>
                        <Input id="username" value={formData.username} onChange={(e) => handleInputChange("username", e.target.value)} disabled={updateUserMutation.isPending} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} disabled={updateUserMutation.isPending} />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Hesap Ayarları</h3>
                      <div className="space-y-2">
                        <Label htmlFor="password">Yeni Şifre (Opsiyonel)</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input id="password" type="password" placeholder="Şifre değiştirmek istemiyorsanız boş bırakın" value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} disabled={updateUserMutation.isPending} className="pl-10" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="role">Rol</Label>
                          <select id="role" value={formData.role || "USER"} onChange={(e) => handleInputChange("role", e.target.value)} disabled={updateUserMutation.isPending} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="USER">Kullanıcı</option>
                            <option value="ADMIN">Yönetici</option>
                            <option value="MODERATOR">Moderatör</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Durum</Label>
                          <div className="flex items-center space-x-3 p-3 border rounded-lg bg-gray-50">
                            <input type="checkbox" checked={formData.isActive} onChange={(e) => handleInputChange("isActive", e.target.checked)} disabled={updateUserMutation.isPending} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${formData.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                              <span className="text-sm font-medium">{formData.isActive ? 'Aktif Kullanıcı' : 'Pasif Kullanıcı'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Ek Bilgiler</h3>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Biyografi</Label>
                        <textarea id="bio" placeholder="Kullanıcı hakkında kısa bilgi..." value={formData.bio || ""} onChange={(e) => handleInputChange("bio", e.target.value)} disabled={updateUserMutation.isPending} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profileImage">Profil Resmi</Label>
                        <input id="profileImage" type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleInputChange("profileImage", file); }} disabled={updateUserMutation.isPending} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        <p className="text-xs text-gray-500">JPG, PNG veya GIF formatında resim yükleyebilirsiniz</p>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-4 pt-6 border-t">
                      <Button type="button" variant="outline" onClick={handleCancel} disabled={updateUserMutation.isPending} className="text-white border-gray-300">
                        <X className="w-4 h-4 mr-2" />İptal
                      </Button>
                      <Button type="submit" disabled={updateUserMutation.isPending} className="bg-black text-white">
                        <Save className="w-4 h-4 mr-2" />{updateUserMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div><p className="text-sm text-gray-500 mb-1">Kullanıcı Adı</p><p className="font-medium">{user.username}</p></div>
                        <div><p className="text-sm text-gray-500 mb-1">Email</p><p className="font-medium break-all">{user.email}</p></div>
                      </div>
                      <div className="space-y-4">
                        <div><p className="text-sm text-gray-500 mb-1">Rol</p><p className="font-medium">{getRoleDisplayName(user.role)}</p></div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Durum</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {user.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {user.bio && (
                      <div className="pt-4 border-t">
                        <p className="text-sm text-gray-500 mb-2">Biyografi</p>
                        <p className="text-gray-700">{user.bio}</p>
                      </div>
                    )}
                    <div className="pt-4 border-t">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-mono text-gray-600">ID</span>
                        </div>
                        <div><p className="text-sm text-gray-500">Kullanıcı ID</p><p className="font-mono text-sm font-medium">{user.id}</p></div>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div><p className="text-gray-500">Oluşturulma Tarihi</p><p className="font-medium">{new Date(user.createdAt).toLocaleDateString('tr-TR')}</p></div>
                        <div><p className="text-gray-500">Son Güncelleme</p><p className="font-medium">{new Date(user.updatedAt).toLocaleDateString('tr-TR')}</p></div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}