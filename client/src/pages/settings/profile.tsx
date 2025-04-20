import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useRealtime } from "@/hooks/use-realtime";
import { useProfileData, useUpdateProfile, profileUpdateSchema } from "@/hooks/use-profile";
import { updateRelatedQueries } from "@/lib/queryEnhancer";
import ProfileLayout from "@/components/layout/profile-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save, Upload } from "lucide-react";

// Form schema - using the schema from the hook
const profileFormSchema = profileUpdateSchema.extend({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  displayName: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Years of study options
const yearOptions = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "5th Year",
  "Graduate",
  "Alumni",
];

export default function ProfileSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  
  // Fetch current profile data
  const { 
    data: profile, 
    isLoading: isProfileLoading 
  } = useProfileData(undefined); // undefined means current user
  
  // Set up form with default values
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      displayName: "",
      bio: "",
      college: "",
      department: "",
      year: "",
    },
  });
  
  // Update form values when profile data is loaded
  useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username,
        displayName: profile.displayName,
        bio: profile.bio || "",
        college: profile.college || "",
        department: profile.department || "",
        year: profile.year || "",
      });
    }
  }, [profile, form]);
  
  // Profile update mutation using the hook
  const updateProfileMutation = useUpdateProfile();
  
  // Get real-time context
  const { isConnected } = useRealtime();
  
  // Handle form submission
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const updatedProfile = await updateProfileMutation.mutateAsync(data);
      
      // Update the cache with the new data
      queryClient.setQueryData(["/api/user"], updatedProfile);
      
      // Update all related queries to ensure UI is updated everywhere
      updateRelatedQueries(queryClient, "/api/user", [
        "/api/feed", 
        "/api/followers", 
        "/api/following"
      ]);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
        variant: isConnected ? "default" : "warning",
      });
      
      // If not connected to real-time updates, show a warning
      if (!isConnected) {
        toast({
          title: "Offline mode",
          description: "Changes may not be visible to others until you reconnect.",
          variant: "warning",
        });
      }
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };
  
  // Handle profile picture upload
  const handleUploadProfilePicture = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        
        try {
          setIsUploading(true);
          
          // Create a FormData object to send the file
          const formData = new FormData();
          formData.append('profile_picture', file);
          
          // Upload the file
          const response = await fetch('/api/user/profile-picture', {
            method: 'POST',
            body: formData,
            credentials: 'include',
          });
          
          if (!response.ok) {
            throw new Error('Failed to upload profile picture');
          }
          
          // Get the updated user data
          const data = await response.json();
          
          // Update the profile data in the cache
          queryClient.setQueryData(["/api/user"], data);
          
          // Update all related queries to ensure UI is updated everywhere
          updateRelatedQueries("/api/user", [
            "/api/feed", 
            "/api/followers", 
            "/api/following",
            "/api/messages"
          ]);
          
          toast({
            title: "Profile picture updated",
            description: "Your profile picture has been updated successfully.",
            variant: isConnected ? "default" : "warning",
          });
          
          // If not connected to real-time updates, show a warning
          if (!isConnected) {
            toast({
              title: "Offline mode",
              description: "Changes may not be visible to others until you reconnect.",
              variant: "warning",
            });
          }
        } catch (error: any) {
          toast({
            title: "Upload failed",
            description: error.message || "Failed to upload profile picture",
            variant: "destructive",
          });
        } finally {
          setIsUploading(false);
        }
      }
    };
    fileInput.click();
  };
  
  if (isProfileLoading) {
    return (
      <ProfileLayout title="Edit Profile">
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ProfileLayout>
    );
  }
  
  return (
    <ProfileLayout title="Edit Profile">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Update your profile information and how others see you on Campus Connect
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24 md:h-32 md:w-32 border-2 border-gray-200">
                  <AvatarImage src={user?.profile_picture || ""} alt={user?.username || ""} />
                  <AvatarFallback className="text-4xl">
                    {user?.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                
                <Button 
                  variant="outline" 
                  onClick={handleUploadProfilePicture}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  Change Photo
                </Button>
              </div>
              
              <div className="flex-1">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="username" {...field} />
                          </FormControl>
                          <FormDescription>
                            This is your public username. It must be unique.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormDescription>
                            This is your public display name.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us a little bit about yourself"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Your bio will be displayed on your profile.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="college"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>College</FormLabel>
                            <FormControl>
                              <Input placeholder="Your college" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department</FormLabel>
                            <FormControl>
                              <Input placeholder="Your department" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your year of study" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {yearOptions.map((year) => (
                                <SelectItem key={year} value={year}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto"
                      disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProfileLayout>
  );
}