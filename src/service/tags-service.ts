import type { TagRequest, TagResponse, TagListResponse } from "@/types/tags.types";
import { fetchClient } from "@/utils/fetch-client";

export const getTags = (search: string, page: number, size: number, sort: string) => {
    return fetchClient<void, TagListResponse>(`/admin/tags/translated?search=${search}&page=${page}&size=${size}&sort=${sort}`);
};


export const getTagById = (id: number) => {
    return fetchClient<void, TagResponse>(`/admin/tags/${id}/translated`);
};


export const createTag = (request: TagRequest) => {
    return fetchClient<TagRequest, TagResponse>("/admin/tags", {
        method: "POST",
        body: request,
    });
};


export const updateTag = (id: number, request: TagRequest) => {
    return fetchClient<TagRequest, TagResponse>(`/admin/tags/${id}`, {
        method: "PUT",
        body: request,
    });
};


export const deleteTag = (id: number) => {
    return fetchClient<void, TagResponse>(`/admin/tags/${id}/translated`, {
        method: "DELETE",
    });
};