import { useEffect,useState } from "react";
import {useNavigate} from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginState } from "@/hooks/use-login-state";
import type { LoginRequest } from "@/types/auth.types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function LoginPage() {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");
    const [isSubmitting,setIsSubmitting] = useState(false);
    const {login,isLoading,isLoggedIn} = useLoginState();
    const navigate = useNavigate();

    useEffect(()=>{
        if(isLoggedIn){
            navigate("/");
        }
    },[isLoggedIn,navigate]);
    const handleSubmit = async (e:React.FormEvent)=>{
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try{
            const loginRequest:LoginRequest = {
                email,
                password,
            }
            await login(loginRequest);
            navigate("/");
        }catch(err:any){
            toast.error("Invalid email or password. Please try again.")
        }finally{
            setIsSubmitting(false);
        }
    }
    const isFormDisabled = isLoading||isSubmitting

    return(
        <div className="h-screen w-screen bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center p-4">
            <Card className="w-full max-w-md border border-border/30">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">Sign in to your account to continue</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                id="email"
                                value={email}
                                type="email"
                                placeholder="you@example.com"
                                onChange={(e)=>setEmail(e.target.value)}
                                required
                                disabled={isFormDisabled}
                                autoComplete="email"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="********"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                                required
                                disabled={isFormDisabled}
                            />
                        </div>
                        {error && (
                            <p className="text-sm text-destructive mt-1">{error}</p>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 mt-3">
                        <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600" disabled={isFormDisabled} aria-busy={isFormDisabled}>
							{isFormDisabled ? "Signing in..." : "Sign in"}
						</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}