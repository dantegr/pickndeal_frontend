import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box
} from '@mui/material';

const SubmitQuote = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Submit Quote
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quote submission functionality will be implemented soon. This will allow suppliers 
          to submit detailed quotes for customer requirements.
        </Typography>
      </Paper>
    </Container>
  );
};

export default SubmitQuote;