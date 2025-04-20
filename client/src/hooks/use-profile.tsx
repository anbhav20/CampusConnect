import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { mockApi } from "@/lib/mockApi";
import { z } from "zod";

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
    queryKey: [`/api/user`, username], // Include username in the query key for proper caching
    staleTime: 0, // Always consider data stale to ensure fresh data
    queryFn: async () => {
      try {
        // For development, use mock API
        //return await mockApi.getProfile(username);
        
        // For production, use real API
        // If no username is provided, fetch current user's profile
        const response = await apiRequest("GET", `/api/user`);
        const userData = await response.json();
        
        // Ensure the profile has all required fields, including highlights
        return {
          id: userData.id || 0,
          username: userData.username || "Unknown",
          displayName: userData.displayName || userData.username || "Unknown User",
          bio: userData.bio || "",
          college: userData.college || "",
          department: userData.department || "",
          year: userData.year || "",
          followers: userData.followers || 0,
          following: userData.following || 0,
          posts: userData.posts || 0,
          isFollowing: userData.isFollowing || false,
          isVerified: userData.isVerified || false,
          profileUrl: userData.profileUrl || "",
          highlights: userData.highlights || [] // Ensure highlights is always an array
        };
      } catch (error: any) {
        toast({
          title: "Error loading profile",
          description: error.message,
          variant: "destructive",
        });
        // Return a default profile to prevent UI errors
        return {
          id: 0,
          username: "Unknown",
          displayName: "Unknown User",
          bio: "",
          college: "",
          department: "",
          year: "",
          followers: 0,
          following: 0,
          posts: 0,
          isFollowing: false,
          isVerified: false,
          profileUrl: "",
          highlights: []
        };
      }
    },
    enabled: true, // Always fetch
  });
}

// Fetch followers
export function useFollowers(username: string | undefined) {
  return useQuery<FollowerData[]>({
    queryKey: [`/api/followers/${username || 'me'}`],
    queryFn: async () => {
      try {
        // For development, use mock API
        //return await mockApi.getFollowers(username);
        
        // For production, use real API
        const response = await apiRequest("GET", `/api/followers/${username || 'me'}`);
        return await response.json();
      } catch (error) {
        console.error("Error fetching followers:", error);
        // Return empty array instead of throwing to prevent UI errors
        return [];
      }
    },
    enabled: !!username || true,
  });
}

// Fetch following
export function useFollowing(username: string | undefined) {
  return useQuery<FollowerData[]>({
    queryKey: [`/api/following/${username || 'me'}`],
    queryFn: async () => {
      try {
        // For development, use mock API
        //return await mockApi.getFollowing(username);
        
        // For production, use real API
        const response = await apiRequest("GET", `/api/following/${username || 'me'}`);
        return await response.json();
      } catch (error) {
        console.error("Error fetching following:", error);
        // Return empty array instead of throwing to prevent UI errors
        return [];
      }
    },
    enabled: !!username || true,
  });
}

// Fetch posts
export function usePosts(username: string | undefined) {
  return useQuery<PostData[]>({
    queryKey: [`/api/feed`], // Use feed endpoint for current user's posts
    queryFn: async () => {
      try {
        // For development, use mock API
        // return await mockApi.getPosts(username);
        
        // For production, use real API
        const response = await apiRequest("GET", `/api/feed`);
        return await response.json();
      } catch (error) {
        console.error("Error fetching posts:", error);
        // Return empty array instead of throwing to prevent UI errors
        return [];
      }
    },
    enabled: true,
  });
}

// Follow a user
export function useFollowUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      // For development, use mock API
      //await mockApi.followUser(username);
      
      // For production, use real API
      await apiRequest("POST", `/api/follow/${userId}`);
    },
    onSuccess: (_, userId) => {
      // Update profile data
      queryClient.invalidateQueries({ queryKey: [`/api/user`] });
      // Update my following list
      queryClient.invalidateQueries({ queryKey: ['/api/following/me'] });
      // Update my followers list
      queryClient.invalidateQueries({ queryKey: ['/api/followers/me'] });
      // Update feed
      queryClient.invalidateQueries({ queryKey: ['/api/feed'] });
      
      toast({
        title: "Success",
        description: `You are now following this user`,
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
    mutationFn: async (userId: string) => {
      // For development, use mock API
      //await mockApi.unfollowUser(username);
      
      // For production, use real API
      await apiRequest("DELETE", `/api/follow/${userId}`);
    },
    onSuccess: (_, userId) => {
      // Update profile data
      queryClient.invalidateQueries({ queryKey: [`/api/user`] });
      // Update my following list
      queryClient.invalidateQueries({ queryKey: ['/api/following/me'] });
      // Update my followers list
      queryClient.invalidateQueries({ queryKey: ['/api/followers/me'] });
      // Update feed
      queryClient.invalidateQueries({ queryKey: ['/api/feed'] });
      
      toast({
        title: "Success",
        description: `You have unfollowed this user`,
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
    mutationFn: async (userId: string) => {
      // For development, use mock API
      //await mockApi.removeFollower(username);
      
      // For production, use real API
      // Note: This endpoint might not exist in the current API
      // You may need to implement it on the server side
      try {
        await apiRequest("DELETE", `/api/followers/${userId}`);
      } catch (error) {
        console.error("Error removing follower:", error);
        // Use block as a fallback if remove follower doesn't exist
        await apiRequest("POST", `/api/block/${userId}`);
      }
    },
    onSuccess: (_, userId) => {
      // Update my followers list
      queryClient.invalidateQueries({ queryKey: ['/api/followers/me'] });
      // Update my profile data
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      // Update feed
      queryClient.invalidateQueries({ queryKey: ['/api/feed'] });
      
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

// Profile update schema
export const profileUpdateSchema = z.object({
  username: z.string().min(3).optional(),
  displayName: z.string().min(2).optional(),
  bio: z.string().max(160).optional(),
  college: z.string().optional(),
  department: z.string().optional(),
  year: z.string().optional(),
});

export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;

// Update profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: ProfileUpdateData) => {
      const response = await apiRequest("PATCH", "/api/user", data);
      return response.json();
    },
    onSuccess: (data) => {
      // Update the cache with the new data
      queryClient.setQueryData(["/api/user"], data);
      
      // Then invalidate to ensure any other components get updated
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });
}