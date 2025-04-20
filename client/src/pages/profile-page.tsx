import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, Bookmark, Tag, Settings } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  // Sample profile data - in a real app, this would come from an API
  const profile = {
    username: "_anbhav",
    displayName: "Anbhav",
    bio: "💬",
    followers: 49,
    following: 14,
    posts: 0,
    highlights: [
      { id: 1, title: "✨👜💕", image: "/placeholder-highlight.jpg" }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Profile Picture */}
          <div className="relative">
            <Avatar className="h-24 w-24 md:h-36 md:w-36">
              <AvatarFallback className="text-4xl">
                {profile.username.charAt(1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button 
              variant="outline" 
              size="sm" 
              className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0 bg-white"
            >
              <Settings size={16} />
            </Button>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-4">
              <h1 className="text-xl font-semibold">{profile.username}</h1>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Edit profile</Button>
                <Button variant="outline" size="sm">View archive</Button>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Settings size={20} />
              </Button>
            </div>
            
            <div className="flex justify-center md:justify-start space-x-8 mb-4">
              <div>
                <span className="font-semibold">{profile.posts}</span> posts
              </div>
              <div>
                <span className="font-semibold">{profile.followers}</span> followers
              </div>
              <div>
                <span className="font-semibold">{profile.following}</span> following
              </div>
            </div>
            
            <div className="mb-2">
              <h2 className="font-semibold">{profile.displayName}</h2>
              <p className="text-gray-600">{profile.bio}</p>
            </div>
          </div>
        </div>
        
        {/* Highlights */}
        <div className="flex space-x-6 mt-6 px-4">
          {profile.highlights.map(highlight => (
            <div key={highlight.id} className="flex flex-col items-center">
              <div className="rounded-full p-[2px] border border-gray-300 mb-1">
                <div className="h-16 w-16 rounded-full overflow-hidden">
                  <img 
                    src={highlight.image} 
                    alt={highlight.title}
                    className="object-cover h-full w-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="%23ccc" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="12" cy="12" r="5"/><line x1="3" y1="3" x2="21" y2="21"/></svg>';
                    }}
                  />
                </div>
              </div>
              <span className="text-xs">{highlight.title}</span>
            </div>
          ))}
          
          <div className="flex flex-col items-center">
            <div className="rounded-full p-[2px] border border-gray-300 mb-1">
              <div className="h-16 w-16 rounded-full flex items-center justify-center bg-gray-100">
                <span className="text-2xl font-thin">+</span>
              </div>
            </div>
            <span className="text-xs">New</span>
          </div>
        </div>
      </div>
      
      {/* Content Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts" className="flex items-center">
            <Grid size={16} className="mr-2" />
            <span className="hidden sm:inline">POSTS</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center">
            <Bookmark size={16} className="mr-2" />
            <span className="hidden sm:inline">SAVED</span>
          </TabsTrigger>
          <TabsTrigger value="tagged" className="flex items-center">
            <Tag size={16} className="mr-2" />
            <span className="hidden sm:inline">TAGGED</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="mt-6">
          {profile.posts === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex rounded-full p-6 bg-gray-100 mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-light mb-1">Share Photos</h3>
              <p className="text-gray-500 mb-6">When you share photos, they will appear on your profile.</p>
              <Button className="bg-primary text-white hover:bg-primary/90">Share your first photo</Button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {/* Posts would go here */}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="saved" className="mt-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-1">Only you can see what you've saved</h3>
            <p className="text-gray-500">When you save something, only you can see it on Campus Connect.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="tagged" className="mt-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-1">Photos of you</h3>
            <p className="text-gray-500">When people tag you in photos, they'll appear here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}