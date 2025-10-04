export interface LoginRequest {
    email: string;
    password: string;
}
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}
export interface User{
    id:number;
    email:string;
    username:string;
    active:boolean;
    isActive:boolean;
    firstName:string;
    lastName:string;
    createdAt:string;
    updatedAt:string;
    bio?:string;
    role:string;
    profileImage?:string;
}