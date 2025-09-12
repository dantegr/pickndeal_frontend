import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';
import { useChatModal } from './ChatModalContext';
import api from '../services/api';
import socketService from '../services/socket.service';

const NotificationContext = createContext(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { isConnected } = useSocket();
  const { isUserChatOpen } = useChatModal();
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch notifications when user logs in
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchNotifications();
    } else {
      // Clear notifications on logout
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, user]);

  // Listen for real-time notifications via socket
  useEffect(() => {
    if (isConnected && user?.id) {
      const unsubscribe = socketService.on('notification_created', (data) => {
        handleNotificationCreated(data);
      });

      return () => {
        if (unsubscribe && typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    }
  }, [isConnected, user]);

  const handleNotificationCreated = useCallback((data) => {
    const { notification, senderId } = data;
    
    // Check if notification type is chat and if the chat modal is open with the sender
    if (notification.type === 'chat') {
      // Use senderId from event data or from notification data
      const chatSenderId = senderId || notification.data?.senderId;
      
      // If chat modal is open with this sender, don't add to notifications
      if (chatSenderId && isUserChatOpen(chatSenderId)) {
        console.log('Chat modal is open with sender, skipping notification');
        return;
      }
    }
    
    // Add the notification if it's not from an open chat
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Optional: You can trigger additional UI feedback here
    // like a sound or a toast notification
    console.log('New notification received:', notification);
  }, [isUserChatOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/notifications/unread');
      setNotifications(response.data.data || []);
      setUnreadCount(response.data.totalCount || 0);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}`);
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, isRead: true } 
            : notif
        ).filter(notif => !notif.isRead === false) // Remove from unread list after marking as read
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      return true;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError(err.message);
      return false;
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      setNotifications([]); // Clear all unread notifications
      setUnreadCount(0);
      return true;
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      setError(err.message);
      return false;
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
      // Update unread count if the deleted notification was unread
      const notif = notifications.find(n => n._id === notificationId);
      if (notif && !notif.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      return true;
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError(err.message);
      return false;
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const refreshNotifications = () => {
    fetchNotifications();
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications,
    refreshNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;