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
  Menu,
  LogOut,
  Moon,
  Sun,
  Settings,
  Lock,
  Bell,
  UserX,
  Briefcase,
  MapPin,
  Users,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Sidebar() {
  const { user, logout, isLoading } = useAuth();
  const [location] = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // In a real implementation, we would add/remove a class to the document element
    // or use a theme provider to toggle between light and dark mode
    document.documentElement.classList.toggle('dark');
  };

  const handleDeleteAccount = async () => {
    // Here you would implement the account deletion logic
    try {
      // Call API to delete account
      console.log("Account deletion initiated");
      await logout();
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const mainNavItems = [
    { icon: <Home size={24} />, label: "Home", path: "/home" },
    { icon: <Search size={24} />, label: "Search", path: "/explore" },
    { icon: <Compass size={24} />, label: "Explore", path: "/explore" },
    { icon: <Users size={24} />, label: "College Groups", path: "/groups" },
    { icon: <Briefcase size={24} />, label: "Jobs", path: "/jobs" },
    { icon: <MapPin size={24} />, label: "Nearby", path: "/nearby" },
    { icon: <MessageCircle size={24} />, label: "Messages", path: "/messages" },
    { icon: <Heart size={24} />, label: "Notifications", path: "/notifications" },
    { icon: <PlusSquare size={24} />, label: "Create", path: "/create" },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white hidden md:block">
      <div className="flex h-full flex-col justify-between py-5">
        <div>
          <div className="px-5 mb-8">
            <Link href="/">
              <h1 className="text-xl italic font-semibold cursor-pointer">Campus Connect</h1>
            </Link>
          </div>
          
          <nav className="space-y-1 px-3">
            {mainNavItems.map((item) => (
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
            
            <Link href="/profile">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-base font-normal",
                  location === "/profile" ? "bg-gray-100" : ""
                )}
              >
                <span className="mr-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user?.profile_picture || ""} alt={user?.username || ""} />
                    <AvatarFallback>{user?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </span>
                Profile
              </Button>
            </Link>
          </nav>
        </div>
        
        <div className="px-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-base font-normal"
              >
                <span className="mr-3"><MoreHorizontal size={24} /></span>
                More
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={toggleTheme}>
                {isDarkMode ? (
                  <>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark Mode</span>
                  </>
                )}
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              
              <Link href="/settings/privacy">
                <DropdownMenuItem>
                  <Lock className="mr-2 h-4 w-4" />
                  <span>Account Privacy</span>
                </DropdownMenuItem>
              </Link>
              
              <Link href="/settings/blocked">
                <DropdownMenuItem>
                  <UserX className="mr-2 h-4 w-4" />
                  <span>Blocked Accounts</span>
                </DropdownMenuItem>
              </Link>
              
              <Link href="/settings/notifications">
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                </DropdownMenuItem>
              </Link>
              
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                    <UserX className="mr-2 h-4 w-4" />
                    <span>Delete Account</span>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Account</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                      Delete Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  );
}