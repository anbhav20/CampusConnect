import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { mockApi } from "@/lib/mockApi";

// Types
export interface ProfileData {
  id: number;
  username: string;
  displayName: string;
  bio: string;
  college: string;
  department: string;
  year: string;
  followers: number;
  following: number;
  posts: number;
  isFollowing: boolean;
  isVerified: boolean;
  profileUrl: string;
  highlights: Array<{
    id: number;
    title: string;
    image: string;
  }>;
}

export interface FollowerData {
  id: number;
  username: string;
  displayName: string;
  isFollowing: boolean;
  profilePicture?: string;
}

export interface PostData {
  id: number;
  image: string;
  likes: number;
  comments: number;
  caption?: string;
  createdAt: string;
}

// Fetch profile data
export function useProfileData(username: string | undefined) {
  const { toast } = useToast();
  
  return useQuery<ProfileData>({
    queryKey: [`/api/users/${username || 'me'}`],
    queryFn: async () => {
      try {
        console.log(`Fetching profile for: ${username || 'me'}`);
        const response = await apiRequest("GET", `/api/users/${username || 'me'}`);
        const data = await response.json();
        console.log('Profile data:', data);
        return data;
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error loading profile",
          description: error.message || "Failed to load profile data",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!username || true, // Always fetch for 'me' if no username provided
    retry: 1, // Only retry once
  });
}

// Fetch followers
export function useFollowers(username: string | undefined) {
  const { toast } = useToast();
  
  return useQuery<FollowerData[]>({
    queryKey: [`/api/users/${username || 'me'}/followers`],
    queryFn: async () => {
      try {
        console.log(`Fetching followers for: ${username || 'me'}`);
        const response = await apiRequest("GET", `/api/users/${username || 'me'}/followers`);
        const data = await response.json();
        console.log('Followers data:', data);
        return data;
      } catch (error: any) {
        console.error('Error fetching followers:', error);
        toast({
          title: "Error loading followers",
          description: error.message || "Failed to load followers",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!username || true,
    retry: 1,
  });
}

// Fetch following
export function useFollowing(username: string | undefined) {
  const { toast } = useToast();
  
  return useQuery<FollowerData[]>({
    queryKey: [`/api/users/${username || 'me'}/following`],
    queryFn: async () => {
      try {
        console.log(`Fetching following for: ${username || 'me'}`);
        const response = await apiRequest("GET", `/api/users/${username || 'me'}/following`);
        const data = await response.json();
        console.log('Following data:', data);
        return data;
      } catch (error: any) {
        console.error('Error fetching following:', error);
        toast({
          title: "Error loading following",
          description: error.message || "Failed to load following users",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!username || true,
    retry: 1,
  });
}

// Fetch posts
export function usePosts(username: string | undefined) {
  const { toast } = useToast();
  
  return useQuery<PostData[]>({
    queryKey: [`/api/users/${username || 'me'}/posts`],
    queryFn: async () => {
      try {
        console.log(`Fetching posts for: ${username || 'me'}`);
        const response = await apiRequest("GET", `/api/users/${username || 'me'}/posts`);
        const data = await response.json();
        console.log('Posts data:', data);
        return data;
      } catch (error: any) {
        console.error('Error fetching posts:', error);
        toast({
          title: "Error loading posts",
          description: error.message || "Failed to load posts",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!username || true,
    retry: 1,
  });
}

// Follow a user
export function useFollowUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (username: string) => {
      console.log(`Following user: ${username}`);
      try {
        await apiRequest("POST", `/api/users/${username}/follow`);
      } catch (error) {
        console.error('Error following user:', error);
        throw error;
      }
    },
    onSuccess: (_, username) => {
      // Update profile data
      queryClient.invalidateQueries({ queryKey: [`/api/users/${username}`] });
      // Update my following list
      queryClient.invalidateQueries({ queryKey: ['/api/users/me/following'] });
      // Update my profile data (following count)
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
      
      toast({
        title: "Success",
        description: `You are now following ${username}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to follow user",
        variant: "destructive",
      });
    },
  });
}

// Unfollow a user
export function useUnfollowUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (username: string) => {
      console.log(`Unfollowing user: ${username}`);
      try {
        await apiRequest("DELETE", `/api/users/${username}/follow`);
      } catch (error) {
        console.error('Error unfollowing user:', error);
        throw error;
      }
    },
    onSuccess: (_, username) => {
      // Update profile data
      queryClient.invalidateQueries({ queryKey: [`/api/users/${username}`] });
      // Update my following list
      queryClient.invalidateQueries({ queryKey: ['/api/users/me/following'] });
      // Update my profile data (following count)
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
      
      toast({
        title: "Success",
        description: `You have unfollowed ${username}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to unfollow user",
        variant: "destructive",
      });
    },
  });
}

// Remove a follower
export function useRemoveFollower() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (username: string) => {
      console.log(`Removing follower: ${username}`);
      try {
        await apiRequest("DELETE", `/api/users/${username}/follower`);
      } catch (error) {
        console.error('Error removing follower:', error);
        throw error;
      }
    },
    onSuccess: (_, username) => {
      // Update my followers list
      queryClient.invalidateQueries({ queryKey: ['/api/users/me/followers'] });
      // Update my profile data (follower count)
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
      // Update the other user's profile and following list
      if (username) {
        queryClient.invalidateQueries({ queryKey: [`/api/users/${username}`] });
        queryClient.invalidateQueries({ queryKey: [`/api/users/${username}/following`] });
      }
      
      toast({
        title: "Follower Removed",
        description: "User has been removed from your followers",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove follower",
        variant: "destructive",
      });
    },
  });
}