import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuthQuery } from "./use-auth-query";
import {
	getCategories,
	getCategoryById,
	createCategory,
	updateCategory,
	deleteCategory,
} from "@/service/categories-service";
import { toast } from "sonner";
import type { CategoryRequest } from "@/types/categories.types";

export const useCategories = (
	search: string,
	page: number,
	size: number,
	sort: string
) => {
	return useAuthQuery({
		queryKey: ["categories", search, page, size, sort],
		queryFn: () => getCategories(search, page, size, sort),
	});
};

export const useCategoryById = (id: number) => {
	return useAuthQuery({
		queryKey: ["category", id],
		queryFn: () => getCategoryById(id),
	});
};

export const useCreateCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (categoryData: CategoryRequest) => createCategory(categoryData),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["categories"],
			});
			toast.success("Kategori başarıyla oluşturuldu");
		},
		onError: () => {
			toast.error("Kategori oluşturulurken bir hata oluştu, tekrar deneyiniz");
		},
	});
};

export const useUpdateCategory = (id: number) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (categoryData: CategoryRequest) =>
			updateCategory(id, categoryData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["category", id] });
			queryClient.invalidateQueries({ queryKey: ["categories"] });
			toast.success("Kategori başarıyla güncellendi");
		},
		onError: () => {
			toast.error("Kategori güncellenirken bir hata oluştu, tekrar deneyiniz");
		},
	});
};

export const useDeleteCategory = (id: number) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => deleteCategory(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
			toast.success("Kategori başarıyla silindi");
		},
		onError: () => {
			toast.error("Kategori silinirken bir hata oluştu, tekrar deneyiniz");
		},
	});
};
