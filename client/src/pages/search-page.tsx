import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { 
  Search, 
  MapPin, 
  Users, 
  Heart, 
  MessageCircle, 
  Share, 
  Grid, 
  Tag, 
  Compass, 
  FileText
} from "lucide-react";
import MainLayout from "@/components/layout/main-layout";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function SearchPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationGranted, setLocationGranted] = useState(false);
  
  // Sample explore grid data - in a real app, this would come from an API
  const exploreItems = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    image: `/placeholder-explore-${(i % 3) + 1}.jpg`,
    username: `user_${i + 1}`,
    likes: Math.floor(Math.random() * 1000) + 100,
    comments: Math.floor(Math.random() * 100) + 10,
  }));
  
  // Sample nearby users - in a real app, this would come from an API based on geolocation
  const nearbyUsers = [
    { 
      id: 1, 
      username: "rahul_sharma", 
      displayName: "Rahul Sharma", 
      college: "IIT Delhi", 
      department: "Computer Science", 
      distance: 0.5, 
      avatar: "" 
    },
    { 
      id: 2, 
      username: "priya_97", 
      displayName: "Priya Patel", 
      college: "Delhi University", 
      department: "Economics", 
      distance: 1.2, 
      avatar: "" 
    },
    { 
      id: 3, 
      username: "amit_kumar", 
      displayName: "Amit Kumar", 
      college: "IIT Delhi", 
      department: "Electrical Engineering", 
      distance: 2.0, 
      avatar: "" 
    },
    { 
      id: 4, 
      username: "neha_gupta", 
      displayName: "Neha Gupta", 
      college: "Delhi University", 
      department: "Computer Science", 
      distance: 2.5, 
      avatar: "" 
    },
    { 
      id: 5, 
      username: "vikram_singh", 
      displayName: "Vikram Singh", 
      college: "IIT Delhi", 
      department: "Mechanical Engineering", 
      distance: 3.1, 
      avatar: "" 
    }
  ];
  
  // Sample college groups
  const collegeGroups = [
    {
      id: 1,
      name: "IIT Delhi Tech Club",
      members: 245,
      coverImage: "/placeholder-campus.jpg"
    },
    {
      id: 2,
      name: "Campus Photography",
      members: 187,
      coverImage: "/placeholder-tech.jpg"
    },
    {
      id: 3,
      name: "Delhi University Debating Society",
      members: 320,
      coverImage: "/placeholder-meeting.jpg"
    },
    {
      id: 4,
      name: "Engineering Projects Hub",
      members: 156,
      coverImage: "/placeholder-highlight.jpg"
    }
  ];
  
  const handleRequestLocation = () => {
    // In a real implementation, this would use the browser's geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success callback
          console.log("Location granted:", position.coords);
          setLocationGranted(true);
          toast({
            title: "Location Access Granted",
            description: "You can now see nearby users in your area"
          });
        },
        (error) => {
          // Error callback
          console.error("Error getting location:", error);
          toast({
            title: "Location Access Denied",
            description: "Please enable location access to see nearby users",
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive"
      });
    }
  };
  
  const handleSendHello = (userId: number, username: string) => {
    // In a real implementation, this would send a message to the user
    toast({
      title: "Message Sent",
      description: `You said hello to ${username}`
    });
  };

  return (
    <MainLayout>
      {/* Search bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          placeholder="Search users, posts, groups..."
          className="pl-10 bg-gray-100 border-gray-100"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="discover" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="discover" className="flex-1">
            <Compass className="mr-2 h-4 w-4" />
            Discover
          </TabsTrigger>
          <TabsTrigger value="nearby" className="flex-1">
            <MapPin className="mr-2 h-4 w-4" />
            Nearby
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex-1">
            <Users className="mr-2 h-4 w-4" />
            Groups
          </TabsTrigger>
        </TabsList>
        
        {/* Discover Tab - Popular Posts */}
        <TabsContent value="discover" className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
            {exploreItems.map((item) => (
              <div key={item.id} className="aspect-square relative overflow-hidden group">
                <img
                  src={item.image}
                  alt={`Post by ${item.username}`}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="%23ccc" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="12" cy="12" r="5"/><line x1="3" y1="3" x2="21" y2="21"/></svg>';
                  }}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4 text-white">
                  <div className="flex items-center">
                    <Heart className="mr-1 h-5 w-5" />
                    <span>{item.likes}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="mr-1 h-5 w-5" />
                    <span>{item.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        {/* Nearby Tab - Nearby Users */}
        <TabsContent value="nearby">
          {!locationGranted ? (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm">
              <div className="inline-flex rounded-full p-4 bg-gray-100 mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Find Nearby Students</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Enable location access to discover students around your area, connect with peers, and expand your college network.
              </p>
              <Button onClick={handleRequestLocation}>
                Enable Location
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {nearbyUsers.map((user) => (
                <Card key={user.id} className="overflow-hidden">
                  <CardHeader className="p-4 flex flex-row items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{user.displayName}</h3>
                          <p className="text-sm text-gray-500">@{user.username}</p>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{user.distance} km away</span>
                        </div>
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        {user.college}, {user.department}
                      </div>
                    </div>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendHello(user.id, user.username)}
                    >
                      Say Hello
                    </Button>
                    <Link href={`/profile/${user.username}`}>
                      <Button size="sm">View Profile</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Groups Tab - College Groups */}
        <TabsContent value="groups">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collegeGroups.map((group) => (
              <Card key={group.id} className="overflow-hidden">
                <div className="h-32 bg-gray-100 relative">
                  <img
                    src={group.coverImage}
                    alt={group.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="%23ccc" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="12" cy="12" r="5"/><line x1="3" y1="3" x2="21" y2="21"/></svg>';
                    }}
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{group.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{group.members} members</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Link href={`/groups/${group.id}`}>
                    <Button className="w-full">View Group</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/groups/create">
              <Button>
                <Users className="mr-2 h-4 w-4" />
                Create New Group
              </Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}