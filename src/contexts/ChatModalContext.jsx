import React, { createContext, useContext, useState } from 'react';

const ChatModalContext = createContext(null);

export const useChatModal = () => {
  const context = useContext(ChatModalContext);
  if (!context) {
    throw new Error('useChatModal must be used within a ChatModalProvider');
  }
  return context;
};

export const ChatModalProvider = ({ children }) => {
  const [openChatUserId, setOpenChatUserId] = useState(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const openChat = (userId) => {
    setOpenChatUserId(userId);
    setIsChatModalOpen(true);
  };

  const closeChat = () => {
    setOpenChatUserId(null);
    setIsChatModalOpen(false);
  };

  const isUserChatOpen = (userId) => {
    return isChatModalOpen && openChatUserId === userId;
  };

  const value = {
    openChatUserId,
    isChatModalOpen,
    openChat,
    closeChat,
    isUserChatOpen,
  };

  return (
    <ChatModalContext.Provider value={value}>
      {children}
    </ChatModalContext.Provider>
  );
};

export default ChatModalContext;