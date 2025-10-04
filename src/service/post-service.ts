import type { PostRequest, PostResponse, PostListResponse } from "@/types/post.types";
import { fetchClient } from "@/utils/fetch-client";

export const getPosts = (search: string, page: number, size: number, sort: string) => {
    return fetchClient<void, PostListResponse>(`/api/v1/posts?search=${search}&page=${page}&size=${size}&sort=${sort}`);
}

export const getPostById = (id: number) => {
    return fetchClient<void, PostResponse>(`/api/v1/posts/${id}`);
}

export const createPost = (request: PostRequest) => {
    return fetchClient<PostRequest, PostResponse>(`/api/v1/posts`, {
        method: "POST",
        body: request,
    });
}

export const updatePost = (id: number, request: PostRequest) => {
    return fetchClient<PostRequest, PostResponse>(`/api/v1/posts/${id}`, {
        method: "PUT",
        body: request,
    });
}

export const deletePost = (id: number) => {
    return fetchClient<void, void>(`/api/v1/posts/${id}`, {
        method: "DELETE",
    });
}

