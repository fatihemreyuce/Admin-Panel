import type { PaginationResponse } from "./pagination.types";

export interface TranslationRequest {
    languageCode: string;
    name: string;
}

export interface TagRequest {
    slug: string;
    color: string;
    translations:TranslationRequest[];
}

export interface TagResponse {
    id: number;
    name: string;
    slug: string;
    color: string;
    translations: {
        languageCode: string;
        name: string;
    }[];
}

export interface TagListResponse {
    content: TagResponse[];
    page: PaginationResponse;
}