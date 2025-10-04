import type { PaginationResponse } from "./pagination.types";
import type { TagResponse } from "./tags.types";
import type { CategoryResponse } from "./categories.types";

export interface TranslationRequest {
    languageCode: string;
    title: string;
    expert: string;
    content: string;
}

export interface BlogRequest {
    slug: string;
    categoryId: number;
    tags: TagResponse[];
    status: "DRAFT"|"PUBLISHED";
    translations: TranslationRequest[];
    image: File;
}
export interface BlogResponse {
    id: number;
    title: string;
    slug: string;
    content: string;
    expert: string;
    featuredImage: string;
    publishedAt: string;
    status: "DRAFT" | "PUBLISHED";
    translations: {
        languageCode: string;
        title: string;
        expert: string;
        content: string;
    }[];
    category: CategoryResponse;
    authorUsername: string;
    tags: TagResponse[];
}

export interface BlogListResponse {
    content: BlogResponse[];
    page: PaginationResponse;
}