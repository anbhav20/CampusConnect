import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing-page";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import ProfilePage from "@/pages/profile-page";
import ExplorePage from "@/pages/explore-page";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Protected Routes with Instagram-like structure */}
      <ProtectedRoute path="/home" component={HomePage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/explore" component={ExplorePage} />
      
      {/* Additional Protected Routes for Instagram-like features */}
      <ProtectedRoute path="/search" component={ExplorePage} />
      <ProtectedRoute path="/messages" component={() => (
        <div className="max-w-xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Messages</h1>
          <p>Your messages will appear here.</p>
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
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return <Router />;
}

export default App;
