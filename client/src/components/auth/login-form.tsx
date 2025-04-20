import { useAuth } from "@/hooks/use-auth";
import EmailForm from "@/components/auth/email-form";
import { LoginUser } from "@shared/schema";
import { useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const { loginWithUsername, loginWithGoogle, loginWithGithub, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (data: LoginUser) => {
    try {
      await loginWithUsername(data.username, data.password);
      // Redirection is now handled in the auth hook
    } catch (err) {
      setError((err as Error).message || "Invalid username or password");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // Redirection is now handled in the auth hook
    } catch (err) {
      setError((err as Error).message || "Google login failed");
    }
  };

  const handleGithubLogin = async () => {
    try {
      await loginWithGithub();
      // Redirection is now handled in the auth hook
    } catch (err) {
      setError((err as Error).message || "GitHub login failed");
    }
  };
  
  return (
    <div className="space-y-6">
      <EmailForm 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
        type="login"
      />
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          Google
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleGithubLogin}
          disabled={isLoading}
        >
          GitHub
        </Button>
      </div>
      
      {error && (
        <p className="text-red-500 text-sm mt-2">
          {error}
        </p>
      )}
    </div>
  );
}
