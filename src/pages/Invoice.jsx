import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box
} from '@mui/material';

const Invoice = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Invoice Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Invoice generation and management features will be implemented soon.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Invoice;