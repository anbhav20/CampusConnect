import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, Search, PlusSquare, Briefcase, User } from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();
  
  const navItems = [
    { icon: <Home size={24} />, label: "Home", path: "/home" },
    { icon: <Search size={24} />, label: "Search", path: "/explore" },
    { icon: <PlusSquare size={24} />, label: "Create", path: "/create" },
    { icon: <Briefcase size={24} />, label: "Jobs", path: "/jobs" },
    { icon: <User size={24} />, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 md:hidden shadow-lg">
      <div className="grid h-full grid-cols-5 max-w-screen-xl mx-auto">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <button
              type="button"
              className={cn(
                "inline-flex flex-col items-center justify-center w-full h-full transition-colors",
                location === item.path 
                  ? "text-primary" 
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              {item.icon}
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          </Link>
        ))}
      </div>
      {/* Add safe area padding for iOS devices */}
      <div className="h-safe-area w-full bg-white" style={{ height: 'env(safe-area-inset-bottom, 0px)' }}></div>
    </nav>
  );
}