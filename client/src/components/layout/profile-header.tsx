import { ReactNode, useState } from 'react';
import { 
  MoreVertical, 
  ArrowLeft, 
  Settings, 
  LogOut, 
  Moon, 
  Sun, 
  Lock, 
  Bell, 
  UserX,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ProfileHeaderProps {
  title: string;
  onBack?: () => void;
  isProfilePage?: boolean;
}

export default function ProfileHeader({ title, onBack, isProfilePage = false }: ProfileHeaderProps) {
  const [location, navigate] = useLocation();
  const { user, logout, isLoading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Default behavior: go back in history
      window.history.back();
    }
  };
  
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
  
  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 z-40 bg-white border-b border-gray-200 h-16 flex items-center px-4 shadow-sm">
      <div className="w-full max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Left: Back button and title */}
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBack}
            className="mr-2"
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        
        {/* Right: Menu or Settings (visible only on mobile) */}
        <div className="md:hidden">
          {isProfilePage ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical size={24} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
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
                
                <Link href="/settings/profile">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Edit Profile</span>
                  </DropdownMenuItem>
                </Link>
                
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
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical size={24} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/settings/account">
                    <span className="w-full">Account Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings/privacy">
                    <span className="w-full">Privacy</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings/notifications">
                    <span className="w-full">Notification Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/help">
                    <span className="w-full">Help Center</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}