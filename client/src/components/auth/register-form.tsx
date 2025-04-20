import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { InsertUser } from "@shared/schema";
import { useLocation } from "wouter";

export default function RegisterForm() {
  const { registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userData: InsertUser = {
      ...formData,
      auth_type: "email",
    };
    
    registerMutation.mutate(userData, {
      onSuccess: () => {
        setLocation("/home");
      }
    });
  };
  
  return (
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
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? "Creating Account..." : "Sign up"}
      </Button>
      
      {registerMutation.isError && (
        <p className="text-red-500 text-sm mt-2">
          {registerMutation.error?.message || "Could not create account. Try a different username."}
        </p>
      )}
    </form>
  );
}
