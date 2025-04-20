import { Button } from "@/components/ui/button";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

export default function SocialAuthButtons() {
  const { loginWithGoogle, loginWithGithub } = useAuth();
  const [, setLocation] = useLocation();
  
  const handleGoogleAuth = async () => {
    try {
      await loginWithGoogle();
      // Immediately redirect to home page
      setLocation("/home");
    } catch (error) {
      console.error("Google auth error:", error);
    }
  };
  
  const handleGithubAuth = async () => {
    try {
      await loginWithGithub();
      // Immediately redirect to home page
      setLocation("/home");
    } catch (error) {
      console.error("GitHub auth error:", error);
    }
  };
  
  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2"
        onClick={handleGoogleAuth}
      >
        <FaGoogle className="h-5 w-5 text-red-500" />
        <span>Continue with Google</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2"
        onClick={handleGithubAuth}
      >
        <FaGithub className="h-5 w-5" />
        <span>Continue with GitHub</span>
      </Button>
    </div>
  );
}
