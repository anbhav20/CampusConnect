// This file provides mock API responses for development
// Replace with real API calls when your backend is ready

import { ProfileData, FollowerData, PostData } from "@/hooks/use-profile";

// Mock user data
const users: Record<string, ProfileData> = {
  "me": {
    id: 1,
    username: "anbhav_singh",
    displayName: "Anbhav Singh",
    bio: "Computer Science @ IIT Delhi | Tech enthusiast | Photography lover 📸",
    college: "IIT Delhi",
    department: "Computer Science",
    year: "3rd Year",
    followers: 0,
    following: 0,
    posts: 0,
    isFollowing: false,
    isVerified: false,
    profileUrl: "https://campusconnect.com/u/anbhav_singh",
    highlights: [
      { id: 1, title: "College", image: "/placeholder-highlight.jpg" },
      { id: 2, title: "Projects", image: "/placeholder-highlight.jpg" },
      { id: 3, title: "Hackathons", image: "/placeholder-highlight.jpg" }
    ]
  },
  "john_doe": {
    id: 2,
    username: "john_doe",
    displayName: "John Doe",
    bio: "Engineering student | Sports enthusiast",
    college: "MIT",
    department: "Mechanical Engineering",
    year: "2nd Year",
    followers: 120,
    following: 85,
    posts: 24,
    isFollowing: false,
    isVerified: true,
    profileUrl: "https://campusconnect.com/u/john_doe",
    highlights: [
      { id: 1, title: "Sports", image: "/placeholder-highlight.jpg" },
      { id: 2, title: "Travel", image: "/placeholder-highlight.jpg" }
    ]
  }
};

// Mock followers data
const followers: Record<string, FollowerData[]> = {
  "me": [],
  "john_doe": Array(120).fill(0).map((_, i) => ({
    id: i + 1,
    username: `follower_${i}`,
    displayName: `Follower ${i}`,
    isFollowing: Math.random() > 0.5
  }))
};

// Mock following data
const following: Record<string, FollowerData[]> = {
  "me": [],
  "john_doe": Array(85).fill(0).map((_, i) => ({
    id: i + 1,
    username: `following_${i}`,
    displayName: `Following ${i}`,
    isFollowing: true
  }))
};

// Mock posts data
const posts: Record<string, PostData[]> = {
  "me": [],
  "john_doe": Array(24).fill(0).map((_, i) => ({
    id: i + 1,
    image: "/placeholder-meeting.jpg",
    likes: Math.floor(Math.random() * 100) + 10,
    comments: Math.floor(Math.random() * 20) + 1,
    caption: `This is post ${i + 1}`,
    createdAt: new Date(Date.now() - i * 86400000).toISOString()
  }))
};

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockApi = {
  // Get user profile
  getProfile: async (username: string = "me"): Promise<ProfileData> => {
    await delay(800); // Simulate network delay
    const user = users[username] || users["me"];
    return { ...user };
  },
  
  // Get user followers
  getFollowers: async (username: string = "me"): Promise<FollowerData[]> => {
    await delay(1000);
    return [...(followers[username] || [])];
  },
  
  // Get user following
  getFollowing: async (username: string = "me"): Promise<FollowerData[]> => {
    await delay(1000);
    return [...(following[username] || [])];
  },
  
  // Get user posts
  getPosts: async (username: string = "me"): Promise<PostData[]> => {
    await delay(1200);
    return [...(posts[username] || [])];
  },
  
  // Follow a user
  followUser: async (username: string): Promise<void> => {
    await delay(500);
    
    // Update the target user's followers count
    if (users[username]) {
      users[username].followers += 1;
      users[username].isFollowing = true;
    }
    
    // Update current user's following count
    if (users["me"]) {
      users["me"].following += 1;
    }
    
    // Add to following list
    if (!following["me"]) following["me"] = [];
    following["me"].push({
      id: Date.now(),
      username,
      displayName: users[username]?.displayName || username,
      isFollowing: true
    });
    
    // Add to followers list of target user
    if (!followers[username]) followers[username] = [];
    followers[username].push({
      id: Date.now(),
      username: "me",
      displayName: users["me"]?.displayName || "Me",
      isFollowing: false
    });
  },
  
  // Unfollow a user
  unfollowUser: async (username: string): Promise<void> => {
    await delay(500);
    
    // Update the target user's followers count
    if (users[username]) {
      users[username].followers = Math.max(0, users[username].followers - 1);
      users[username].isFollowing = false;
    }
    
    // Update current user's following count
    if (users["me"]) {
      users["me"].following = Math.max(0, users["me"].following - 1);
    }
    
    // Remove from following list
    if (following["me"]) {
      following["me"] = following["me"].filter(user => user.username !== username);
    }
    
    // Remove from followers list of target user
    if (followers[username]) {
      followers[username] = followers[username].filter(user => user.username !== "me");
    }
  },
  
  // Remove a follower
  removeFollower: async (username: string): Promise<void> => {
    await delay(500);
    
    // Update current user's followers count
    if (users["me"]) {
      users["me"].followers = Math.max(0, users["me"].followers - 1);
    }
    
    // Update the target user's following count
    if (users[username]) {
      users[username].following = Math.max(0, users[username].following - 1);
    }
    
    // Remove from followers list
    if (followers["me"]) {
      followers["me"] = followers["me"].filter(user => user.username !== username);
    }
    
    // Remove from following list of target user
    if (following[username]) {
      following[username] = following[username].filter(user => user.username !== "me");
    }
  }
};