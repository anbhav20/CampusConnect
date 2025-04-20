import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { connectSocket, disconnectSocket, getSocket } from '@/lib/socketClient';
import { useToast } from '@/hooks/use-toast';

// Define the context type
type RealtimeContextType = {
  isConnected: boolean;
  lastUpdate: Record<string, number>; // Track last update time for different resources
};

// Create the context with default values
const RealtimeContext = createContext<RealtimeContextType>({
  isConnected: false,
  lastUpdate: {},
});

// Provider component
export const RealtimeProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Record<string, number>>({});

  // Connect to socket when user is authenticated
  useEffect(() => {
    if (user?.id) {
      // Connect to socket
      connectSocket(user.id);
      
      const socket = getSocket();
      
      if (socket) {
        // Set up event listeners
        const onConnect = () => {
          setIsConnected(true);
          console.log('Connected to real-time server');
        };
        
        const onDisconnect = () => {
          setIsConnected(false);
          console.log('Disconnected from real-time server');
        };
        
        // Listen for profile updates
        const onProfileUpdate = (data: any) => {
          console.log('Profile updated:', data);
          // Update the cache with the new data
          queryClient.setQueryData(['/api/user'], data);
          // Then invalidate to ensure any other components get updated
          queryClient.invalidateQueries({ queryKey: ['/api/user'] });
          
          setLastUpdate(prev => ({
            ...prev,
            profile: Date.now()
          }));
        };
        
        // Listen for new messages
        const onNewMessage = (data: any) => {
          console.log('New message received:', data);
          // Invalidate chat queries
          queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
          
          setLastUpdate(prev => ({
            ...prev,
            messages: Date.now()
          }));
          
          // Show toast notification for new message if not in the current chat
          if (data.roomId !== window.location.pathname.split('/').pop()) {
            toast({
              title: `New message from ${data.sender.displayName}`,
              description: data.content.substring(0, 50) + (data.content.length > 50 ? '...' : ''),
            });
          }
        };
        
        // Listen for new notifications
        const onNewNotification = (data: any) => {
          console.log('New notification received:', data);
          // Invalidate notification queries
          queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
          
          setLastUpdate(prev => ({
            ...prev,
            notifications: Date.now()
          }));
          
          // Show toast notification
          toast({
            title: data.title,
            description: data.message,
          });
        };
        
        // Listen for post updates (new posts, likes, comments)
        const onPostUpdate = (data: any) => {
          console.log('Post update:', data);
          // Invalidate feed queries
          queryClient.invalidateQueries({ queryKey: ['/api/feed'] });
          
          setLastUpdate(prev => ({
            ...prev,
            posts: Date.now()
          }));
        };
        
        // Listen for follow/unfollow events
        const onFollowUpdate = (data: any) => {
          console.log('Follow update:', data);
          // Invalidate followers/following queries
          queryClient.invalidateQueries({ queryKey: ['/api/followers'] });
          queryClient.invalidateQueries({ queryKey: ['/api/following'] });
          
          setLastUpdate(prev => ({
            ...prev,
            followers: Date.now()
          }));
        };
        
        // Listen for errors
        const onError = (error: any) => {
          console.error('Socket error:', error);
          toast({
            title: 'Connection Error',
            description: error.message || 'Failed to connect to real-time server',
            variant: 'destructive',
          });
        };
        
        // Register event listeners
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('profile_update', onProfileUpdate);
        socket.on('new_message', onNewMessage);
        socket.on('notification', onNewNotification);
        socket.on('post_update', onPostUpdate);
        socket.on('follow_update', onFollowUpdate);
        socket.on('error', onError);
        
        // Set initial connection state
        setIsConnected(socket.connected);
        
        // Clean up event listeners on unmount
        return () => {
          socket.off('connect', onConnect);
          socket.off('disconnect', onDisconnect);
          socket.off('profile_update', onProfileUpdate);
          socket.off('new_message', onNewMessage);
          socket.off('notification', onNewNotification);
          socket.off('post_update', onPostUpdate);
          socket.off('follow_update', onFollowUpdate);
          socket.off('error', onError);
          
          // Disconnect socket
          disconnectSocket();
        };
      }
    } else {
      // Disconnect if user logs out
      disconnectSocket();
      setIsConnected(false);
    }
  }, [user?.id, queryClient, toast]);

  // Context value
  const value = {
    isConnected,
    lastUpdate,
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
};

// Hook to use the realtime context
export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};