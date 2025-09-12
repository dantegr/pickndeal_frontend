import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.messageHandlers = new Set();
    this.typingHandlers = new Set();
    this.statusHandlers = new Set();
    this.messageSentHandlers = new Set();
    this.messageErrorHandlers = new Set();
    this.notificationHandlers = new Set();
  }

  connect(userId) {
    if (this.socket && this.isConnected) {
      console.log('Socket already connected');
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.error('No auth token found');
      return;
    }

    // Connect to the backend server
    this.socket = io('http://localhost:3001', {
      transports: ['websocket'],
      auth: {
        token: token,
        userId: userId
      }
    });

    this.setupEventListeners(userId);
  }

  setupEventListeners(userId) {
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.isConnected = true;
      
      // Store userId with socket for backend reference
      this.userId = userId;
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Listen for new messages
    this.socket.on('new_message', (data) => {
      console.log('New message received:', data);
      this.messageHandlers.forEach(handler => handler(data));
    });

    // Listen for typing indicators
    this.socket.on('user_typing', (data) => {
      console.log('User typing:', data);
      this.typingHandlers.forEach(handler => handler(data));
    });

    // Listen for user status updates
    this.socket.on('user_status', (data) => {
      console.log('User status update:', data);
      this.statusHandlers.forEach(handler => handler(data));
    });

    // Listen for message sent confirmation
    this.socket.on('message_sent', (data) => {
      console.log('Message sent confirmation:', data);
      this.messageSentHandlers.forEach(handler => handler(data));
    });

    // Listen for message errors
    this.socket.on('message_error', (data) => {
      console.error('Message error:', data);
      this.messageErrorHandlers.forEach(handler => handler(data));
    });

    // Listen for notification created events
    this.socket.on('notification_created', (data) => {
      console.log('Notification created:', data);
      this.notificationHandlers.forEach(handler => handler(data));
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('Socket disconnected manually');
    }
  }

  // Send a message
  sendMessage(message, receiverId, tempId) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return false;
    }

    this.socket.emit('send_message', {
      message,
      receiverId,
      senderId: this.userId,
      tempId // For matching temporary messages
    });
    return true;
  }

  // Start typing indicator
  startTyping(receiverId) {
    if (!this.socket || !this.isConnected) return;
    
    this.socket.emit('typing_start', {
      userId: this.userId,
      receiverId
    });
  }

  // Stop typing indicator
  stopTyping(receiverId) {
    if (!this.socket || !this.isConnected) return;
    
    this.socket.emit('typing_stop', {
      userId: this.userId,
      receiverId
    });
  }

  // Register message handler
  onMessage(handler) {
    this.messageHandlers.add(handler);
    
    // Return unsubscribe function
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  // Register typing handler
  onTyping(handler) {
    this.typingHandlers.add(handler);
    
    return () => {
      this.typingHandlers.delete(handler);
    };
  }

  // Register status handler
  onUserStatus(handler) {
    this.statusHandlers.add(handler);
    
    return () => {
      this.statusHandlers.delete(handler);
    };
  }

  // Check if connected
  getConnectionStatus() {
    return this.isConnected;
  }

  // Get socket ID
  getSocketId() {
    return this.socket?.id || null;
  }

  // Register message sent handler
  onMessageSent(handler) {
    this.messageSentHandlers.add(handler);
    
    return () => {
      this.messageSentHandlers.delete(handler);
    };
  }

  // Register message error handler
  onMessageError(handler) {
    this.messageErrorHandlers.add(handler);
    
    return () => {
      this.messageErrorHandlers.delete(handler);
    };
  }

  // Register notification handler
  onNotificationCreated(handler) {
    this.notificationHandlers.add(handler);
    
    return () => {
      this.notificationHandlers.delete(handler);
    };
  }

  // Generic event listener
  on(event, handler) {
    if (event === 'notification_created') {
      return this.onNotificationCreated(handler);
    }
    // Add more event types as needed
    console.warn(`Unknown event type: ${event}`);
    return () => {};
  }
}

export default new SocketService();