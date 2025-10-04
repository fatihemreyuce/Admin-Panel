import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuthQuery } from "./use-auth-query";
import {
	getTags,
	getTagById,
	createTag,
	updateTag,
	deleteTag,
} from "@/service/tags-service";
import { toast } from "sonner";
import type { TagRequest } from "@/types/tags.types";

export const useTags = (search: string, page: number, size: number, sort: string) => {
    return useAuthQuery({
        queryKey: ["tags", search, page, size, sort],
        queryFn: () => getTags(search, page, size, sort),
    });
};

export const useTagById = (id: number) => {
    return useAuthQuery({
        queryKey: ["tag", id],
        queryFn: () => getTagById(id),
    });
};

export const useCreateTag = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (tagData: TagRequest) => createTag(tagData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tags"] });
            toast.success("Tag başarıyla oluşturuldu");
        },
        onError: () => {
            toast.error("Tag oluşturulurken bir hata oluştu, tekrar deneyiniz");
        },
    });
};

export const useUpdateTag = (id: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (tagData: TagRequest) => updateTag(id, tagData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tag", id] });
            queryClient.invalidateQueries({ queryKey: ["tags"] });
            toast.success("Tag başarıyla güncellendi");
        },
        onError: () => {
            toast.error("Tag güncellenirken bir hata oluştu, tekrar deneyiniz");
        },
    });
};

export const useDeleteTag = (id: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => deleteTag(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tags"] });
            toast.success("Tag başarıyla silindi");
        },
        onError: () => {
            toast.error("Tag silinirken bir hata oluştu, tekrar deneyiniz");
        },
    });
};
