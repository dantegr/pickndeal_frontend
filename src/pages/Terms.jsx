import React from 'react';
import { Container, Paper, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 5 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Terms and Conditions
        </Typography>
              
        <Box sx={{ '& > *': { mb: 4 } }}>
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>1. Acceptance of Terms</Typography>
            <Typography paragraph>
              By accessing and using Pick N Deal, you accept and agree to be bound by the terms and provision of this agreement.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" component="h2" gutterBottom>2. Use License</Typography>
            <Typography paragraph>Permission is granted to temporarily use Pick N Deal for business purposes only.</Typography>
          </Box>

          <Box>
            <Typography variant="h5" component="h2" gutterBottom>3. User Accounts</Typography>
            <Typography paragraph>
              When you create an account with us, you must provide accurate, complete, and current information.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" component="h2" gutterBottom>4. Business Conduct</Typography>
            <Typography paragraph>As a user of Pick N Deal, you agree to maintain professional conduct.</Typography>
          </Box>

          <Box>
            <Typography variant="h5" component="h2" gutterBottom>5. Contact Information</Typography>
            <Typography paragraph>
              If you have any questions about these Terms and Conditions, please contact us at:
            </Typography>
            <Typography>Email: legal@pickndeal.com</Typography>
            <Typography>Phone: +1 (555) 123-4567</Typography>
          </Box>

          <Typography color="text.secondary">
            Last Updated: {new Date().toLocaleDateString()}
          </Typography>

          <Button variant="contained" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Terms;