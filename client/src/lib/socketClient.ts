import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';

// API base URL - adjust this to match your backend URL
// Use local server in development, deployed app in production
const API_BASE_URL = import.meta.env.DEV 
  ? '' // Empty string means use relative URLs (same origin)
  : 'https://campusconnect-3hmf.onrender.com'; // Render deployed app

// Create a socket instance
let socket: Socket | null = null;

/**
 * Initialize the socket connection
 */
export const initializeSocket = (): Socket => {
  if (!socket) {
    socket = io(API_BASE_URL, {
      withCredentials: true,
      autoConnect: false, // Don't connect automatically, we'll do it manually
    });
  }
  return socket;
};

/**
 * Connect to the socket server and authenticate with user ID
 * @param userId The user ID to authenticate with
 */
export const connectSocket = (userId: number | string): void => {
  const socketInstance = initializeSocket();
  
  if (!socketInstance.connected) {
    socketInstance.connect();
    
    // Once connected, authenticate with the user ID
    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      socketInstance.emit('authenticate', userId);
    });
  } else if (socketInstance.connected) {
    // If already connected, just authenticate
    socketInstance.emit('authenticate', userId);
  }
};

/**
 * Disconnect from the socket server
 */
export const disconnectSocket = (): void => {
  if (socket && socket.connected) {
    socket.disconnect();
    console.log('Socket disconnected');
  }
};

/**
 * Get the socket instance
 * @returns The socket instance or null if not initialized
 */
export const getSocket = (): Socket | null => {
  return socket;
};

/**
 * Hook to use socket.io in React components
 * @returns The socket instance and connection status
 */
export const useSocket = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  
  useEffect(() => {
    const socketInstance = initializeSocket();
    
    // Set up event listeners
    const onConnect = () => {
      setIsConnected(true);
    };
    
    const onDisconnect = () => {
      setIsConnected(false);
    };
    
    socketInstance.on('connect', onConnect);
    socketInstance.on('disconnect', onDisconnect);
    
    // Set initial connection state
    setIsConnected(socketInstance.connected);
    
    // Clean up event listeners
    return () => {
      socketInstance.off('connect', onConnect);
      socketInstance.off('disconnect', onDisconnect);
    };
  }, []);
  
  return { socket, isConnected };
};