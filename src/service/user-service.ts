import { fetchClient } from "@/utils/fetch-client";
import type { UpdateUserRequest, CreateUserRequest, UserListResponse } from "@/types/user.types";
import type { User } from "@/types/auth.types";

export const getMe = async (): Promise<User>=>{
    return await fetchClient<void,User>("/users/me",{
        method: "GET",
    })
}

export const getUsersList = async (
    search:string,
    page:number,
    size:number,
    sort:string,
)=>{
    return await fetchClient<void,UserListResponse>(
        `/admin/users?search=${search}&page=${page}&size=${size}&sort=${sort}`,
		{
			method: "GET",
		}
    )
}
export const getUserById = async (id:number)=>{
    return await fetchClient<void,User>(`/admin/users/${id}`,{
        method: "GET",
    })
}
export const deleteUserById = async (id: number) => {
	return await fetchClient<void, void>(`/admin/users/${id}`, {
		method: "DELETE",
	});
};
export const updateUser = async (
	userId: number,
	userData: UpdateUserRequest
) => {
	return await fetchClient<UpdateUserRequest, User>(`/admin/users/${userId}`, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
		method: "PUT",
		body: userData,
	});
};
export const createUser = async(
    userData:CreateUserRequest
): Promise<User>=>{
    return await fetchClient<CreateUserRequest,User>(`/admin/users`,{
        headers: {
            "Content-Type": "multipart/form-data",
        },
        method: "POST",
        body: userData,
    })
}