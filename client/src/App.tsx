import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing-page";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/auth">
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Page</h1>
          <p>Authentication is currently being implemented.</p>
        </div>
      </Route>
      <Route path="/home">
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <p>User dashboard is currently being implemented.</p>
        </div>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return <Router />;
}

export default App;
