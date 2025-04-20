import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  Home, 
  Search, 
  Compass, 
  Film, 
  MessageCircle, 
  Heart, 
  PlusSquare, 
  User, 
  Menu 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Sidebar() {
  const { user, logout, isLoading } = useAuth();
  const [location] = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    { icon: <Home size={24} />, label: "Home", path: "/home" },
    { icon: <Search size={24} />, label: "Search", path: "/search" },
    { icon: <Compass size={24} />, label: "Explore", path: "/explore" },
    { icon: <MessageCircle size={24} />, label: "Messages", path: "/messages" },
    { icon: <Heart size={24} />, label: "Notifications", path: "/notifications" },
    { icon: <PlusSquare size={24} />, label: "Create", path: "/create" },
    { icon: <User size={24} />, label: "Profile", path: "/profile" },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white">
      <div className="flex h-full flex-col justify-between py-5">
        <div>
          <div className="px-5 mb-8">
            <Link href="/">
              <h1 className="text-xl italic font-semibold cursor-pointer">Campus Connect</h1>
            </Link>
          </div>
          
          <nav className="space-y-1 px-3">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-base font-normal",
                    location === item.path ? "bg-gray-100" : ""
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="px-3">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-base font-normal"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <span className="mr-3"><Menu size={24} /></span>
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </aside>
  );
}