import { useAuth } from "@/hooks/use-auth";
import EmailForm from "@/components/auth/email-form";
import { LoginUser } from "@shared/schema";
import { useLocation } from "wouter";

export default function LoginForm() {
  const { loginMutation } = useAuth();
  const [, setLocation] = useLocation();
  
  const handleSubmit = (data: LoginUser) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        setLocation("/home");
      }
    });
  };
  
  return (
    <div>
      <EmailForm 
        onSubmit={handleSubmit} 
        isLoading={loginMutation.isPending} 
        type="login"
      />
      
      {loginMutation.isError && (
        <p className="text-red-500 text-sm mt-2">
          {loginMutation.error?.message || "Invalid username or password"}
        </p>
      )}
    </div>
  );
}
