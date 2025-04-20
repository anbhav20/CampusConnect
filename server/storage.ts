import { 
  users, followers, blocked_users, posts, post_likes, post_comments, college_groups, 
  group_members, group_posts, chat_rooms, chat_participants, chat_messages, notifications,
  job_listings, job_applications, job_bookmarks, 
  type User, type InsertUser, type Post, type CollegeGroup, type JobListing
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Define types for all entities
interface Follower {
  id: number;
  follower_id: number;
  following_id: number;
  created_at: Date;
}

interface BlockedUser {
  id: number;
  blocker_id: number;
  blocked_id: number;
  created_at: Date;
}

interface PostLike {
  id: number;
  post_id: number;
  user_id: number;
  created_at: Date;
}

interface PostComment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: Date;
  updated_at: Date;
}

interface GroupMember {
  id: number;
  group_id: number;
  user_id: number;
  is_admin: boolean;
  created_at: Date;
}

interface GroupPost {
  id: number;
  group_id: number;
  post_id: number;
  created_at: Date;
}

interface ChatRoom {
  id: number;
  is_group: boolean;
  name: string | null;
  created_at: Date;
  updated_at: Date;
}

interface ChatParticipant {
  id: number;
  room_id: number;
  user_id: number;
  created_at: Date;
}

interface ChatMessage {
  id: number;
  room_id: number;
  sender_id: number;
  content: string | null;
  media_url: string | null;
  media_type: string | null;
  is_read: boolean;
  created_at: Date;
}

interface Notification {
  id: number;
  user_id: number;
  sender_id: number | null;
  type: string;
  content: string | null;
  reference_id: number | null;
  is_read: boolean;
  created_at: Date;
  expires_at: Date | null;
}

interface JobApplication {
  id: number;
  job_id: number;
  user_id: number;
  resume_url: string | null;
  cover_letter: string | null;
  status: string;
  created_at: Date;
  updated_at: Date;
}

interface JobBookmark {
  id: number;
  job_id: number;
  user_id: number;
  created_at: Date;
}

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByFirebaseUID(firebaseUID: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getNearbyUsers(lat: number, lng: number, radius: number): Promise<User[]>;
  
  // Follower operations
  followUser(followerId: number, followingId: number): Promise<Follower>;
  unfollowUser(followerId: number, followingId: number): Promise<boolean>;
  getFollowers(userId: number): Promise<User[]>;
  getFollowing(userId: number): Promise<User[]>;
  
  // Block operations
  blockUser(blockerId: number, blockedId: number): Promise<BlockedUser>;
  unblockUser(blockerId: number, blockedId: number): Promise<boolean>;
  getBlockedUsers(userId: number): Promise<User[]>;
  
  // Post operations
  createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Promise<Post>;
  getPost(id: number): Promise<Post | undefined>;
  getUserPosts(userId: number): Promise<Post[]>;
  getFeedPosts(userId: number): Promise<Post[]>;
  deletePost(id: number): Promise<boolean>;
  likePost(postId: number, userId: number): Promise<PostLike>;
  unlikePost(postId: number, userId: number): Promise<boolean>;
  getPostLikes(postId: number): Promise<User[]>;
  commentOnPost(postId: number, userId: number, content: string): Promise<PostComment>;
  getPostComments(postId: number): Promise<PostComment[]>;
  
  // Story/Reel operations
  createStory(userId: number, mediaUrl: string, mediaType: string): Promise<Post>;
  getStories(userId: number): Promise<Post[]>;
  createReel(userId: number, mediaUrl: string, mediaType: string, content?: string): Promise<Post>;
  getReels(userId: number): Promise<Post[]>;
  
  // Group operations
  createGroup(group: Omit<CollegeGroup, 'id' | 'created_at' | 'updated_at'>): Promise<CollegeGroup>;
  getGroup(id: number): Promise<CollegeGroup | undefined>;
  updateGroup(id: number, updates: Partial<CollegeGroup>): Promise<CollegeGroup | undefined>;
  deleteGroup(id: number): Promise<boolean>;
  addGroupMember(groupId: number, userId: number, isAdmin?: boolean): Promise<GroupMember>;
  removeGroupMember(groupId: number, userId: number): Promise<boolean>;
  getGroupMembers(groupId: number): Promise<User[]>;
  getGroupAdmins(groupId: number): Promise<User[]>;
  addPostToGroup(groupId: number, postId: number): Promise<GroupPost>;
  getGroupPosts(groupId: number): Promise<Post[]>;
  getUserGroups(userId: number): Promise<CollegeGroup[]>;
  
  // Chat operations
  createChatRoom(isGroup: boolean, name?: string): Promise<ChatRoom>;
  addChatParticipant(roomId: number, userId: number): Promise<ChatParticipant>;
  removeChatParticipant(roomId: number, userId: number): Promise<boolean>;
  getChatParticipants(roomId: number): Promise<User[]>;
  getUserChatRooms(userId: number): Promise<ChatRoom[]>;
  sendChatMessage(roomId: number, senderId: number, content: string, mediaUrl?: string, mediaType?: string): Promise<ChatMessage>;
  getChatMessages(roomId: number): Promise<ChatMessage[]>;
  markMessageAsRead(messageId: number): Promise<boolean>;
  
  // Notification operations
  createNotification(notification: Omit<Notification, 'id' | 'created_at'>): Promise<Notification>;
  getUserNotifications(userId: number): Promise<Notification[]>;
  markNotificationAsRead(id: number): Promise<boolean>;
  deleteNotification(id: number): Promise<boolean>;
  
  // Job operations
  createJobListing(job: Omit<JobListing, 'id' | 'created_at' | 'updated_at'>): Promise<JobListing>;
  getJobListing(id: number): Promise<JobListing | undefined>;
  updateJobListing(id: number, updates: Partial<JobListing>): Promise<JobListing | undefined>;
  deleteJobListing(id: number): Promise<boolean>;
  getJobListings(filters?: { type?: string, location?: string }): Promise<JobListing[]>;
  applyForJob(jobId: number, userId: number, resumeUrl?: string, coverLetter?: string): Promise<JobApplication>;
  getJobApplications(jobId: number): Promise<JobApplication[]>;
  getUserApplications(userId: number): Promise<JobApplication[]>;
  updateApplicationStatus(id: number, status: string): Promise<JobApplication | undefined>;
  bookmarkJob(jobId: number, userId: number): Promise<JobBookmark>;
  unbookmarkJob(jobId: number, userId: number): Promise<boolean>;
  getUserBookmarkedJobs(userId: number): Promise<JobListing[]>;
  
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private followers: Map<number, Follower>;
  private blockedUsers: Map<number, BlockedUser>;
  private posts: Map<number, Post>;
  private postLikes: Map<number, PostLike>;
  private postComments: Map<number, PostComment>;
  private groups: Map<number, CollegeGroup>;
  private groupMembers: Map<number, GroupMember>;
  private groupPosts: Map<number, GroupPost>;
  private chatRooms: Map<number, ChatRoom>;
  private chatParticipants: Map<number, ChatParticipant>;
  private chatMessages: Map<number, ChatMessage>;
  private notifications: Map<number, Notification>;
  private jobListings: Map<number, JobListing>;
  private jobApplications: Map<number, JobApplication>;
  private jobBookmarks: Map<number, JobBookmark>;
  
  private userCurrentId: number;
  private followerCurrentId: number;
  private blockedUserCurrentId: number;
  private postCurrentId: number;
  private postLikeCurrentId: number;
  private postCommentCurrentId: number;
  private groupCurrentId: number;
  private groupMemberCurrentId: number;
  private groupPostCurrentId: number;
  private chatRoomCurrentId: number;
  private chatParticipantCurrentId: number;
  private chatMessageCurrentId: number;
  private notificationCurrentId: number;
  private jobListingCurrentId: number;
  private jobApplicationCurrentId: number;
  private jobBookmarkCurrentId: number;
  
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.followers = new Map();
    this.blockedUsers = new Map();
    this.posts = new Map();
    this.postLikes = new Map();
    this.postComments = new Map();
    this.groups = new Map();
    this.groupMembers = new Map();
    this.groupPosts = new Map();
    this.chatRooms = new Map();
    this.chatParticipants = new Map();
    this.chatMessages = new Map();
    this.notifications = new Map();
    this.jobListings = new Map();
    this.jobApplications = new Map();
    this.jobBookmarks = new Map();
    
    this.userCurrentId = 1;
    this.followerCurrentId = 1;
    this.blockedUserCurrentId = 1;
    this.postCurrentId = 1;
    this.postLikeCurrentId = 1;
    this.postCommentCurrentId = 1;
    this.groupCurrentId = 1;
    this.groupMemberCurrentId = 1;
    this.groupPostCurrentId = 1;
    this.chatRoomCurrentId = 1;
    this.chatParticipantCurrentId = 1;
    this.chatMessageCurrentId = 1;
    this.notificationCurrentId = 1;
    this.jobListingCurrentId = 1;
    this.jobApplicationCurrentId = 1;
    this.jobBookmarkCurrentId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }
  
  async getUserByFirebaseUID(firebaseUID: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.firebase_uid === firebaseUID
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const now = new Date();
    const user = {
      ...insertUser,
      id,
      created_at: now,
      updated_at: now
    } as unknown as User;
    
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { 
      ...user, 
      ...updates,
      updated_at: new Date() 
    } as User;
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async deleteUser(id: number): Promise<boolean> {
    if (!this.users.has(id)) return false;
    
    // Delete user and all related data
    this.users.delete(id);
    
    // Remove followers/following relationships
    for (const [fId, follower] of this.followers.entries()) {
      if (follower.follower_id === id || follower.following_id === id) {
        this.followers.delete(fId);
      }
    }
    
    // Remove blocks
    for (const [bId, block] of this.blockedUsers.entries()) {
      if (block.blocker_id === id || block.blocked_id === id) {
        this.blockedUsers.delete(bId);
      }
    }
    
    // Remove posts
    for (const [pId, post] of this.posts.entries()) {
      if (post.user_id === id) {
        this.posts.delete(pId);
        
        // Remove likes and comments for this post
        for (const [lId, like] of this.postLikes.entries()) {
          if (like.post_id === pId) {
            this.postLikes.delete(lId);
          }
        }
        
        for (const [cId, comment] of this.postComments.entries()) {
          if (comment.post_id === pId) {
            this.postComments.delete(cId);
          }
        }
      }
    }
    
    // Remove group memberships
    for (const [gmId, member] of this.groupMembers.entries()) {
      if (member.user_id === id) {
        this.groupMembers.delete(gmId);
      }
    }
    
    // Remove chat participants and messages
    for (const [cpId, participant] of this.chatParticipants.entries()) {
      if (participant.user_id === id) {
        this.chatParticipants.delete(cpId);
      }
    }
    
    for (const [cmId, message] of this.chatMessages.entries()) {
      if (message.sender_id === id) {
        this.chatMessages.delete(cmId);
      }
    }
    
    // Remove notifications
    for (const [nId, notification] of this.notifications.entries()) {
      if (notification.user_id === id || notification.sender_id === id) {
        this.notifications.delete(nId);
      }
    }
    
    // Remove job applications and bookmarks
    for (const [jaId, application] of this.jobApplications.entries()) {
      if (application.user_id === id) {
        this.jobApplications.delete(jaId);
      }
    }
    
    for (const [jbId, bookmark] of this.jobBookmarks.entries()) {
      if (bookmark.user_id === id) {
        this.jobBookmarks.delete(jbId);
      }
    }
    
    return true;
  }
  
  async getNearbyUsers(lat: number, lng: number, radius: number): Promise<User[]> {
    // Simple implementation based on Euclidean distance
    return Array.from(this.users.values()).filter(user => {
      if (!user.location_lat || !user.location_lng || !user.location_privacy) return false;
      
      const distance = Math.sqrt(
        Math.pow((user.location_lat - lat), 2) + 
        Math.pow((user.location_lng - lng), 2)
      ) * 111; // Rough conversion to km
      
      return distance <= radius;
    });
  }
  
  // Follower operations
  async followUser(followerId: number, followingId: number): Promise<Follower> {
    // Check if this follow relationship already exists
    const existingFollow = Array.from(this.followers.values()).find(
      f => f.follower_id === followerId && f.following_id === followingId
    );
    
    if (existingFollow) return existingFollow;
    
    const id = this.followerCurrentId++;
    const follower: Follower = {
      id,
      follower_id: followerId,
      following_id: followingId,
      created_at: new Date()
    };
    
    this.followers.set(id, follower);
    
    // Create notification for followed user
    this.createNotification({
      user_id: followingId,
      sender_id: followerId,
      type: 'follow',
      content: 'started following you',
      reference_id: followerId,
      is_read: false,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });
    
    return follower;
  }
  
  async unfollowUser(followerId: number, followingId: number): Promise<boolean> {
    const follower = Array.from(this.followers.values()).find(
      f => f.follower_id === followerId && f.following_id === followingId
    );
    
    if (!follower) return false;
    
    this.followers.delete(follower.id);
    return true;
  }
  
  async getFollowers(userId: number): Promise<User[]> {
    const followerIds = Array.from(this.followers.values())
      .filter(f => f.following_id === userId)
      .map(f => f.follower_id);
    
    return Array.from(this.users.values()).filter(user => followerIds.includes(user.id));
  }
  
  async getFollowing(userId: number): Promise<User[]> {
    const followingIds = Array.from(this.followers.values())
      .filter(f => f.follower_id === userId)
      .map(f => f.following_id);
    
    return Array.from(this.users.values()).filter(user => followingIds.includes(user.id));
  }
  
  // Block operations
  async blockUser(blockerId: number, blockedId: number): Promise<BlockedUser> {
    // Check if already blocked
    const existingBlock = Array.from(this.blockedUsers.values()).find(
      b => b.blocker_id === blockerId && b.blocked_id === blockedId
    );
    
    if (existingBlock) return existingBlock;
    
    const id = this.blockedUserCurrentId++;
    const block: BlockedUser = {
      id,
      blocker_id: blockerId,
      blocked_id: blockedId,
      created_at: new Date()
    };
    
    this.blockedUsers.set(id, block);
    
    // Remove any follow relationships
    this.unfollowUser(blockerId, blockedId);
    this.unfollowUser(blockedId, blockerId);
    
    return block;
  }
  
  async unblockUser(blockerId: number, blockedId: number): Promise<boolean> {
    const block = Array.from(this.blockedUsers.values()).find(
      b => b.blocker_id === blockerId && b.blocked_id === blockedId
    );
    
    if (!block) return false;
    
    this.blockedUsers.delete(block.id);
    return true;
  }
  
  async getBlockedUsers(userId: number): Promise<User[]> {
    const blockedIds = Array.from(this.blockedUsers.values())
      .filter(b => b.blocker_id === userId)
      .map(b => b.blocked_id);
    
    return Array.from(this.users.values()).filter(user => blockedIds.includes(user.id));
  }
  
  // Post operations
  async createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Promise<Post> {
    const id = this.postCurrentId++;
    const now = new Date();
    const newPost = {
      ...post,
      id,
      created_at: now,
      updated_at: now
    } as unknown as Post;
    
    this.posts.set(id, newPost);
    return newPost;
  }
  
  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }
  
  async getUserPosts(userId: number): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.user_id === userId && !post.is_story && !post.is_reel)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  
  async getFeedPosts(userId: number): Promise<Post[]> {
    // Get IDs of users being followed
    const followingIds = Array.from(this.followers.values())
      .filter(f => f.follower_id === userId)
      .map(f => f.following_id);
    
    // Get blocked users (both directions)
    const blockedIds = Array.from(this.blockedUsers.values())
      .filter(b => b.blocker_id === userId || b.blocked_id === userId)
      .map(b => b.blocker_id === userId ? b.blocked_id : b.blocker_id);
    
    // Get posts from followed users who aren't blocked
    return Array.from(this.posts.values())
      .filter(post => 
        (post.user_id === userId || followingIds.includes(post.user_id)) && 
        !blockedIds.includes(post.user_id) &&
        !post.is_story && 
        !post.is_reel &&
        (post.privacy === 'public' || post.user_id === userId || 
         (post.privacy === 'followers' && followingIds.includes(post.user_id)))
      )
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  
  async deletePost(id: number): Promise<boolean> {
    if (!this.posts.has(id)) return false;
    
    this.posts.delete(id);
    
    // Delete associated likes and comments
    for (const [lId, like] of this.postLikes.entries()) {
      if (like.post_id === id) {
        this.postLikes.delete(lId);
      }
    }
    
    for (const [cId, comment] of this.postComments.entries()) {
      if (comment.post_id === id) {
        this.postComments.delete(cId);
      }
    }
    
    // Remove from groups
    for (const [gpId, groupPost] of this.groupPosts.entries()) {
      if (groupPost.post_id === id) {
        this.groupPosts.delete(gpId);
      }
    }
    
    return true;
  }
  
  async likePost(postId: number, userId: number): Promise<PostLike> {
    // Check if already liked
    const existingLike = Array.from(this.postLikes.values()).find(
      like => like.post_id === postId && like.user_id === userId
    );
    
    if (existingLike) return existingLike;
    
    const id = this.postLikeCurrentId++;
    const like: PostLike = {
      id,
      post_id: postId,
      user_id: userId,
      created_at: new Date()
    };
    
    this.postLikes.set(id, like);
    
    // Create notification
    const post = await this.getPost(postId);
    if (post && post.user_id !== userId) {
      this.createNotification({
        user_id: post.user_id,
        sender_id: userId,
        type: 'post_like',
        content: 'liked your post',
        reference_id: postId,
        is_read: false,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      });
    }
    
    return like;
  }
  
  async unlikePost(postId: number, userId: number): Promise<boolean> {
    const like = Array.from(this.postLikes.values()).find(
      like => like.post_id === postId && like.user_id === userId
    );
    
    if (!like) return false;
    
    this.postLikes.delete(like.id);
    return true;
  }
  
  async getPostLikes(postId: number): Promise<User[]> {
    const userIds = Array.from(this.postLikes.values())
      .filter(like => like.post_id === postId)
      .map(like => like.user_id);
    
    return Array.from(this.users.values()).filter(user => userIds.includes(user.id));
  }
  
  async commentOnPost(postId: number, userId: number, content: string): Promise<PostComment> {
    const id = this.postCommentCurrentId++;
    const now = new Date();
    const comment: PostComment = {
      id,
      post_id: postId,
      user_id: userId,
      content,
      created_at: now,
      updated_at: now
    };
    
    this.postComments.set(id, comment);
    
    // Create notification
    const post = await this.getPost(postId);
    if (post && post.user_id !== userId) {
      this.createNotification({
        user_id: post.user_id,
        sender_id: userId,
        type: 'post_comment',
        content: 'commented on your post',
        reference_id: postId,
        is_read: false,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      });
    }
    
    return comment;
  }
  
  async getPostComments(postId: number): Promise<PostComment[]> {
    return Array.from(this.postComments.values())
      .filter(comment => comment.post_id === postId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }
  
  // Story/Reel operations
  async createStory(userId: number, mediaUrl: string, mediaType: string): Promise<Post> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Stories expire after 24 hours
    
    return this.createPost({
      user_id: userId,
      media_url: mediaUrl,
      media_type: mediaType,
      privacy: 'followers',
      is_story: true,
      is_reel: false,
      expires_at: expiresAt
    } as Omit<Post, 'id' | 'created_at' | 'updated_at'>);
  }
  
  async getStories(userId: number): Promise<Post[]> {
    // Get IDs of users being followed plus the user's own stories
    const followingIds = Array.from(this.followers.values())
      .filter(f => f.follower_id === userId)
      .map(f => f.following_id);
    followingIds.push(userId);
    
    // Get blocked users (both directions)
    const blockedIds = Array.from(this.blockedUsers.values())
      .filter(b => b.blocker_id === userId || b.blocked_id === userId)
      .map(b => b.blocker_id === userId ? b.blocked_id : b.blocker_id);
    
    const now = new Date();
    
    return Array.from(this.posts.values())
      .filter(post => 
        post.is_story && 
        followingIds.includes(post.user_id) && 
        !blockedIds.includes(post.user_id) &&
        post.expires_at && new Date(post.expires_at) > now
      )
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  
  async createReel(userId: number, mediaUrl: string, mediaType: string, content?: string): Promise<Post> {
    return this.createPost({
      user_id: userId,
      content,
      media_url: mediaUrl,
      media_type: mediaType,
      privacy: 'public',
      is_story: false,
      is_reel: true
    } as Omit<Post, 'id' | 'created_at' | 'updated_at'>);
  }
  
  async getReels(userId: number): Promise<Post[]> {
    // Get blocked users (both directions)
    const blockedIds = Array.from(this.blockedUsers.values())
      .filter(b => b.blocker_id === userId || b.blocked_id === userId)
      .map(b => b.blocker_id === userId ? b.blocked_id : b.blocker_id);
    
    return Array.from(this.posts.values())
      .filter(post => 
        post.is_reel && 
        !blockedIds.includes(post.user_id) &&
        (post.privacy === 'public' || 
         post.user_id === userId || 
         (post.privacy === 'followers' && Array.from(this.followers.values())
           .some(f => f.follower_id === userId && f.following_id === post.user_id)))
      )
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  
  // Group operations
  async createGroup(group: Omit<CollegeGroup, 'id' | 'created_at' | 'updated_at'>): Promise<CollegeGroup> {
    const id = this.groupCurrentId++;
    const now = new Date();
    const newGroup = {
      ...group,
      id,
      created_at: now,
      updated_at: now
    } as unknown as CollegeGroup;
    
    this.groups.set(id, newGroup);
    
    // Make creator an admin
    await this.addGroupMember(id, group.created_by, true);
    
    return newGroup;
  }
  
  async getGroup(id: number): Promise<CollegeGroup | undefined> {
    return this.groups.get(id);
  }
  
  async updateGroup(id: number, updates: Partial<CollegeGroup>): Promise<CollegeGroup | undefined> {
    const group = this.groups.get(id);
    if (!group) return undefined;
    
    const updatedGroup = {
      ...group,
      ...updates,
      updated_at: new Date()
    } as CollegeGroup;
    
    this.groups.set(id, updatedGroup);
    return updatedGroup;
  }
  
  async deleteGroup(id: number): Promise<boolean> {
    if (!this.groups.has(id)) return false;
    
    this.groups.delete(id);
    
    // Remove members
    for (const [gmId, member] of this.groupMembers.entries()) {
      if (member.group_id === id) {
        this.groupMembers.delete(gmId);
      }
    }
    
    // Remove group posts (but not the posts themselves)
    for (const [gpId, groupPost] of this.groupPosts.entries()) {
      if (groupPost.group_id === id) {
        this.groupPosts.delete(gpId);
      }
    }
    
    return true;
  }
  
  async addGroupMember(groupId: number, userId: number, isAdmin = false): Promise<GroupMember> {
    // Check if already a member
    const existingMember = Array.from(this.groupMembers.values()).find(
      member => member.group_id === groupId && member.user_id === userId
    );
    
    if (existingMember) {
      // Update admin status if different
      if (existingMember.is_admin !== isAdmin) {
        const updatedMember = { ...existingMember, is_admin: isAdmin };
        this.groupMembers.set(existingMember.id, updatedMember);
        return updatedMember;
      }
      return existingMember;
    }
    
    const id = this.groupMemberCurrentId++;
    const member: GroupMember = {
      id,
      group_id: groupId,
      user_id: userId,
      is_admin: isAdmin,
      created_at: new Date()
    };
    
    this.groupMembers.set(id, member);
    return member;
  }
  
  async removeGroupMember(groupId: number, userId: number): Promise<boolean> {
    const member = Array.from(this.groupMembers.values()).find(
      member => member.group_id === groupId && member.user_id === userId
    );
    
    if (!member) return false;
    
    this.groupMembers.delete(member.id);
    return true;
  }
  
  async getGroupMembers(groupId: number): Promise<User[]> {
    const userIds = Array.from(this.groupMembers.values())
      .filter(member => member.group_id === groupId)
      .map(member => member.user_id);
    
    return Array.from(this.users.values()).filter(user => userIds.includes(user.id));
  }
  
  async getGroupAdmins(groupId: number): Promise<User[]> {
    const adminIds = Array.from(this.groupMembers.values())
      .filter(member => member.group_id === groupId && member.is_admin)
      .map(member => member.user_id);
    
    return Array.from(this.users.values()).filter(user => adminIds.includes(user.id));
  }
  
  async addPostToGroup(groupId: number, postId: number): Promise<GroupPost> {
    // Check if post is already in the group
    const existingGroupPost = Array.from(this.groupPosts.values()).find(
      gp => gp.group_id === groupId && gp.post_id === postId
    );
    
    if (existingGroupPost) return existingGroupPost;
    
    const id = this.groupPostCurrentId++;
    const groupPost: GroupPost = {
      id,
      group_id: groupId,
      post_id: postId,
      created_at: new Date()
    };
    
    this.groupPosts.set(id, groupPost);
    return groupPost;
  }
  
  async getGroupPosts(groupId: number): Promise<Post[]> {
    const postIds = Array.from(this.groupPosts.values())
      .filter(gp => gp.group_id === groupId)
      .map(gp => gp.post_id);
    
    return Array.from(this.posts.values())
      .filter(post => postIds.includes(post.id))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  
  async getUserGroups(userId: number): Promise<CollegeGroup[]> {
    const groupIds = Array.from(this.groupMembers.values())
      .filter(member => member.user_id === userId)
      .map(member => member.group_id);
    
    return Array.from(this.groups.values()).filter(group => groupIds.includes(group.id));
  }
  
  // Chat operations
  async createChatRoom(isGroup: boolean, name?: string): Promise<ChatRoom> {
    const id = this.chatRoomCurrentId++;
    const now = new Date();
    const room: ChatRoom = {
      id,
      is_group: isGroup,
      name: name || null,
      created_at: now,
      updated_at: now
    };
    
    this.chatRooms.set(id, room);
    return room;
  }
  
  async addChatParticipant(roomId: number, userId: number): Promise<ChatParticipant> {
    // Check if already a participant
    const existingParticipant = Array.from(this.chatParticipants.values()).find(
      p => p.room_id === roomId && p.user_id === userId
    );
    
    if (existingParticipant) return existingParticipant;
    
    const id = this.chatParticipantCurrentId++;
    const participant: ChatParticipant = {
      id,
      room_id: roomId,
      user_id: userId,
      created_at: new Date()
    };
    
    this.chatParticipants.set(id, participant);
    return participant;
  }
  
  async removeChatParticipant(roomId: number, userId: number): Promise<boolean> {
    const participant = Array.from(this.chatParticipants.values()).find(
      p => p.room_id === roomId && p.user_id === userId
    );
    
    if (!participant) return false;
    
    this.chatParticipants.delete(participant.id);
    return true;
  }
  
  async getChatParticipants(roomId: number): Promise<User[]> {
    const userIds = Array.from(this.chatParticipants.values())
      .filter(p => p.room_id === roomId)
      .map(p => p.user_id);
    
    return Array.from(this.users.values()).filter(user => userIds.includes(user.id));
  }
  
  async getUserChatRooms(userId: number): Promise<ChatRoom[]> {
    const roomIds = Array.from(this.chatParticipants.values())
      .filter(p => p.user_id === userId)
      .map(p => p.room_id);
    
    return Array.from(this.chatRooms.values()).filter(room => roomIds.includes(room.id));
  }
  
  async sendChatMessage(roomId: number, senderId: number, content: string, mediaUrl?: string, mediaType?: string): Promise<ChatMessage> {
    const id = this.chatMessageCurrentId++;
    const message: ChatMessage = {
      id,
      room_id: roomId,
      sender_id: senderId,
      content: content || null,
      media_url: mediaUrl || null,
      media_type: mediaType || null,
      is_read: false,
      created_at: new Date()
    };
    
    this.chatMessages.set(id, message);
    
    // Create notifications for other participants
    const participants = await this.getChatParticipants(roomId);
    const room = await this.chatRooms.get(roomId);
    
    for (const participant of participants) {
      if (participant.id !== senderId) {
        this.createNotification({
          user_id: participant.id,
          sender_id: senderId,
          type: 'message',
          content: room?.is_group 
            ? `New message in ${room.name || 'group chat'}`
            : 'Sent you a message',
          reference_id: roomId,
          is_read: false,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        });
      }
    }
    
    return message;
  }
  
  async getChatMessages(roomId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.room_id === roomId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }
  
  async markMessageAsRead(messageId: number): Promise<boolean> {
    const message = this.chatMessages.get(messageId);
    if (!message) return false;
    
    const updatedMessage = { ...message, is_read: true };
    this.chatMessages.set(messageId, updatedMessage);
    return true;
  }
  
  // Notification operations
  async createNotification(notification: Omit<Notification, 'id' | 'created_at'>): Promise<Notification> {
    const id = this.notificationCurrentId++;
    const newNotification: Notification = {
      ...notification,
      id,
      created_at: new Date()
    };
    
    this.notifications.set(id, newNotification);
    return newNotification;
  }
  
  async getUserNotifications(userId: number): Promise<Notification[]> {
    const now = new Date();
    
    return Array.from(this.notifications.values())
      .filter(notification => 
        notification.user_id === userId && 
        (!notification.expires_at || new Date(notification.expires_at) > now)
      )
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  
  async markNotificationAsRead(id: number): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (!notification) return false;
    
    const updatedNotification = { ...notification, is_read: true };
    this.notifications.set(id, updatedNotification);
    return true;
  }
  
  async deleteNotification(id: number): Promise<boolean> {
    if (!this.notifications.has(id)) return false;
    
    this.notifications.delete(id);
    return true;
  }
  
  // Job operations
  async createJobListing(job: Omit<JobListing, 'id' | 'created_at' | 'updated_at'>): Promise<JobListing> {
    const id = this.jobListingCurrentId++;
    const now = new Date();
    const newJob = {
      ...job,
      id,
      created_at: now,
      updated_at: now
    } as unknown as JobListing;
    
    this.jobListings.set(id, newJob);
    return newJob;
  }
  
  async getJobListing(id: number): Promise<JobListing | undefined> {
    return this.jobListings.get(id);
  }
  
  async updateJobListing(id: number, updates: Partial<JobListing>): Promise<JobListing | undefined> {
    const job = this.jobListings.get(id);
    if (!job) return undefined;
    
    const updatedJob = {
      ...job,
      ...updates,
      updated_at: new Date()
    } as JobListing;
    
    this.jobListings.set(id, updatedJob);
    return updatedJob;
  }
  
  async deleteJobListing(id: number): Promise<boolean> {
    if (!this.jobListings.has(id)) return false;
    
    this.jobListings.delete(id);
    
    // Delete applications and bookmarks
    for (const [jaId, application] of this.jobApplications.entries()) {
      if (application.job_id === id) {
        this.jobApplications.delete(jaId);
      }
    }
    
    for (const [jbId, bookmark] of this.jobBookmarks.entries()) {
      if (bookmark.job_id === id) {
        this.jobBookmarks.delete(jbId);
      }
    }
    
    return true;
  }
  
  async getJobListings(filters?: { type?: string, location?: string }): Promise<JobListing[]> {
    let listings = Array.from(this.jobListings.values());
    
    if (filters) {
      if (filters.type) {
        listings = listings.filter(job => job.type === filters.type);
      }
      if (filters.location) {
        listings = listings.filter(job => 
          job.location && job.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
    }
    
    // Filter out expired listings
    const now = new Date();
    listings = listings.filter(job => !job.expires_at || new Date(job.expires_at) > now);
    
    return listings.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  
  async applyForJob(jobId: number, userId: number, resumeUrl?: string, coverLetter?: string): Promise<JobApplication> {
    // Check if already applied
    const existingApplication = Array.from(this.jobApplications.values()).find(
      app => app.job_id === jobId && app.user_id === userId
    );
    
    if (existingApplication) return existingApplication;
    
    const id = this.jobApplicationCurrentId++;
    const now = new Date();
    const application: JobApplication = {
      id,
      job_id: jobId,
      user_id: userId,
      resume_url: resumeUrl || null,
      cover_letter: coverLetter || null,
      status: 'applied',
      created_at: now,
      updated_at: now
    };
    
    this.jobApplications.set(id, application);
    
    // Create notification for recruiter
    const job = await this.getJobListing(jobId);
    if (job) {
      this.createNotification({
        user_id: job.recruiter_id,
        sender_id: userId,
        type: 'job_application',
        content: `Applied for ${job.title}`,
        reference_id: jobId,
        is_read: false,
        expires_at: null // Job applications don't expire
      });
    }
    
    return application;
  }
  
  async getJobApplications(jobId: number): Promise<JobApplication[]> {
    return Array.from(this.jobApplications.values())
      .filter(app => app.job_id === jobId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  
  async getUserApplications(userId: number): Promise<JobApplication[]> {
    return Array.from(this.jobApplications.values())
      .filter(app => app.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  
  async updateApplicationStatus(id: number, status: string): Promise<JobApplication | undefined> {
    const application = this.jobApplications.get(id);
    if (!application) return undefined;
    
    const updatedApplication = {
      ...application,
      status,
      updated_at: new Date()
    };
    
    this.jobApplications.set(id, updatedApplication);
    
    // Create notification for applicant
    const job = await this.getJobListing(application.job_id);
    if (job) {
      this.createNotification({
        user_id: application.user_id,
        sender_id: job.recruiter_id,
        type: 'application_update',
        content: `Your application for ${job.title} is now ${status}`,
        reference_id: application.job_id,
        is_read: false,
        expires_at: null // Status updates don't expire
      });
    }
    
    return updatedApplication;
  }
  
  async bookmarkJob(jobId: number, userId: number): Promise<JobBookmark> {
    // Check if already bookmarked
    const existingBookmark = Array.from(this.jobBookmarks.values()).find(
      bookmark => bookmark.job_id === jobId && bookmark.user_id === userId
    );
    
    if (existingBookmark) return existingBookmark;
    
    const id = this.jobBookmarkCurrentId++;
    const bookmark: JobBookmark = {
      id,
      job_id: jobId,
      user_id: userId,
      created_at: new Date()
    };
    
    this.jobBookmarks.set(id, bookmark);
    return bookmark;
  }
  
  async unbookmarkJob(jobId: number, userId: number): Promise<boolean> {
    const bookmark = Array.from(this.jobBookmarks.values()).find(
      bookmark => bookmark.job_id === jobId && bookmark.user_id === userId
    );
    
    if (!bookmark) return false;
    
    this.jobBookmarks.delete(bookmark.id);
    return true;
  }
  
  async getUserBookmarkedJobs(userId: number): Promise<JobListing[]> {
    const jobIds = Array.from(this.jobBookmarks.values())
      .filter(bookmark => bookmark.user_id === userId)
      .map(bookmark => bookmark.job_id);
    
    return Array.from(this.jobListings.values())
      .filter(job => jobIds.includes(job.id))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
}

export const storage = new MemStorage();
