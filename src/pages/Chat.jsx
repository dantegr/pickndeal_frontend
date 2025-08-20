import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box
} from '@mui/material';

const Chat = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Chat Feature
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Chat functionality will be implemented soon. This will allow real-time messaging 
          between retailers and suppliers.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Chat;