import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser, insertUserSchema } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Helper function to generate username from email
async function generateUsername(email: string): Promise<string> {
  // Extract the part before @ in the email
  const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9_.]/g, '');
  
  // Check if the username exists
  const existingUser = await storage.getUserByUsername(baseUsername);
  if (!existingUser) {
    return baseUsername;
  }
  
  // If username exists, try adding numbers until we get a unique one
  let counter = 1;
  let username = `${baseUsername}${counter}`;
  
  while (await storage.getUserByUsername(username)) {
    counter++;
    username = `${baseUsername}${counter}`;
  }
  
  return username;
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "campus-connect-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Try to find user by username or email
        let user = await storage.getUserByUsername(username);
        if (!user) {
          user = await storage.getUserByEmail(username);
        }
        
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Email/Username & Password Registration
  app.post("/api/register", async (req, res, next) => {
    try {
      // Check if username is provided or generate from email
      let username = req.body.username;
      if (!username && req.body.email) {
        username = await generateUsername(req.body.email);
      }
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(req.body.email);
      if (existingEmail) {
        return res.status(400).json({ error: "Email already in use" });
      }

      // Create the user
      const user = await storage.createUser({
        ...req.body,
        username,
        password: await hashPassword(req.body.password),
        auth_type: req.body.auth_type || "email",
      });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error: any) {
      next(error);
    }
  });

  // Firebase Authentication
  app.post("/api/firebase-auth", async (req, res, next) => {
    try {
      const { firebase_uid, email, auth_type, full_name, profile_picture } = req.body;
      
      if (!firebase_uid || !email) {
        return res.status(400).json({ error: "Firebase UID and email are required" });
      }
      
      // Check if user already exists by firebase_uid
      let user = await storage.getUserByFirebaseUID(firebase_uid);
      
      if (user) {
        // User exists, log them in
        req.login(user, (err) => {
          if (err) return next(err);
          return res.status(200).json(user);
        });
      } else {
        // User doesn't exist, create a new account
        const username = await generateUsername(email);
        
        // Generate a random password for the user (they'll use Firebase for auth)
        const password = await hashPassword(randomBytes(16).toString('hex'));
        
        // Create the user
        user = await storage.createUser({
          username,
          email,
          password,
          firebase_uid,
          auth_type: auth_type || "google", // "google", "github", "phone"
          full_name,
          profile_picture,
        });
        
        req.login(user, (err) => {
          if (err) return next(err);
          res.status(201).json(user);
        });
      }
    } catch (error) {
      next(error);
    }
  });

  // Email/Password Login
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  // Logout
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  // Get Current User
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
  
  // Update User Profile
  app.patch("/api/user", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      const userId = req.user!.id;
      
      // If updating username, check if it's available
      if (req.body.username) {
        const existingUser = await storage.getUserByUsername(req.body.username);
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ error: "Username already taken" });
        }
      }
      
      // If updating email, check if it's available
      if (req.body.email) {
        const existingUser = await storage.getUserByEmail(req.body.email);
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ error: "Email already in use" });
        }
      }
      
      // Handle password update
      if (req.body.password) {
        req.body.password = await hashPassword(req.body.password);
      }
      
      const updatedUser = await storage.updateUser(userId, req.body);
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  });
  
  // Delete User Account
  app.delete("/api/user", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      const userId = req.user!.id;
      await storage.deleteUser(userId);
      
      req.logout((err) => {
        if (err) return next(err);
        res.sendStatus(200);
      });
    } catch (error) {
      next(error);
    }
  });
  
  // Suggest Usernames
  app.get("/api/suggest-usernames", async (req, res, next) => {
    const { username } = req.query;
    
    if (!username || typeof username !== "string") {
      return res.status(400).json({ error: "Username query parameter is required" });
    }
    
    try {
      const baseUsername = username.replace(/[^a-zA-Z0-9_.]/g, '');
      const suggestions: string[] = [];
      
      // Add some suggestions with numbers
      for (let i = 1; i <= 5; i++) {
        const suggestion = `${baseUsername}${i}`;
        const exists = await storage.getUserByUsername(suggestion);
        if (!exists) {
          suggestions.push(suggestion);
        }
      }
      
      // Add some suggestions with underscores
      const suggestion1 = `${baseUsername}_`;
      const suggestion2 = `_${baseUsername}`;
      
      const exists1 = await storage.getUserByUsername(suggestion1);
      const exists2 = await storage.getUserByUsername(suggestion2);
      
      if (!exists1) suggestions.push(suggestion1);
      if (!exists2) suggestions.push(suggestion2);
      
      res.json(suggestions);
    } catch (error) {
      next(error);
    }
  });
}
