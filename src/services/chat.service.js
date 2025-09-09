import api from './api';

class ChatService {
  // Get or create a chat between two users and fetch message history
  async getChatHistory(receiverId) {
    try {
      const response = await api.get(`/chat/history/${receiverId}`);
      return {
        success: true,
        data: {
          chatId: response.data.data?.chatId || response.data.chat?._id,
          messages: response.data.data?.messages || response.data.messages || [],
          chat: response.data.data?.chat || response.data.chat
        }
      };
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch chat history'
      };
    }
  }

  // Note: Message sending is handled via Socket.io, not REST API
  // This method is kept for potential future use or fallback

  // Get all chats for the current user
  async getUserChats() {
    try {
      const response = await api.get('/chat/list');
      return {
        success: true,
        data: response.data.chats || []
      };
    } catch (error) {
      console.error('Error fetching user chats:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch chats'
      };
    }
  }

  // Mark messages as read
  async markMessagesAsRead(chatId) {
    try {
      const response = await api.put(`/chat/${chatId}/read`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to mark messages as read'
      };
    }
  }

  // Get unread message count
  async getUnreadCount() {
    try {
      const response = await api.get('/chat/unread-count');
      return {
        success: true,
        data: response.data.count || 0
      };
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch unread count'
      };
    }
  }
}

export default new ChatService();