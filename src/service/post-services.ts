import type { PostRequest, PostResponse, PostListResponse } from "@/types/post.types";
import { fetchClient } from "@/utils/fetch-client";

export const getPosts = async (search: string, page: number, size: number, sort: string) => {
    return await fetchClient<void, PostListResponse>(`/posts?search=${search}&page=${page}&size=${size}&sort=${sort}`);
}

export const getPostById = async (id: number) => {
    return await fetchClient<void, PostResponse>(`/posts/${id}`);
}

export const createPost = async (request: PostRequest) => {
    return await fetchClient<PostRequest, PostResponse>(`/posts`, {
        method: "POST",
        body: request,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const updatePost = async (id: number, request: PostRequest) => {
    return await fetchClient<PostRequest, PostResponse>(`/posts/${id}`, {
        method: "PUT",
        body: request,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const deletePost = async (id: number) => {
    return await fetchClient<void, void>(`/posts/${id}`, {
        method: "DELETE",
    });
}