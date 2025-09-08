import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import socketService from '../services/socket.service';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      // Connect to socket when user is authenticated
      socketService.connect(user.id);
      setIsConnected(socketService.getConnectionStatus());

      // Set up status listener
      const unsubscribeStatus = socketService.onUserStatus((data) => {
        if (data.status === 'online') {
          setOnlineUsers(prev => [...new Set([...prev, data.userId])]);
        } else if (data.status === 'offline') {
          setOnlineUsers(prev => prev.filter(id => id !== data.userId));
        }
      });

      // Check connection status periodically
      const interval = setInterval(() => {
        setIsConnected(socketService.getConnectionStatus());
      }, 5000);

      return () => {
        clearInterval(interval);
        unsubscribeStatus();
        socketService.disconnect();
        setIsConnected(false);
      };
    } else if (!isAuthenticated) {
      // Disconnect socket when user logs out
      socketService.disconnect();
      setIsConnected(false);
      setOnlineUsers([]);
    }
  }, [isAuthenticated, user?.id]);

  const sendMessage = (message, receiverId, tempId) => {
    return socketService.sendMessage(message, receiverId, tempId);
  };

  const startTyping = (receiverId) => {
    socketService.startTyping(receiverId);
  };

  const stopTyping = (receiverId) => {
    socketService.stopTyping(receiverId);
  };

  const subscribeToMessages = (handler) => {
    return socketService.onMessage(handler);
  };

  const subscribeToTyping = (handler) => {
    return socketService.onTyping(handler);
  };

  const subscribeToMessageSent = (handler) => {
    return socketService.onMessageSent(handler);
  };

  const subscribeToMessageError = (handler) => {
    return socketService.onMessageError(handler);
  };

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  const value = {
    isConnected,
    onlineUsers,
    sendMessage,
    startTyping,
    stopTyping,
    subscribeToMessages,
    subscribeToTyping,
    subscribeToMessageSent,
    subscribeToMessageError,
    isUserOnline,
    socketService
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};