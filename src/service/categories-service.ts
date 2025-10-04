import { fetchClient } from "@/utils/fetch-client";
import type {
	CategoryRequest,
	CategoryResponse,
	CategoryListResponse,
} from "@/types/categories.types";

export const getCategories = (
	search: string,
	page: number,
	size: number,
	sort: string
) => {
	return fetchClient<void, CategoryListResponse>(
		`/admin/categories/translated?search=${search}&page=${page}&size=${size}&sort=${sort}`
	);
};

export const getCategoryById = (id: number) => {
	return fetchClient<void, CategoryResponse>(
		`/admin/categories/${id}/translated`
	);
};

export const createCategory = (request: CategoryRequest) => {
	return fetchClient<CategoryRequest, CategoryResponse>("/admin/categories", {
		method: "POST",
		body: request,
	});
};

export const updateCategory = (id: number, request: CategoryRequest) => {
	return fetchClient<CategoryRequest, CategoryResponse>(
		`/admin/categories/${id}`,
		{
			method: "PUT",
			body: request,
		}
	);
};

export const deleteCategory = (id: number) => {
	return fetchClient<void, void>(`/admin/categories/${id}`, {
		method: "DELETE",
	});
};
