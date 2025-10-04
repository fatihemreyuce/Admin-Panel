import type { User } from "./auth.types";

export interface Page{
    size:number;
    number:number;
    totalElements:number;
    totalPages:number;
}

export interface UpdateUserRequest{
    username:string;
    email:string;
    active:boolean;
    isActive:boolean;
    password?:string;
    firstName:string;
    lastName:string;
    role?:string;
    bio?:string;
    profileImage?:File;
}
export interface CreateUserRequest{
    username:string;
    email:string;
    password:string;
    firstName:string;
    lastName:string;
    isActive:boolean;
    role?:string;
    bio?:string;
    profileImage?:File;
}
export interface UserListResponse{
    content:User[];
    page:Page;
}