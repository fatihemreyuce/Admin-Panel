import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { useCreatePost } from "@/hooks/use-post";
import { useCategories } from "@/hooks/use-categories";
import { useTags } from "@/hooks/use-tags";
import { ArrowLeft, Plus, X } from "lucide-react";
import type { PostRequest } from "@/types/post.types";

interface TranslationForm {
    languageCode: string;
    title: string;
    expert: string;
    content: string;
}

export default function PostCreatePage() {
    const navigate = useNavigate();
    const createPostMutation = useCreatePost();
    const { data: categoriesData } = useCategories("", 0, 100, "name,asc");
    const { data: tagsData } = useTags("", 0, 100, "name,asc");

    const [translations, setTranslations] = useState<TranslationForm[]>([
        { languageCode: "tr", title: "", expert: "", content: "" }
    ]);
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            slug: "",
            categoryId: 0,
            status: "DRAFT" as "DRAFT" | "PUBLISHED"
        }
    });

    const addTranslation = () => {
        setTranslations([...translations, { languageCode: "tr", title: "", expert: "", content: "" }]);
    };

    const removeTranslation = (index: number) => {
        setTranslations(translations.filter((_, i) => i !== index));
    };

    const updateTranslation = (index: number, field: keyof TranslationForm, value: string) => {
        const updated = [...translations];
        updated[index][field] = value;
        setTranslations(updated);
    };

    const toggleTag = (tagId: number) => {
        setSelectedTags(prev => 
            prev.includes(tagId) 
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const onSubmit = async (data: any) => {
        if (translations.length === 0) {
            alert("En az bir çeviri eklemelisiniz.");
            return;
        }

        if (!selectedImage) {
            alert("Lütfen bir görsel seçin.");
            return;
        }

        const selectedTagObjects = tagsData?.content.filter(tag => selectedTags.includes(tag.id)) || [];

        const postRequest: PostRequest = {
            slug: data.slug,
            categoryId: data.categoryId,
            tags: selectedTagObjects,
            status: data.status,
            translations: translations,
            image: selectedImage
        };

        try {
            await createPostMutation.mutateAsync(postRequest);
            navigate("/posts");
        } catch (error) {
            console.error("Post oluşturma hatası:", error);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => navigate("/posts")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Geri
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Yeni Post Oluştur</h1>
                    <p className="text-gray-600">Yeni bir blog yazısı oluşturun</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Temel Bilgiler</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    {...register("slug", { required: "Slug gerekli" })}
                                    placeholder="ornek-post-slug"
                                />
                                {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="categoryId">Kategori</Label>
                                <Select onValueChange={(value) => setValue("categoryId", Number(value))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Kategori seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categoriesData?.content.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="status">Durum</Label>
                                <Select onValueChange={(value) => setValue("status", value as "DRAFT" | "PUBLISHED")}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Durum seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DRAFT">Taslak</SelectItem>
                                        <SelectItem value="PUBLISHED">Yayınla</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Görsel</Label>
                                <div className="flex items-center gap-4">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="flex-1"
                                    />
                                    {selectedImage && (
                                        <span className="text-sm text-green-600">
                                            {selectedImage.name}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Etiketler</CardTitle>
                            <Button type="button" onClick={() => setIsTagModalOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Etiket Ekle
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {selectedTags.map(tagId => {
                                const tag = tagsData?.content.find(t => t.id === tagId);
                                return tag ? (
                                    <Badge key={tagId} variant="secondary" className="flex items-center gap-1">
                                        {tag.name}
                                        <X 
                                            className="w-3 h-3 cursor-pointer" 
                                            onClick={() => toggleTag(tagId)}
                                        />
                                    </Badge>
                                ) : null;
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Translations */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Çeviriler</CardTitle>
                            <Button type="button" onClick={addTranslation}>
                                <Plus className="w-4 h-4 mr-2" />
                                Çeviri Ekle
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {translations.map((translation, index) => (
                            <div key={index} className="border rounded-lg p-4 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-medium">Çeviri {index + 1}</h3>
                                    {translations.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeTranslation(index)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Dil Kodu</Label>
                                        <Input
                                            value={translation.languageCode}
                                            onChange={(e) => updateTranslation(index, "languageCode", e.target.value)}
                                            placeholder="tr"
                                        />
                                    </div>
                                    <div>
                                        <Label>Başlık</Label>
                                        <Input
                                            value={translation.title}
                                            onChange={(e) => updateTranslation(index, "title", e.target.value)}
                                            placeholder="Post başlığı"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label>Özet</Label>
                                    <Input
                                        value={translation.expert}
                                        onChange={(e) => updateTranslation(index, "expert", e.target.value)}
                                        placeholder="Post özeti"
                                    />
                                </div>

                                <div>
                                    <Label>İçerik</Label>
                                    <textarea
                                        className="w-full min-h-32 p-3 border rounded-md"
                                        value={translation.content}
                                        onChange={(e) => updateTranslation(index, "content", e.target.value)}
                                        placeholder="Post içeriği..."
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-4 justify-end">
                    <Button type="button" variant="outline" onClick={() => navigate("/posts")}>
                        İptal
                    </Button>
                    <Button type="submit" disabled={createPostMutation.isPending}>
                        {createPostMutation.isPending ? "Oluşturuluyor..." : "Post Oluştur"}
                    </Button>
                </div>
            </form>

            {/* Tag Selection Modal */}
            <Modal
                isOpen={isTagModalOpen}
                onClose={() => setIsTagModalOpen(false)}
                title="Etiket Seç"
            >
                <div className="space-y-4">
                    <div className="max-h-60 overflow-y-auto space-y-2">
                        {tagsData?.content.map((tag) => (
                            <div
                                key={tag.id}
                                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                    selectedTags.includes(tag.id) 
                                        ? "bg-blue-50 border-blue-200" 
                                        : "hover:bg-gray-50"
                                }`}
                                onClick={() => toggleTag(tag.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">{tag.name}</span>
                                    {selectedTags.includes(tag.id) && (
                                        <Badge variant="default">Seçili</Badge>
                                    )}
                                </div>
                                {tag.name && (
                                    <p className="text-sm text-gray-500 mt-1">{tag.name}</p>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsTagModalOpen(false)}>
                            Kapat
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
