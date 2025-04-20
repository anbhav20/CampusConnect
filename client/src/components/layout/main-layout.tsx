import { ReactNode } from 'react';
import Sidebar from './sidebar';
import MobileNav from './mobile-nav';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'wouter';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function MainLayout({ children, title }: MainLayoutProps) {
  const { user } = useAuth();
  
  // Get first letter of username for avatar fallback
  const userInitial = user?.username?.[0]?.toUpperCase() || 'U';
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile */}
      <Sidebar />
      
      {/* Main content */}
      <main className="flex-1 md:ml-64 pt-16 pb-20 md:pb-10">
        {/* Header */}
        <header className="fixed top-0 right-0 left-0 md:left-64 z-30 bg-white border-b border-gray-200 h-16 flex items-center px-4">
          <div className="w-full max-w-screen-xl mx-auto flex items-center justify-between">
            {/* Left: Title or Logo for mobile */}
            <div className="md:hidden">
              <h1 className="text-xl italic font-semibold">Campus Connect</h1>
            </div>
            
            {/* Middle: Search (hidden on very small screens) */}
            <div className="hidden sm:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search..." 
                  className="pl-10 w-full bg-gray-100 border-0 focus-visible:ring-gray-300"
                />
              </div>
            </div>
            
            {/* Right: Notifications & User Menu */}
            <div className="flex items-center space-x-4">
              <Link href="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell size={24} />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </Button>
              </Link>
              
              <Link href="/profile">
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src={user?.profile_picture || ""} alt={user?.username || ""} />
                  <AvatarFallback>{userInitial}</AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <div className="p-4 max-w-screen-xl mx-auto">
          {title && <h1 className="text-2xl font-bold mb-6">{title}</h1>}
          {children}
        </div>
      </main>
      
      {/* Mobile navigation */}
      <MobileNav />
    </div>
  );
}