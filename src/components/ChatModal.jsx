import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
  Box,
  Avatar,
  Paper,
  CircularProgress,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  Close,
  Send,
  Circle,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { useChatModal } from '../contexts/ChatModalContext';
import chatService from '../services/chat.service';
import { format } from 'date-fns';
import { useProfile } from '../contexts/ProfileContext';

const ChatModal = ({ open, onClose, receiver }) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { openChat, closeChat } = useChatModal();
  const { 
    isConnected, 
    sendMessage: socketSendMessage, 
    startTyping, 
    stopTyping, 
    subscribeToMessages,
    subscribeToTyping,
    subscribeToMessageSent,
    subscribeToMessageError,
    isUserOnline 
  } = useSocket();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatId, setChatId] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Manage chat modal context state
  useEffect(() => {
    if (open && receiver?.id) {
      openChat(receiver.id);
      loadChatHistory();
    } else if (!open) {
      closeChat();
    }
  }, [open, receiver?.id, openChat, closeChat]);

  // Load chat history when modal opens
  const loadChatHistory = async () => {
    setLoading(true);
    try {
      const response = await chatService.getChatHistory(receiver.id);
      if (response.success) {
        setMessages(response.data.messages || []);
        setChatId(response.data.chatId);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to socket events
  useEffect(() => {
    if (!open) return;

    // Handle incoming messages from other users
    const unsubscribeMessages = subscribeToMessages((data) => {
      if (data.senderId === receiver.id) {
        setMessages(prev => [...prev, data.message]);
      }
    });

    // Handle message sent confirmation
    const unsubscribeMessageSent = subscribeToMessageSent((data) => {
      // Replace temporary message with the confirmed one
      setMessages(prev => prev.map(msg => 
        msg._id === data.tempId ? data.message : msg
      ));
      if (!chatId && data.chatId) {
        setChatId(data.chatId);
      }
    });

    // Handle message errors
    const unsubscribeMessageError = subscribeToMessageError((data) => {
      // Remove the temporary message on error
      setMessages(prev => prev.filter(msg => msg._id !== data.tempId));
      console.error('Failed to send message:', data.error);
    });

    // Handle typing indicators
    const unsubscribeTyping = subscribeToTyping((data) => {
      if (data.userId === receiver.id) {
        setIsTyping(data.isTyping);
      }
    });

    return () => {
      unsubscribeMessages();
      unsubscribeMessageSent();
      unsubscribeMessageError();
      unsubscribeTyping();
    };
  }, [open, receiver?.id, chatId, subscribeToMessages, subscribeToMessageSent, subscribeToMessageError, subscribeToTyping]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !isConnected) return;

    const messageText = newMessage.trim();
    const tempId = `temp-${Date.now()}`;
    
    // Clear input immediately
    setNewMessage('');

    // Add message to local state immediately for better UX
    const tempMessage = {
      _id: tempId,
      sender: { _id: user.id, name: user.name, email: user.email },
      receiver: { _id: receiver.id, name: receiver.name, email: receiver.email },
      textContent: messageText,
      dateSent: new Date(),
      isRead: false,
      sending: true
    };
    setMessages(prev => [...prev, tempMessage]);

    // Send via Socket.io (which will also save to DB)
    const messageData = {
      textContent: messageText
    };
    
    socketSendMessage(messageData, receiver.id, tempId);
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    // Start typing indicator
    if (e.target.value && receiver?.id) {
      startTyping(receiver.id);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(receiver.id);
      }, 2000);
    } else if (!e.target.value && receiver?.id) {
      stopTyping(receiver.id);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    
    if (messageDate.toDateString() === today.toDateString()) {
      return format(messageDate, 'HH:mm');
    }
    return format(messageDate, 'dd/MM HH:mm');
  };

  const isOnline = receiver?.id && isUserOnline(receiver.id);

  const handleClose = () => {
    closeChat();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          height: '600px',
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={receiver?.image}
            sx={{ 
              width: 40, 
              height: 40,
              bgcolor: receiver?.avatarColor || '#2e42e2'
            }}
          >
            {!receiver?.image && receiver?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6" component="div">
              {receiver?.name || 'Chat'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Circle 
                sx={{ 
                  fontSize: 8, 
                  color: isOnline ? '#4caf50' : '#bdbdbd' 
                }} 
              />
              <Typography variant="caption" color="text.secondary">
                {isOnline ? 'Online' : 'Offline'}
              </Typography>
            </Box>
          </Box>
        </Box>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ 
        p: 2, 
        display: 'flex', 
        flexDirection: 'column',
        height: 'calc(100% - 140px)'
      }}>
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%' 
          }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ 
            flex: 1, 
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            {messages.length === 0 ? (
              <Box sx={{ 
                textAlign: 'center', 
                color: 'text.secondary',
                mt: 4
              }}>
                <Typography>No messages yet. Start the conversation!</Typography>
              </Box>
            ) : (
              messages.map((message) => {
                // Handle both ObjectId and string comparisons for sender ID
                let senderId;
                if (typeof message.sender === 'object' && message.sender !== null) {
                  // Sender is populated as an object
                  senderId = (message.sender._id || message.sender.id || '').toString();
                } else if (message.sender) {
                  // Sender is just an ID (string or ObjectId)
                  senderId = message.sender.toString();
                } else {
                  console.error('Message has no sender:', message);
                  senderId = '';
                }
                
                const currentUserId = (user.id || user._id || '').toString();
                const isSender = senderId === currentUserId;
                
                // Debug logging (remove in production)
                if (process.env.NODE_ENV === 'development' && message._id) {
                  console.log('Message:', message._id, {
                    senderId,
                    currentUserId,
                    isSender,
                    messageText: message.textContent?.substring(0, 20) + '...'
                  });
                }
                
                const avatarSrc = isSender ? profile?.avatarImage : receiver?.image;
                const avatarName = isSender ? user?.name : receiver?.name;
                const avatarColor = isSender ? '#2e42e2' : (receiver?.avatarColor || '#2e42e2');
                
                return (
                  <Box
                    key={message._id}
                    sx={{
                      display: 'flex',
                      justifyContent: isSender ? 'flex-end' : 'flex-start',
                      mb: 2
                    }}
                  >
                    <Paper
                      sx={{
                        p: 1.5,
                        maxWidth: '70%',
                        bgcolor: isSender ? '#2e42e2' : '#f5f5f5',
                        color: isSender ? 'white' : 'text.primary',
                        borderRadius: 2,
                        opacity: message.sending ? 0.7 : 1,
                        display: 'flex',
                        gap: 1.5,
                        alignItems: 'flex-start'
                      }}
                    >
                      <Avatar
                        sx={{ 
                          width: 32, 
                          height: 32,
                          bgcolor: avatarColor,
                          flexShrink: 0
                        }}
                        src={avatarSrc}
                      >
                        {!avatarSrc && avatarName?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                          {message.textContent}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            display: 'block',
                            mt: 0.5,
                            opacity: 0.8,
                            color: isSender ? 'white' : 'text.secondary'
                          }}
                        >
                          {formatMessageTime(message.dateSent)}
                          {message.sending && ' • Sending...'}
                        </Typography>
                      </Box>
                    </Paper>
                  </Box>
                );
              })
            )}
            {isTyping && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  {receiver?.name} is typing...
                </Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ 
        p: 2, 
        borderTop: '1px solid #e0e0e0',
        gap: 1
      }}>
        {!isConnected && (
          <Chip 
            label="Reconnecting..." 
            size="small" 
            color="warning" 
            sx={{ mr: 'auto' }}
          />
        )}
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={newMessage}
          onChange={handleTyping}
          onKeyPress={handleKeyPress}
          disabled={!isConnected || loading}
          size="small"
          multiline
          maxRows={3}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sending || !isConnected}
                  color="primary"
                >
                  <Send />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </DialogActions>
    </Dialog>
  );
};

export default ChatModal;