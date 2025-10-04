import type { PaginationResponse } from "./pagination.types";
import type { TagResponse } from "./tags.types";
import type { CategoryResponse } from "./categories.types";

export interface TranslationRequest {
    languageCode: string;
    title: string;
    expert: string;
    content: string;
}


export interface PostRequest {
    slug: string;
    categoryId: number;
    tags: TagResponse[];
    status: "DRAFT" | "PUBLISHED";
    translations: TranslationRequest[];
    image: File;
}

export interface PostResponse {
    id: number;
    title: string;
    slug: string;
    content: string;
    expert: string;
    featuredImage: string;
    publishedAt: string;
    language: string;
    category: CategoryResponse;
    authorUsername: string;
    tags: TagResponse[];
}


export interface PostListResponse {
    content: PostResponse[];
    page: PaginationResponse;
}
