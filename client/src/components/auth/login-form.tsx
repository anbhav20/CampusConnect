import { useAuth } from "@/hooks/use-auth";
import EmailForm from "@/components/auth/email-form";
import { LoginUser } from "@shared/schema";
import { useLocation } from "wouter";
import { useState } from "react";

export default function LoginForm() {
  const { loginWithEmail, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (data: LoginUser) => {
    try {
      await loginWithEmail(data.username, data.password);
      setLocation("/home");
    } catch (err) {
      setError((err as Error).message || "Invalid username or password");
    }
  };
  
  return (
    <div>
      <EmailForm 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
        type="login"
      />
      
      {error && (
        <p className="text-red-500 text-sm mt-2">
          {error}
        </p>
      )}
    </div>
  );
}
