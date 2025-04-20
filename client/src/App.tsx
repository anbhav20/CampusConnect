import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing-page";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import ProfilePage from "@/pages/profile-page";
import ExplorePage from "@/pages/explore-page";
import JobsPage from "@/pages/jobs-page";
import { ProtectedRoute } from "./lib/protected-route";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import MainLayout from "@/components/layout/main-layout";

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <span className="ml-2 text-muted-foreground">Loading...</span>
  </div>
);

// Placeholder for components that are not fully implemented yet
const Placeholder = ({ title }: { title: string }) => (
  <MainLayout>
    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <p className="text-gray-500 mb-2">This feature is coming soon!</p>
      <p className="text-sm text-gray-400">We're working hard to bring you this functionality.</p>
    </div>
  </MainLayout>
);

function Router() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Switch>
        {/* Public Routes */}
        <Route path="/" component={LandingPage} />
        <Route path="/auth" component={AuthPage} />
        
        {/* Main Protected Routes */}
        <ProtectedRoute path="/home" component={HomePage} />
        <ProtectedRoute path="/profile" component={ProfilePage} />
        <ProtectedRoute path="/profile/:username" component={ProfilePage} />
        <ProtectedRoute path="/explore" component={ExplorePage} />
        <ProtectedRoute path="/jobs" component={JobsPage} />
        <ProtectedRoute path="/nearby" component={() => <Placeholder title="Nearby Users" />} />
        
        {/* Social Features */}
        <ProtectedRoute path="/messages" component={() => <Placeholder title="Messages" />} />
        <ProtectedRoute path="/messages/:roomId" component={() => <Placeholder title="Chat Room" />} />
        <ProtectedRoute path="/notifications" component={() => <Placeholder title="Notifications" />} />
        <ProtectedRoute path="/create" component={() => <Placeholder title="Create New Post" />} />
        
        {/* College Groups */}
        <ProtectedRoute path="/groups" component={() => <Placeholder title="College Groups" />} />
        <ProtectedRoute path="/groups/create" component={() => <Placeholder title="Create New Group" />} />
        <ProtectedRoute path="/groups/:groupId" component={() => <Placeholder title="Group Details" />} />
        
        {/* Jobs & Career - need to define specific routes before parameterized routes */}
        <ProtectedRoute path="/jobs/create" component={() => <Placeholder title="Post New Job" />} />
        <ProtectedRoute path="/jobs/applications" component={() => <Placeholder title="My Applications" />} />
        <ProtectedRoute path="/jobs/:jobId" component={() => <Placeholder title="Job Details" />} />
        
        {/* Stories & Reels */}
        <ProtectedRoute path="/stories" component={() => <Placeholder title="Stories" />} />
        <ProtectedRoute path="/reels" component={() => <Placeholder title="Reels" />} />
        
        {/* User Settings */}
        <ProtectedRoute path="/settings" component={() => <Placeholder title="Settings" />} />
        <ProtectedRoute path="/settings/profile" component={() => <Placeholder title="Edit Profile" />} />
        <ProtectedRoute path="/settings/account" component={() => <Placeholder title="Account Settings" />} />
        <ProtectedRoute path="/settings/privacy" component={() => <Placeholder title="Privacy Settings" />} />
        <ProtectedRoute path="/settings/blocked" component={() => <Placeholder title="Blocked Accounts" />} />
        <ProtectedRoute path="/settings/notifications" component={() => <Placeholder title="Notification Preferences" />} />
        
        {/* Fallback for 404 */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return <Router />;
}

export default App;
