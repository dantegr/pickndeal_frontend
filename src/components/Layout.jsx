import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Header from './Header';

const Layout = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', pt: 1 }}>
      <Header />
      <Container maxWidth="xl" sx={{ py: 4, px: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;