import { createContext, ReactNode, useState, useEffect, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { auth } from "@/lib/firebase";
import {
  signInWithGoogle,
  signInWithGithub,
  signInWithEmail,
  signUpWithEmail,
  logOut,
  resetPassword,
  updateUserProfile,
} from "@/lib/firebase";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { User as AppUser, InsertUser } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

type AuthContextType = {
  firebaseUser: FirebaseUser | null;
  user: AppUser | null | undefined;
  isLoading: boolean;
  error: Error | null;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithUsername: (username: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  registerWithEmail: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  resetUserPassword: (email: string) => Promise<void>;
  updateProfile: (data: { displayName?: string, photoURL?: string }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [firebaseLoading, setFirebaseLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState<Error | null>(null);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setFirebaseUser(user);
        setFirebaseLoading(false);
      },
      (error) => {
        setFirebaseError(error as Error);
        setFirebaseLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // If we have a Firebase user, get the application user
  const {
    data: user,
    error,
    isLoading: isUserLoading,
    refetch: refetchUser
  } = useQuery<AppUser | null, Error>({
    queryKey: ["/api/user"],
    queryFn: async () => {
      if (!firebaseUser) return null;

      try {
        // First try to get the user directly
        const response = await apiRequest("GET", "/api/user");
        if (response.ok) {
          return await response.json();
        }

        // If that fails, we need to authenticate with Firebase
        const idToken = await firebaseUser.getIdToken();
        const registerResponse = await apiRequest("POST", "/api/firebase-auth", {
          firebase_uid: firebaseUser.uid,
          email: firebaseUser.email,
          auth_type: getAuthProvider(firebaseUser.providerData[0]?.providerId),
          full_name: firebaseUser.displayName,
          profile_picture: firebaseUser.photoURL,
        });

        if (!registerResponse.ok) {
          throw new Error("Failed to authenticate with server");
        }

        return await registerResponse.json();
      } catch (err) {
        console.error("Error in user query:", err);
        return null;
      }
    },
    enabled: !!firebaseUser && !firebaseLoading,
    staleTime: 0, // Always consider data stale to ensure fresh data
  });

  // Helper to determine auth type from provider ID
  const getAuthProvider = (providerId?: string): string => {
    switch (providerId) {
      case "google.com":
        return "google";
      case "github.com":
        return "github";
      case "phone":
        return "phone";
      default:
        return "email";
    }
  };

  // Login with username
  const loginWithUsername = async (username: string, password: string) => {
    try {
      // First, try to get the user's email from the username
      const response = await apiRequest("POST", "/api/login", {
        username,
        password,
      });
      
      if (!response.ok) {
        throw new Error("Invalid username or password");
      }
      
      // Get the user data from the response
      const userData = await response.json();
      
      // Refresh user data in the cache
      queryClient.setQueryData(["/api/user"], userData);
      
      // Force a refetch to ensure we have the latest data
      await refetchUser();
      
      toast({
        title: "Login successful!",
        description: "Welcome back!",
      });
      
      // Redirect to home page after a short delay to ensure state is updated
      setTimeout(() => {
        setLocation("/home");
      }, 100);
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Login with email
  const loginWithEmail = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmail(email, password);
      
      // Establish session with our server
      const idToken = await userCredential.user.getIdToken();
      const response = await apiRequest("POST", "/api/firebase-auth", {
        firebase_uid: userCredential.user.uid,
        email: userCredential.user.email,
        auth_type: "email",
        full_name: userCredential.user.displayName,
        profile_picture: userCredential.user.photoURL,
      });
      
      if (!response.ok) {
        throw new Error("Failed to authenticate with server");
      }
      
      // Get the user data from the response
      const userData = await response.json();
      
      // Refresh user data in the cache
      queryClient.setQueryData(["/api/user"], userData);
      
      // Force a refetch to ensure we have the latest data
      await refetchUser();
      
      toast({
        title: "Login successful!",
        description: "Welcome back!",
      });
      
      // Redirect to home page after a short delay to ensure state is updated
      setTimeout(() => {
        setLocation("/home");
      }, 100);
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithGoogle();
      
      // Establish session with our server
      const idToken = await result.user.getIdToken();
      const response = await apiRequest("POST", "/api/firebase-auth", {
        firebase_uid: result.user.uid,
        email: result.user.email,
        auth_type: "google",
        full_name: result.user.displayName,
        profile_picture: result.user.photoURL,
      });
      
      if (!response.ok) {
        throw new Error("Failed to authenticate with server");
      }
      
      // Get the user data from the response
      const userData = await response.json();
      
      // Refresh user data in the cache
      queryClient.setQueryData(["/api/user"], userData);
      
      // Force a refetch to ensure we have the latest data
      await refetchUser();
      
      toast({
        title: "Login successful!",
        description: "Welcome back!",
      });
      
      // Redirect to home page after a short delay to ensure state is updated
      setTimeout(() => {
        setLocation("/home");
      }, 100);
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Login with GitHub
  const loginWithGithub = async () => {
    try {
      const result = await signInWithGithub();
      
      // Establish session with our server
      const idToken = await result.user.getIdToken();
      const response = await apiRequest("POST", "/api/firebase-auth", {
        firebase_uid: result.user.uid,
        email: result.user.email,
        auth_type: "github",
        full_name: result.user.displayName,
        profile_picture: result.user.photoURL,
      });
      
      if (!response.ok) {
        throw new Error("Failed to authenticate with server");
      }
      
      // Get the user data from the response
      const userData = await response.json();
      
      // Refresh user data in the cache
      queryClient.setQueryData(["/api/user"], userData);
      
      // Force a refetch to ensure we have the latest data
      await refetchUser();
      
      toast({
        title: "Login successful!",
        description: "Welcome back!",
      });
      
      // Redirect to home page after a short delay to ensure state is updated
      setTimeout(() => {
        setLocation("/home");
      }, 100);
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Register with email
  const registerWithEmail = async (email: string, password: string, username: string) => {
    try {
      const userCredential = await signUpWithEmail(email, password);
      
      // Create user on our backend
      const response = await apiRequest("POST", "/api/register", {
        username,
        email,
        password,
        firebase_uid: userCredential.user.uid,
        auth_type: "email",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }
      
      // Get the user data from the response
      const userData = await response.json();
      
      // Set user data in the cache
      queryClient.setQueryData(["/api/user"], userData);
      
      // Force a refetch to ensure we have the latest data
      await refetchUser();
      
      toast({
        title: "Registration successful!",
        description: "Your account has been created.",
      });
      
      // Redirect to home page after a short delay to ensure state is updated
      setTimeout(() => {
        setLocation("/home");
      }, 100);
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      // Logout from Firebase
      await logOut();
      
      // Logout from server
      await apiRequest("POST", "/api/logout");
      
      // Clear user data
      queryClient.setQueryData(["/api/user"], null);
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      
      // Redirect to auth page
      setLocation("/auth");
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Reset password
  const resetUserPassword = async (email: string) => {
    try {
      await resetPassword(email);
      toast({
        title: "Password reset email sent",
        description: "Check your email for a link to reset your password.",
      });
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Update profile
  const updateProfile = async (data: { displayName?: string, photoURL?: string }) => {
    try {
      if (!firebaseUser) throw new Error("Not authenticated");
      
      // Update Firebase profile
      await updateUserProfile(firebaseUser, data);
      
      // Update backend profile
      if (data.displayName) {
        await apiRequest("PATCH", "/api/user", {
          full_name: data.displayName,
        });
      }
      
      if (data.photoURL) {
        await apiRequest("PATCH", "/api/user", {
          profile_picture: data.photoURL,
        });
      }
      
      // Refresh user data
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Profile update failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Combine loading states
  const isLoading = firebaseLoading || (!!firebaseUser && isUserLoading);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        user: user === undefined ? null : user,
        isLoading,
        error: firebaseError || error,
        loginWithEmail,
        loginWithUsername,
        loginWithGoogle,
        loginWithGithub,
        registerWithEmail,
        logout,
        resetUserPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};