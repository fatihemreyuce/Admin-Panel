import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateUser } from "@/hooks/use-user";
import { ArrowLeft, UserPlus, Mail, User, Lock, Shield, FileText, Image } from "lucide-react";
import type { CreateUserRequest } from "@/types/user.types";
import { userCreateSchema, type UserCreateInput } from "@/validations";

export default function UserCreatePage() {
  const navigate = useNavigate();
  const createUserMutation = useCreateUser();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    watch,
    setValue,
  } = useForm<UserCreateInput>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      isActive: true,
      role: "USER",
      bio: "",
    },
  });

  const [submitError, setSubmitError] = useState<string>("");

  const onSubmit = async (data: UserCreateInput) => {
    setSubmitError("");
    
    try {
      await createUserMutation.mutateAsync(data);
      navigate("/users");
    } catch (error: any) {
      console.error("Create user error:", error);
      
      // API'den gelen hata mesajını kullanıcı dostu hale getir
      let errorMessage = "Kullanıcı oluşturulurken bir hata oluştu";
      
      if (error?.response?.data?.message) {
        const apiMessage = error.response.data.message;
        if (apiMessage.includes("already exists") || apiMessage.includes("duplicate")) {
          if (apiMessage.includes("email")) {
            setError("email", { message: "Bu email adresi zaten kullanılıyor" });
          } else if (apiMessage.includes("username")) {
            setError("username", { message: "Bu kullanıcı adı zaten kullanılıyor" });
          } else {
            setSubmitError(apiMessage);
          }
        } else {
          setSubmitError(apiMessage);
        }
      } else {
        setSubmitError(errorMessage);
      }
    }
  };

  const isFormDisabled = createUserMutation.isPending || isSubmitting;

  return (
    <div className="min-h-screen w-full">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 w-full">
        <div className="px-6 py-4">
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                        {...register("username")}
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
                        {...register("email")}
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
                        {...register("password")}
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
                      {...register("firstName")}
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
                      {...register("lastName")}
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
                      {...register("role")}
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
                        {...register("isActive")}
                        disabled={isFormDisabled}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2"
                      />
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${watch("isActive") ? 'bg-green-500' : 'bg-red-500'}`} />
                        <Label htmlFor="isActive" className="cursor-pointer">
                          {watch("isActive") ? 'Aktif' : 'Pasif'}
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
                    {...register("bio")}
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
                          if (file) setValue("profileImage", file);
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

              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{submitError}</p>
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
      </div>
    </div>
  );
}