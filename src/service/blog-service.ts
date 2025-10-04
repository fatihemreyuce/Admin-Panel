import { fetchClient } from "@/utils/fetch-client";
import type { BlogRequest, BlogCreateRequest, BlogResponse, BlogListResponse } from "@/types/blog.types";

export const getBlogs = (
    search:string,
    page:number,
    size:number,
    sort:string,
)=>{
    return fetchClient<void, BlogListResponse>(`/posts?search=${search}&page=${page}&size=${size}&sort=${sort}`);
}

export const getBlogById = (id:number) => {
    return fetchClient<void, BlogResponse>(`/posts/${id}`);
}

export const createBlog = (request: BlogCreateRequest) => {
    return fetchClient<BlogCreateRequest, BlogResponse>(`/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "multipart/form-data",
        },
        body: request,
    });
}

export const updateBlog = (id:number, request: BlogRequest) => {
    return fetchClient<BlogRequest, BlogResponse>(`/posts/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "multipart/form-data",
        },
        body: request,
    });
}

export const deleteBlog = (id:number) => {
    return fetchClient<void, BlogResponse>(`/posts/${id}`, {
        method: "DELETE",
    });
}