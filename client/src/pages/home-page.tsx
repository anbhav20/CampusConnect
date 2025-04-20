import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Bookmark, 
  MoreVertical, 
  PlusCircle 
} from "lucide-react";
import MainLayout from "@/components/layout/main-layout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function HomePage() {
  const { user } = useAuth();
  
  // Sample posts data - in a real app, this would come from an API
  const posts = [
    {
      id: 1,
      username: "drs.jaishankar",
      userFullName: "Dr. S. Jaishankar",
      isVerified: true,
      avatar: "",
      timeAgo: "1h",
      image: "/placeholder-meeting.jpg",
      caption: "Productive meeting with German Foreign Minister @ABaerbock. Discussed taking forward our bilateral relationship. Exchanged views on Ukraine, Indo-Pacific and our G20 collaboration.",
      likes: 1847,
      commentCount: 42,
    },
    {
      id: 2,
      username: "campus_connect_official",
      userFullName: "Campus Connect",
      isVerified: true,
      avatar: "",
      timeAgo: "3h",
      image: "/placeholder-campus.jpg",
      caption: "Join us for the upcoming campus event! #CampusConnect",
      likes: 542,
      commentCount: 18,
    },
    {
      id: 3,
      username: "tech_society",
      userFullName: "Tech Society, IIT Delhi",
      isVerified: false,
      avatar: "",
      timeAgo: "5h",
      image: "/placeholder-tech.jpg",
      caption: "Our annual hackathon is back! Register now to participate and win exciting prizes. #TechFest #Hackathon",
      likes: 328,
      commentCount: 24,
    }
  ];

  // Sample stories data
  const stories = [
    { username: "your_story", avatar: "", isYourStory: true },
    { username: "ezsnippet", avatar: "", isYourStory: false },
    { username: "_nidhi.72", avatar: "", isYourStory: false },
    { username: "drs.jaishankar", avatar: "", isYourStory: false },
    { username: "tech_society", avatar: "", isYourStory: false },
    { username: "campus_events", avatar: "", isYourStory: false },
    { username: "sports_club", avatar: "", isYourStory: false },
    { username: "placement_cell", avatar: "", isYourStory: false },
  ];

  const handlePostAction = (action: string, postId: number) => {
    console.log(`Action ${action} on post ${postId}`);
    // Here you would implement the actual functionality based on the action
  };

  return (
    <MainLayout>
      {/* Stories Section */}
      <div className="bg-white rounded-lg p-4 shadow-sm mb-6 overflow-hidden">
        <div className="flex space-x-4 overflow-x-auto py-2 -mx-2 px-2">
          {stories.map((story, i) => (
            <div key={i} className="flex flex-col items-center space-y-1 min-w-[72px]">
              <div className={`rounded-full p-[2px] ${story.isYourStory ? 'bg-white border-2 border-dashed border-gray-300' : 'bg-gradient-to-tr from-yellow-400 to-fuchsia-600'}`}>
                <div className="relative">
                  <Avatar className="h-16 w-16 cursor-pointer">
                    {story.isYourStory ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-full">
                        <PlusCircle className="h-8 w-8 text-primary" />
                      </div>
                    ) : (
                      <AvatarFallback>{story.username.charAt(0).toUpperCase()}</AvatarFallback>
                    )}
                  </Avatar>
                </div>
              </div>
              <span className="text-xs truncate w-16 text-center">{story.isYourStory ? "Your story" : story.username}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map(post => (
          <Card key={post.id} className="overflow-hidden shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback>{post.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center">
                    <span className="font-semibold text-sm mr-1">{post.username}</span>
                    {post.isVerified && (
                      <span className="text-blue-500">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7l-4.5-4.5 1.4-1.4 3.1 3.1 6.5-6.5 1.4 1.4-7.9 7.9z" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{post.timeAgo}</span>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-auto">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handlePostAction('block', post.id)}>
                      Block
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePostAction('message', post.id)}>
                      Send Message
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handlePostAction('share', post.id)}>
                      Share To
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePostAction('copy', post.id)}>
                      Copy Link
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <img
                  src={post.image}
                  alt={`Post by ${post.username}`}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="%23ccc" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="12" cy="12" r="5"/><line x1="3" y1="3" x2="21" y2="21"/></svg>';
                  }}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start pt-3">
              <div className="flex justify-between w-full mb-2">
                <div className="flex space-x-4">
                  <Button variant="ghost" size="icon" className="hover:text-red-500">
                    <Heart size={24} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MessageCircle size={24} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share size={24} />
                  </Button>
                </div>
                <Button variant="ghost" size="icon">
                  <Bookmark size={24} />
                </Button>
              </div>
              <div className="font-semibold text-sm mb-1">{post.likes} likes</div>
              <div>
                <span className="font-semibold text-sm mr-2">{post.username}</span>
                <span className="text-sm">{post.caption}</span>
              </div>
              <Button variant="ghost" className="text-gray-500 text-xs mt-1 px-0">
                View all {post.commentCount} comments
              </Button>
              <div className="w-full mt-2">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>{user?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                  <input 
                    type="text" 
                    placeholder="Add a comment..." 
                    className="text-sm text-gray-500 bg-transparent outline-none flex-1"
                  />
                  <Button variant="ghost" size="sm" className="text-primary text-xs font-semibold">
                    Post
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
}