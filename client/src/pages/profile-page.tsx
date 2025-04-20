import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { 
  Grid, 
  Bookmark, 
  Tag, 
  Settings, 
  Edit, 
  MoreVertical, 
  UserX, 
  MessageCircle, 
  Share, 
  Copy, 
  Users,
  Heart,
  Loader2
} from "lucide-react";
import ProfileLayout from "@/components/layout/profile-layout";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useLocation, useParams } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  useProfileData, 
  useFollowers, 
  useFollowing, 
  usePosts,
  useFollowUser,
  useUnfollowUser,
  useRemoveFollower
} from "@/hooks/use-profile";

interface UserProfileProps {
  username?: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const params = useParams<UserProfileProps>();
  const [, setLocation] = useLocation();
  const [followersDialogOpen, setFollowersDialogOpen] = useState(false);
  const [followingDialogOpen, setFollowingDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // Force refresh profile data when component mounts
  useEffect(() => {
    // Invalidate and refetch profile data when the component mounts
    queryClient.invalidateQueries({ queryKey: ['/api/user', params.username] });
  }, [queryClient, params.username]);
  
  // Check if viewing own profile or someone else's
  const isOwnProfile = !params.username || (user && params.username === user.username);
  
  // Fetch profile data
  const { 
    data: profile, 
    isLoading: isProfileLoading, 
    error: profileError 
  } = useProfileData(params.username);
  
  // Fetch followers
  const { 
    data: followers, 
    isLoading: isFollowersLoading 
  } = useFollowers(params.username);
  
  // Fetch following
  const { 
    data: following, 
    isLoading: isFollowingLoading 
  } = useFollowing(params.username);
  
  // Fetch posts
  const { 
    data: posts, 
    isLoading: isPostsLoading 
  } = usePosts(params.username);
  
  // Follow/unfollow mutations
  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();
  const removeFollowerMutation = useRemoveFollower();
  
  // Loading state
  const isLoading = isProfileLoading || isFollowersLoading || isFollowingLoading || isPostsLoading;
  
  // Handle errors
  if (profileError) {
    return (
      <ProfileLayout title="Profile" isProfilePage={true}>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="text-red-500 mb-4">Error loading profile</div>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </ProfileLayout>
    );
  }
  
  // Handle loading state
  if (isLoading || !profile) {
    return (
      <ProfileLayout title="Profile" isProfilePage={true}>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <div>Loading profile...</div>
        </div>
      </ProfileLayout>
    );
  }
  
  const handleFollow = () => {
    if (!profile) return;
    followMutation.mutate(profile.id.toString());
  };
  
  const handleUnfollow = () => {
    if (!profile) return;
    unfollowMutation.mutate(profile.id.toString());
  };
  
  const handleProfileAction = (action: string) => {
    if (!profile) return;
    
    switch (action) {
      case 'block':
        toast({
          title: "User Blocked",
          description: `You have blocked ${profile.username}`,
          variant: "destructive"
        });
        break;
      case 'message':
        setLocation(`/messages/${profile.id}`);
        break;
      case 'share':
        // Share logic would go here
        navigator.clipboard.writeText(profile.profileUrl);
        toast({
          title: "Link Copied",
          description: "Profile link copied to clipboard"
        });
        break;
      case 'copy':
        navigator.clipboard.writeText(profile.profileUrl);
        toast({
          title: "Link Copied",
          description: "Profile link copied to clipboard"
        });
        break;
    }
  };
  
  const handleRemoveFollower = (userId: number) => {
    removeFollowerMutation.mutate(userId.toString());
  };
  
  const handleUploadProfilePicture = () => {
    // This would open file manager for profile picture upload
    // In a real implementation, we would use an input type=file
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        
        // Here you would upload the file to your server/Cloudinary
        // For now, we'll just show a toast
        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been updated successfully."
        });
      }
    };
    fileInput.click();
  };

  return (
    <ProfileLayout title={profile.displayName || "Profile"} isProfilePage={true}>
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Picture */}
          <div className="relative">
            <Avatar className="h-24 w-24 md:h-36 md:w-36 border-2 border-gray-200">
              <AvatarImage src={user?.profile_picture || ""} alt={profile.username} />
              <AvatarFallback className="text-4xl">
                {profile.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isOwnProfile && (
              <Button 
                variant="outline" 
                size="sm" 
                className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0 bg-white"
                onClick={handleUploadProfilePicture}
              >
                <Edit size={16} />
              </Button>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-4">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold">{profile.username}</h1>
                {profile.isVerified && (
                  <span className="text-blue-500 ml-1">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7l-4.5-4.5 1.4-1.4 3.1 3.1 6.5-6.5 1.4 1.4-7.9 7.9z" />
                    </svg>
                  </span>
                )}
              </div>
              
              <div className="flex gap-2">
                {isOwnProfile ? (
                  <Button variant="outline" size="sm" onClick={() => setLocation("/settings/profile")}>
                    Edit profile
                  </Button>
                ) : (
                  <>
                    {profile.isFollowing ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleUnfollow}
                        disabled={unfollowMutation.isPending}
                      >
                        {unfollowMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Following
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={handleFollow}
                        disabled={followMutation.isPending}
                      >
                        {followMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Follow
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => setLocation(`/messages/${profile.id}`)}>
                      Message
                    </Button>
                  </>
                )}
              </div>
              
              {!isOwnProfile && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleProfileAction('block')}>
                      <UserX className="mr-2 h-4 w-4" />
                      <span>Block</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleProfileAction('message')}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      <span>Send Message</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleProfileAction('share')}>
                      <Share className="mr-2 h-4 w-4" />
                      <span>Share To</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleProfileAction('copy')}>
                      <Copy className="mr-2 h-4 w-4" />
                      <span>Copy Link</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            
            <div className="flex justify-center md:justify-start space-x-6 mb-4">
              <div>
                <span className="font-semibold">{profile.posts}</span>{" "}
                <span className="text-gray-600">posts</span>
              </div>
              
              <Dialog open={followersDialogOpen} onOpenChange={setFollowersDialogOpen}>
                <DialogTrigger asChild>
                  <button className="focus:outline-none hover:underline">
                    <span className="font-semibold">{profile.followers}</span>{" "}
                    <span className="text-gray-600">followers</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Followers</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    {isFollowersLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : followers && followers.length > 0 ? (
                      followers.map((follower) => (
                        <div key={follower.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={follower.profilePicture} alt={follower.username} />
                              <AvatarFallback>{follower.username[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold">{follower.username}</div>
                              <div className="text-sm text-gray-500">{follower.displayName}</div>
                            </div>
                          </div>
                          {isOwnProfile ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRemoveFollower(follower.id)}
                              disabled={removeFollowerMutation.isPending}
                            >
                              {removeFollowerMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : null}
                              Remove
                            </Button>
                          ) : (
                            follower.isFollowing ? (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => unfollowMutation.mutate(follower.id.toString())}
                                disabled={unfollowMutation.isPending}
                              >
                                {unfollowMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : null}
                                Following
                              </Button>
                            ) : (
                              <Button 
                                size="sm"
                                onClick={() => followMutation.mutate(follower.id.toString())}
                                disabled={followMutation.isPending}
                              >
                                {followMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : null}
                                Follow
                              </Button>
                            )
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No followers yet
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog open={followingDialogOpen} onOpenChange={setFollowingDialogOpen}>
                <DialogTrigger asChild>
                  <button className="focus:outline-none hover:underline">
                    <span className="font-semibold">{profile.following}</span>{" "}
                    <span className="text-gray-600">following</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Following</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    {isFollowingLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : following && following.length > 0 ? (
                      following.map((followed) => (
                        <div key={followed.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={followed.profilePicture} alt={followed.username} />
                              <AvatarFallback>{followed.username[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold">{followed.username}</div>
                              <div className="text-sm text-gray-500">{followed.displayName}</div>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => unfollowMutation.mutate(followed.id.toString())}
                            disabled={unfollowMutation.isPending}
                          >
                            {unfollowMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            Following
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Not following anyone yet
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="mb-4">
              <h2 className="font-semibold">{profile.displayName}</h2>
              <p className="text-gray-700">{profile.bio}</p>
              <div className="mt-2 text-sm">
                <div><span className="font-medium">College:</span> {profile.college}</div>
                <div><span className="font-medium">Department:</span> {profile.department}</div>
                <div><span className="font-medium">Year:</span> {profile.year}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Highlights */}
        {profile.highlights && profile.highlights.length > 0 && (
          <div className="flex space-x-6 mt-6 px-4 overflow-x-auto py-2">
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
            
            {isOwnProfile && (
              <div className="flex flex-col items-center">
                <div className="rounded-full p-[2px] border border-gray-300 mb-1">
                  <div className="h-16 w-16 rounded-full flex items-center justify-center bg-gray-100">
                    <span className="text-2xl font-thin">+</span>
                  </div>
                </div>
                <span className="text-xs">New</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Content Tabs */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
          
          <TabsContent value="posts" className="mt-0 p-0">
            {isPostsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !posts || posts.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex rounded-full p-6 bg-gray-100 mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-light mb-1">Share Photos</h3>
                <p className="text-gray-500 mb-6">When you share photos, they will appear on your profile.</p>
                {isOwnProfile && (
                  <Button className="bg-primary text-white hover:bg-primary/90">Share your first photo</Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {posts.map(post => (
                  <div key={post.id} className="relative aspect-square cursor-pointer group">
                    <img 
                      src={post.image} 
                      alt={`Post ${post.id}`}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="%23ccc" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="12" cy="12" r="5"/><line x1="3" y1="3" x2="21" y2="21"/></svg>';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4 text-white">
                      <div className="flex items-center">
                        <Heart size={20} className="mr-1 fill-white" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle size={20} className="mr-1 fill-white" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="saved" className="mt-0 p-4">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-1">Only you can see what you've saved</h3>
              <p className="text-gray-500">When you save something, only you can see it on Campus Connect.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="tagged" className="mt-0 p-4">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-1">Photos of you</h3>
              <p className="text-gray-500">When people tag you in photos, they'll appear here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProfileLayout>
  );
}