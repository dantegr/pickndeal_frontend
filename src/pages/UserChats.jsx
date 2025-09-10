import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  CircularProgress,
  Chip,
  Badge,
  IconButton,
  InputBase,
  alpha,
  styled
} from '@mui/material';
import { Search as SearchIcon, Message } from '@mui/icons-material';
import { format, formatDistanceToNow } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import chatService from '../services/chat.service';
import ChatModal from '../components/ChatModal';
import { toast } from 'react-toastify';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.grey[200], 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.grey[200], 0.25),
  },
  marginBottom: theme.spacing(2),
  width: '100%',
  border: '1px solid #e0e0e0',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#909097',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 1, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

const UserChats = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatModalOpen, setChatModalOpen] = useState(false);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    setLoading(true);
    try {
      const response = await chatService.getUserChats();
      console.log('Chat response:', response); // Debug log
      if (response.success) {
        setChats(response.data);
      } else {
        toast.error('Failed to load chats');
      }
    } catch (error) {
      console.error('Error loading chats:', error);
      toast.error('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = (chat) => {
    // Use the otherUser field if available, otherwise determine from lastMessage
    let otherParticipant = chat.otherUser;
    
    if (!otherParticipant && chat.lastMessage) {
      const currentUserId = user.id || user._id;
      const lastMessage = chat.lastMessage;
      
      // Check if current user is sender or receiver
      if (lastMessage.sender?._id === currentUserId || lastMessage.sender === currentUserId) {
        otherParticipant = lastMessage.receiver;
      } else {
        otherParticipant = lastMessage.sender;
      }
    }
    
    if (otherParticipant) {
      setSelectedChat({
        id: otherParticipant._id || otherParticipant,
        name: otherParticipant.name || 'Unknown User',
        email: otherParticipant.email || '',
        // Prioritize avatarImage from profile, then image from user model
        image: otherParticipant.avatarImage || otherParticipant.image || otherParticipant.profilePicture,
        avatarColor: otherParticipant.avatarColor || '#2e42e2'
      });
      setChatModalOpen(true);
    }
  };

  const handleCloseChatModal = () => {
    setChatModalOpen(false);
    setSelectedChat(null);
    // Reload chats to update last messages
    loadChats();
  };

  const formatLastMessageTime = (date) => {
    if (!date) return '';
    const messageDate = new Date(date);
    const now = new Date();
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return format(messageDate, 'HH:mm');
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else if (diffInHours < 168) { // Less than a week
      return format(messageDate, 'EEEE');
    } else {
      return format(messageDate, 'dd/MM/yyyy');
    }
  };

  const filteredChats = chats.filter(chat => {
    if (!searchQuery) return true;
    
    // Use otherUser if available
    const otherParticipant = chat.otherUser || 
      (chat.lastMessage ? 
        (chat.lastMessage.sender?._id === (user.id || user._id) ? 
          chat.lastMessage.receiver : chat.lastMessage.sender) : null);
    
    return otherParticipant?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           chat.lastMessage?.textContent?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Messages
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View and manage your conversations
        </Typography>
      </Box>

      <Paper elevation={1} sx={{ p: 3 }}>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>

        {filteredChats.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Message sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchQuery ? 'Try a different search term' : 'Start a conversation from a user profile or requirement'}
            </Typography>
          </Box>
        ) : (
          <List sx={{ width: '100%' }}>
            {filteredChats.map((chat, index) => {
              // Use otherUser if available, otherwise determine from lastMessage
              let otherParticipant = chat.otherUser;
              const currentUserId = user.id || user._id;
              
              if (!otherParticipant && chat.lastMessage) {
                const lastMessage = chat.lastMessage;
                if (lastMessage.sender?._id === currentUserId || lastMessage.sender === currentUserId) {
                  otherParticipant = lastMessage.receiver;
                } else {
                  otherParticipant = lastMessage.sender;
                }
              }
              
              if (!otherParticipant) return null;
              
              const unreadCount = chat.unreadCount || 0;
              const isLastMessageFromMe = chat.lastMessage && 
                (chat.lastMessage.sender?._id === currentUserId || chat.lastMessage.sender === currentUserId);

              return (
                <React.Fragment key={chat._id}>
                  {index > 0 && <Divider variant="inset" component="li" />}
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                      borderRadius: 1,
                      my: 0.5
                    }}
                    onClick={() => handleChatClick(chat)}
                  >
                    <ListItemAvatar>
                      <Badge
                        badgeContent={unreadCount}
                        color="error"
                        overlap="circular"
                        invisible={unreadCount === 0}
                      >
                        <Avatar
                          src={otherParticipant?.avatarImage || otherParticipant?.image || undefined}
                          sx={{
                            bgcolor: otherParticipant?.avatarColor || '#2e42e2',
                            width: 48,
                            height: 48
                          }}
                        >
                          {!(otherParticipant?.avatarImage || otherParticipant?.image) && otherParticipant?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" fontWeight={unreadCount > 0 ? 'bold' : 'normal'}>
                            {otherParticipant?.name || 'Unknown User'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatLastMessageTime(chat.lastMessage?.dateSent)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography
                            variant="body2"
                            color={unreadCount > 0 ? 'text.primary' : 'text.secondary'}
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              fontWeight: unreadCount > 0 ? 'medium' : 'normal'
                            }}
                          >
                            {isLastMessageFromMe && 'You: '}
                            {chat.lastMessage?.textContent || 'No messages yet'}
                          </Typography>
                          {otherParticipant?.userRole && (
                            <Chip
                              label={otherParticipant.userRole.role}
                              size="small"
                              sx={{ mt: 0.5, height: 20, textTransform: 'capitalize' }}
                              color={otherParticipant.userRole.role === 'supplier' ? 'primary' : 'secondary'}
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Paper>

      {selectedChat && (
        <ChatModal
          open={chatModalOpen}
          onClose={handleCloseChatModal}
          receiver={selectedChat}
        />
      )}
    </Container>
  );
};

export default UserChats;