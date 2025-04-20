import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, jsonb, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull(),
  phone: text("phone"),
  password: text("password").notNull(),
  firebase_uid: text("firebase_uid"),
  auth_type: text("auth_type").notNull().default("email"), // email, google, github, phone
  profile_picture: text("profile_picture"),
  full_name: text("full_name"),
  bio: text("bio"),
  college: text("college"),
  department: text("department"),
  year: text("year"),
  interests: text("interests"),
  location_lat: doublePrecision("location_lat"),
  location_lng: doublePrecision("location_lng"),
  location_privacy: boolean("location_privacy").default(true),
  account_privacy: boolean("account_privacy").default(false),
  dark_mode: boolean("dark_mode").default(false),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const followers = pgTable("followers", {
  id: serial("id").primaryKey(),
  follower_id: integer("follower_id").notNull().references(() => users.id),
  following_id: integer("following_id").notNull().references(() => users.id),
  created_at: timestamp("created_at").notNull().defaultNow(),
}, (table) => {
  return {
    unique_follow: primaryKey({ columns: [table.follower_id, table.following_id] }),
  };
});

export const blocked_users = pgTable("blocked_users", {
  id: serial("id").primaryKey(),
  blocker_id: integer("blocker_id").notNull().references(() => users.id),
  blocked_id: integer("blocked_id").notNull().references(() => users.id),
  created_at: timestamp("created_at").notNull().defaultNow(),
}, (table) => {
  return {
    unique_block: primaryKey({ columns: [table.blocker_id, table.blocked_id] }),
  };
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  content: text("content"),
  media_url: text("media_url"),
  media_type: text("media_type"), // image, video
  privacy: text("privacy").notNull().default("public"), // public, followers
  is_story: boolean("is_story").default(false),
  is_reel: boolean("is_reel").default(false),
  expires_at: timestamp("expires_at"), // for stories
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const post_likes = pgTable("post_likes", {
  id: serial("id").primaryKey(),
  post_id: integer("post_id").notNull().references(() => posts.id),
  user_id: integer("user_id").notNull().references(() => users.id),
  created_at: timestamp("created_at").notNull().defaultNow(),
}, (table) => {
  return {
    unique_like: primaryKey({ columns: [table.post_id, table.user_id] }),
  };
});

export const post_comments = pgTable("post_comments", {
  id: serial("id").primaryKey(),
  post_id: integer("post_id").notNull().references(() => posts.id),
  user_id: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const college_groups = pgTable("college_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  cover_image: text("cover_image"),
  college: text("college"),
  is_cross_college: boolean("is_cross_college").default(false),
  created_by: integer("created_by").notNull().references(() => users.id),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const group_members = pgTable("group_members", {
  id: serial("id").primaryKey(),
  group_id: integer("group_id").notNull().references(() => college_groups.id),
  user_id: integer("user_id").notNull().references(() => users.id),
  is_admin: boolean("is_admin").default(false),
  created_at: timestamp("created_at").notNull().defaultNow(),
}, (table) => {
  return {
    unique_member: primaryKey({ columns: [table.group_id, table.user_id] }),
  };
});

export const group_posts = pgTable("group_posts", {
  id: serial("id").primaryKey(),
  group_id: integer("group_id").notNull().references(() => college_groups.id),
  post_id: integer("post_id").notNull().references(() => posts.id),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const chat_rooms = pgTable("chat_rooms", {
  id: serial("id").primaryKey(),
  is_group: boolean("is_group").default(false),
  name: text("name"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const chat_participants = pgTable("chat_participants", {
  id: serial("id").primaryKey(),
  room_id: integer("room_id").notNull().references(() => chat_rooms.id),
  user_id: integer("user_id").notNull().references(() => users.id),
  created_at: timestamp("created_at").notNull().defaultNow(),
}, (table) => {
  return {
    unique_participant: primaryKey({ columns: [table.room_id, table.user_id] }),
  };
});

export const chat_messages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  room_id: integer("room_id").notNull().references(() => chat_rooms.id),
  sender_id: integer("sender_id").notNull().references(() => users.id),
  content: text("content"),
  media_url: text("media_url"),
  media_type: text("media_type"),
  is_read: boolean("is_read").default(false),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  sender_id: integer("sender_id").references(() => users.id),
  type: text("type").notNull(), // follow, message, nearby, post_like, post_comment, etc.
  content: text("content"),
  reference_id: integer("reference_id"), // post_id, user_id, etc. depending on the type
  is_read: boolean("is_read").default(false),
  created_at: timestamp("created_at").notNull().defaultNow(),
  expires_at: timestamp("expires_at"),
});

export const job_listings = pgTable("job_listings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  description: text("description").notNull(),
  location: text("location"),
  type: text("type").notNull(), // full-time, part-time, internship
  salary: text("salary"),
  requirements: text("requirements"),
  recruiter_id: integer("recruiter_id").notNull().references(() => users.id),
  is_verified: boolean("is_verified").default(false),
  attachment_url: text("attachment_url"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
  expires_at: timestamp("expires_at"),
});

export const job_applications = pgTable("job_applications", {
  id: serial("id").primaryKey(),
  job_id: integer("job_id").notNull().references(() => job_listings.id),
  user_id: integer("user_id").notNull().references(() => users.id),
  resume_url: text("resume_url"),
  cover_letter: text("cover_letter"),
  status: text("status").notNull().default("applied"), // applied, reviewed, interviewing, offered, rejected
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const job_bookmarks = pgTable("job_bookmarks", {
  id: serial("id").primaryKey(),
  job_id: integer("job_id").notNull().references(() => job_listings.id),
  user_id: integer("user_id").notNull().references(() => users.id),
  created_at: timestamp("created_at").notNull().defaultNow(),
}, (table) => {
  return {
    unique_bookmark: primaryKey({ columns: [table.job_id, table.user_id] }),
  };
});

// Create schemas for insertion and validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const loginUserSchema = z.object({
  username: z.string().min(3, "Username is required"),
  password: z.string().min(6, "Password is required"),
});

export const postSchema = createInsertSchema(posts).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const groupSchema = createInsertSchema(college_groups).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const jobListingSchema = createInsertSchema(job_listings).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Define export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type User = typeof users.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type CollegeGroup = typeof college_groups.$inferSelect;
export type JobListing = typeof job_listings.$inferSelect;
