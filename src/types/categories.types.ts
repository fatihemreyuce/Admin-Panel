import type { PaginationResponse } from "./pagination.types";

export interface TranslationRequest {
	languageCode: string;
	name: string;
	description: string;
}

export interface CategoryRequest {
	slug: string;
	parentId: number | null;
	translations: TranslationRequest[];
}

export interface CategoryResponse {
	id: number;
	name?: string;
	slug: string;
	description?: string;
	isActive: boolean;
	parentId: number | null;
	translations: {
		languageCode: string;
		name: string;
		description: string;
	}[];
	subcategories: CategoryResponse[];
}

export interface CategoryListResponse {
	content: CategoryResponse[];
	page: PaginationResponse;
}
