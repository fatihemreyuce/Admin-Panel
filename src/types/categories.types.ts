import type { PaginationResponse } from "./pagination.types";

export interface TranslationRequest {
	languageCode: string;
	name: string;
	description: string;
}

export interface Translation {
	languageCode: string;
	name: string;
	description: string;
}

export interface CategoryRequest {
	slug: string;
	parentId: number;
	translations: TranslationRequest[];
}

export interface CategoryResponse {
	id: number;
	name?: string;
	slug: string;
	description?: string;
	isActive: boolean;
	parentId: number | null;
	language?: string;
	translations: Translation[];
	subcategories: CategoryResponse[];
}

export interface CategoryListResponse {
	content: CategoryResponse[];
	page: PaginationResponse;
}
