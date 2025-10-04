import { useAuthQuery } from "./use-auth-query";
import { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog } from "@/service/blog-service";
import { toast } from "sonner";
import type { BlogRequest } from "@/types/blog.types";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useBlogs = (search:string, page:number, size:number, sort:string) => {
    return useAuthQuery({
        queryKey: ["blogs", search, page, size, sort],
        queryFn: () => getBlogs(search, page, size, sort),
    });
}

export const useBlogById = (id:number) => {
    return useAuthQuery({
        queryKey: ["blog", id],
        queryFn: () => getBlogById(id),
    });
}

export const useCreateBlog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (blogData: BlogRequest) => createBlog(blogData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            toast.success("Blog başarıyla oluşturuldu");
        },
    });
}


export const useUpdateBlog = (id:number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (blogData: BlogRequest) => updateBlog(id, blogData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            toast.success("Blog başarıyla güncellendi");
        },
    });
}


export const useDeleteBlog = (id:number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id:number) => deleteBlog(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            toast.success("Blog başarıyla silindi");
        },
    });
}