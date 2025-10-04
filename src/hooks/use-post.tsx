import { useAuthQuery } from "./use-auth-query";
import { getPosts, getPostById, createPost, updatePost, deletePost } from "@/service/post-service";
import { toast } from "sonner";
import type { PostRequest } from "@/types/post.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePosts = (search: string, page: number, size: number, sort: string) => {
    return useAuthQuery({
        queryKey: ["posts", search, page, size, sort],
        queryFn: () => getPosts(search, page, size, sort),
    });
}

export const usePostById = (id: number) => {
    return useAuthQuery({
        queryKey: ["post", id],
        queryFn: () => getPostById(id),
    });
}

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: PostRequest) => createPost(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            toast.success("Post başarıyla oluşturuldu");
        },
    });
}

export const useUpdatePost = (id: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: PostRequest) => updatePost(id, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["post", id] });
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            toast.success("Post başarıyla güncellendi");
        },
    });
}

export const useDeletePost = (id: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => deletePost(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["post", id] });
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            toast.success("Post başarıyla silindi");
        },
        onError: () => {
            toast.error("Post silinirken bir hata oluştu, tekrar deneyiniz");
        },
    });
}