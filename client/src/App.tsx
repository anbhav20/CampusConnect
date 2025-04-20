import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing-page";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import ProfilePage from "@/pages/profile-page";
import ExplorePage from "@/pages/explore-page";
import { ProtectedRoute } from "./lib/protected-route";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <span className="ml-2 text-muted-foreground">Loading...</span>
  </div>
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
        
        {/* Social Features */}
        <ProtectedRoute path="/messages" component={() => (
          <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Messages</h1>
            <p>Your messages will appear here.</p>
          </div>
        )} />
        <ProtectedRoute path="/messages/:roomId" component={() => (
          <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Chat Room</h1>
            <p>Your chat conversation will appear here.</p>
          </div>
        )} />
        <ProtectedRoute path="/notifications" component={() => (
          <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Notifications</h1>
            <p>Your notifications will appear here.</p>
          </div>
        )} />
        <ProtectedRoute path="/create" component={() => (
          <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
            <p>Create and share new content.</p>
          </div>
        )} />
        
        {/* College Groups */}
        <ProtectedRoute path="/groups" component={() => (
          <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">College Groups</h1>
            <p>Join and participate in college groups.</p>
          </div>
        )} />
        <ProtectedRoute path="/groups/:groupId" component={() => (
          <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Group Details</h1>
            <p>View group posts and members.</p>
          </div>
        )} />
        <ProtectedRoute path="/groups/create" component={() => (
          <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Create New Group</h1>
            <p>Create a new college group.</p>
          </div>
        )} />
        
        {/* Jobs & Career */}
        <ProtectedRoute path="/jobs" component={() => (
          <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Job Listings</h1>
            <p>Find internships and job opportunities.</p>
          </div>
        )} />
        <ProtectedRoute path="/jobs/:jobId" component={() => (
          <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Job Details</h1>
            <p>View job details and apply.</p>
          </div>
        )} />
        <ProtectedRoute path="/jobs/create" component={() => (
          <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Post New Job</h1>
            <p>Create a new job listing.</p>
          </div>
        )} />
        <ProtectedRoute path="/jobs/applications" component={() => (
          <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">My Applications</h1>
            <p>Your job applications will appear here.</p>
          </div>
        )} />
        
        {/* Nearby Users */}
        <ProtectedRoute path="/nearby" component={() => (
          <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Nearby Users</h1>
            <p>Discover students around your location.</p>
          </div>
        )} />
        
        {/* Stories & Reels */}
        <ProtectedRoute path="/stories" component={() => (
          <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Stories</h1>
            <p>View stories from people you follow.</p>
          </div>
        )} />
        <ProtectedRoute path="/reels" component={() => (
          <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Reels</h1>
            <p>Watch short videos from creators.</p>
          </div>
        )} />
        
        {/* User Settings */}
        <ProtectedRoute path="/settings" component={() => (
          <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            <p>Manage your account settings.</p>
          </div>
        )} />
        <ProtectedRoute path="/settings/profile" component={() => (
          <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
            <p>Update your profile information.</p>
          </div>
        )} />
        <ProtectedRoute path="/settings/account" component={() => (
          <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
            <p>Manage your account preferences.</p>
          </div>
        )} />
        <ProtectedRoute path="/settings/privacy" component={() => (
          <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Privacy Settings</h1>
            <p>Manage your privacy preferences.</p>
          </div>
        )} />
        
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
