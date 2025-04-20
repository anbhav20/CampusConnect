import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, Briefcase, Users, BookOpen, Settings } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {user?.username}!
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Your campus dashboard is ready. Start connecting with your college community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <UserCircle className="h-5 w-5 text-primary" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">View and edit your profile details</p>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View Profile
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Browse verified job listings</p>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Find Jobs
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Groups
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Connect with college groups</p>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Explore Groups
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Access study materials and notes</p>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Browse Resources
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Get Started</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-md p-4">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <UserCircle className="h-5 w-5 text-primary" />
                  Complete Your Profile
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  Add your skills, interests, and college information to help others find you.
                </p>
                <Button size="sm" variant="outline">Update Profile</Button>
              </div>
              
              <div className="border border-gray-200 rounded-md p-4">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Join Your College Group
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  Connect with students from your college to share resources and information.
                </p>
                <Button size="sm" variant="outline">Find Groups</Button>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-gray-500 mb-2">This is a placeholder dashboard</h2>
            <p className="text-sm text-gray-400">
              Full functionality would be implemented in a complete version.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
