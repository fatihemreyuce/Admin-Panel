import { useContext } from "react";
import { LoginContext } from "@/context/login-context";

export const useLoginState = () => {
    const context = useContext(LoginContext);
    if(context === undefined){
        throw new Error("useLoginState must be used within a LoginProvider");
    }
    return context;
}