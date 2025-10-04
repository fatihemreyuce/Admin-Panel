import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateUser } from "@/hooks/use-user";
import { ArrowLeft, UserPlus, Mail, User, Lock, Shield, FileText, Image } from "lucide-react";
import { z } from "zod";
import type { CreateUserRequest } from "@/types/user.types";

// Zod şeması
const userSchema = z.object({
	username: z
		.string()
		.min(1, "Kullanıcı adı gereklidir")
		.min(3, "Kullanıcı adı en az 3 karakter olmalıdır"),
	email: z
		.string()
		.min(1, "Email gereklidir")
		.email("Geçerli bir email adresi giriniz"),
	password: z
		.string()
		.min(1, "Şifre gereklidir")
		.min(6, "Şifre en az 6 karakter olmalıdır"),
	firstName: z
		.string()
		.min(1, "Ad gereklidir")
		.min(2, "Ad en az 2 karakter olmalıdır"),
	lastName: z
		.string()
		.min(1, "Soyad gereklidir")
		.min(2, "Soyad en az 2 karakter olmalıdır"),
	isActive: z.boolean().optional(),
	role: z.enum(["USER", "ADMIN", "MODERATOR"]).optional(),
	bio: z.string().optional(),
});

export default function UserCreatePage() {
  const navigate = useNavigate();
  const createUserMutation = useCreateUser();

  const [formData, setFormData] = useState<CreateUserRequest>({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    isActive: true,
    role: "USER",
    bio: "",
  });

  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    submit?: string;
  }>({});

  const validateForm = (): boolean => {
    try {
      userSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: {
          username?: string;
          email?: string;
          password?: string;
          firstName?: string;
          lastName?: string;
        } = {};
        
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          if (path === 'username') {
            newErrors.username = err.message;
          } else if (path === 'email') {
            newErrors.email = err.message;
          } else if (path === 'password') {
            newErrors.password = err.message;
          } else if (path === 'firstName') {
            newErrors.firstName = err.message;
          } else if (path === 'lastName') {
            newErrors.lastName = err.message;
          }
        });
        
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!validateForm()) return;

    try {
      await createUserMutation.mutateAsync(formData);
      navigate("/users");
    } catch (error: any) {
      console.error("Create user error:", error);
      
      // API'den gelen hata mesajını kullanıcı dostu hale getir
      let errorMessage = "Kullanıcı oluşturulurken bir hata oluştu";
      
      if (error?.response?.data?.message) {
        const apiMessage = error.response.data.message;
        if (apiMessage.includes("already exists") || apiMessage.includes("duplicate")) {
          if (apiMessage.includes("email")) {
            setErrors({ email: "Bu email adresi zaten kullanılıyor" });
          } else if (apiMessage.includes("username")) {
            setErrors({ username: "Bu kullanıcı adı zaten kullanılıyor" });
          } else {
            setErrors({ submit: apiMessage });
          }
        } else {
          setErrors({ submit: apiMessage });
        }
      } else {
        setErrors({ submit: errorMessage });
      }
    }
  };

  const handleInputChange = (field: keyof CreateUserRequest, value: string | boolean | File) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (errors.submit) {
      setErrors(prev => ({ ...prev, submit: undefined }));
    }
  };

  const isFormDisabled = createUserMutation.isPending;

  return (
    <div className="min-h-screen w-full">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 w-full">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="default" size="sm" onClick={() => navigate("/users")}>
                <ArrowLeft className=" w-4 h-4 mr-2" />
                Geri
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Yeni Kullanıcı Ekle</h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Sisteme yeni kullanıcı ekleyin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6 w-full">
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 w-full">
          <CardHeader className="border-b border-gray-200 dark:border-gray-600">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <UserPlus className="w-5 h-5" />
              <span>Kullanıcı Bilgileri</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b">
                  <User className="w-4 h-4 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Temel Bilgiler</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Kullanıcı Adı *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="username"
                        placeholder="Kullanıcı adı"
                        value={formData.username}
                        onChange={(e) => handleInputChange("username", e.target.value)}
                        disabled={isFormDisabled}
                        className={`pl-10 ${errors.username ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.username && <p className="text-sm text-red-600">{errors.username}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="ornek@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        disabled={isFormDisabled}
                        className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Şifre *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="En az 6 karakter"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        disabled={isFormDisabled}
                        className={`pl-10 ${errors.password ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Ad *</Label>
                    <Input
                      id="firstName"
                      placeholder="Ad"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      disabled={isFormDisabled}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Soyad *</Label>
                    <Input
                      id="lastName"
                      placeholder="Soyad"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      disabled={isFormDisabled}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b">
                  <Shield className="w-4 h-4 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Hesap Ayarları</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Rol</Label>
                    <select
                      id="role"
                      value={formData.role || "USER"}
                      onChange={(e) => handleInputChange("role", e.target.value)}
                      disabled={isFormDisabled}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="USER">Kullanıcı</option>
                      <option value="ADMIN">Yönetici</option>
                      <option value="MODERATOR">Moderatör</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Durum</Label>
                    <div className="flex items-center space-x-3 p-3 border rounded-lg bg-gray-50">
                      <input
                        id="isActive"
                        type="checkbox"
                        checked={formData.isActive || false}
                        onChange={(e) => handleInputChange("isActive", e.target.checked)}
                        disabled={isFormDisabled}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2"
                      />
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${formData.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                        <Label htmlFor="isActive" className="cursor-pointer">
                          {formData.isActive ? 'Aktif' : 'Pasif'}
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Ek Bilgiler</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biyografi</Label>
                  <textarea
                    id="bio"
                    placeholder="Kullanıcı hakkında kısa bilgi..."
                    value={formData.bio || ""}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    disabled={isFormDisabled}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profileImage">Profil Resmi</Label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleInputChange("profileImage", file);
                        }}
                        disabled={isFormDisabled}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700"
                      />
                    </div>
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="default"
                  onClick={() => navigate("/users")}
                  disabled={isFormDisabled}
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={isFormDisabled}
                  className="bg-black text-white"
                >
                  {isFormDisabled ? "Oluşturuluyor..." : "Kullanıcı Oluştur"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 w-full">
          <CardHeader className="border-b border-gray-200 dark:border-gray-600">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Form Kuralları</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Zorunlu Alanlar:</h4>
                <ul className="space-y-1">
                  <li className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                    <span>Kullanıcı adı (min 3 karakter)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                    <span>Ad ve soyad (min 2 karakter)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                    <span>Geçerli email formatı</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                    <span>Şifre (min 6 karakter)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Varsayılan Ayarlar:</h4>
                <ul className="space-y-1">
                  <li className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                    <span>Kullanıcı aktif durumda oluşturulur</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                    <span>Otomatik ID atanır</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                    <span>Oluşturulma tarihi kaydedilir</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}