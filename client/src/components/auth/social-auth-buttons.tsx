import { Button } from "@/components/ui/button";
import { FaGoogle, FaGithub } from "react-icons/fa";

export default function SocialAuthButtons() {
  // These would need to be implemented with actual OAuth providers
  const handleGoogleAuth = () => {
    // Placeholder for Google OAuth
    alert("Google authentication would be implemented here.");
  };
  
  const handleGithubAuth = () => {
    // Placeholder for GitHub OAuth
    alert("GitHub authentication would be implemented here.");
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
