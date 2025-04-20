import Sidebar from "./sidebar";
import { ReactNode } from "react";

interface SocialLayoutProps {
  children: ReactNode;
}

export default function SocialLayout({ children }: SocialLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 pl-64">
        <div className="container px-4 py-6 mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}