import { ReactNode } from 'react';
import Sidebar from './sidebar';
import MobileNav from './mobile-nav';
import ProfileHeader from './profile-header';
import { useAuth } from '@/hooks/use-auth';

interface ProfileLayoutProps {
  children: ReactNode;
  title: string;
  onBack?: () => void;
  isProfilePage?: boolean;
}

export default function ProfileLayout({ children, title, onBack, isProfilePage = false }: ProfileLayoutProps) {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Sidebar - hidden on mobile */}
      <Sidebar />
      
      {/* Main content */}
      <main className="flex-1 md:ml-64 pt-16 pb-safe w-full">
        {/* Custom Profile Header */}
        <ProfileHeader title={title} onBack={onBack} isProfilePage={isProfilePage} />
        
        {/* Page content - with proper padding to avoid content being hidden under the mobile nav */}
        <div className="p-4 pb-24 md:pb-6 max-w-screen-xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* Mobile navigation */}
      <MobileNav />
    </div>
  );
}