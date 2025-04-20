import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { InsertUser } from "@shared/schema";
import { useLocation } from "wouter";

export default function RegisterForm() {
  const { registerWithEmail, loginWithGoogle, loginWithGithub, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerWithEmail(formData.email, formData.password, formData.username);
      // Immediately redirect to home page
      setLocation("/home");
    } catch (err) {
      setError((err as Error).message || "Could not create account. Try a different username.");
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await loginWithGoogle();
      // Immediately redirect to home page
      setLocation("/home");
    } catch (err) {
      setError((err as Error).message || "Google signup failed");
    }
  };

  const handleGithubSignup = async () => {
    try {
      await loginWithGithub();
      // Immediately redirect to home page
      setLocation("/home");
    } catch (err) {
      setError((err as Error).message || "GitHub signup failed");
    }
  };
  
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a unique username"
            required
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-1">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              className="pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Sign up"}
        </Button>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or sign up with
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleGoogleSignup}
          disabled={isLoading}
        >
          Google
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleGithubSignup}
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
