import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, Search, PlusSquare, Briefcase, User } from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();
  
  const navItems = [
    { icon: <Home size={24} />, label: "Home", path: "/home" },
    { icon: <Search size={24} />, label: "Explore", path: "/explore" },
    { icon: <PlusSquare size={24} />, label: "Create", path: "/create" },
    { icon: <Briefcase size={24} />, label: "Jobs", path: "/jobs" },
    { icon: <User size={24} />, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-40 w-full h-16 bg-white border-t border-gray-200 md:hidden">
      <div className="grid h-full grid-cols-5">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <button
              type="button"
              className={cn(
                "inline-flex flex-col items-center justify-center px-5 h-full",
                location === item.path 
                  ? "text-primary" 
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}