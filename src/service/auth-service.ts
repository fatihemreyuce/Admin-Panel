import { fetchClient } from "@/utils/fetch-client";
import type  { LoginRequest, LoginResponse } from "@/types/auth.types";

export const login = async (request:LoginRequest)=>{
    return await fetchClient<LoginRequest, LoginResponse>("/auth/login", {
        method: "POST",
        body: request,
    });
}
export const logout = async ()=>{
    return await fetchClient<void, void>("/auth/logout", {
        method: "POST",
    });
}