import React from 'react';
import { Container, Paper, Typography, Box, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 5 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Privacy Policy
        </Typography>
              
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            1. Information We Collect
          </Typography>
          <Typography paragraph>
            We collect information you provide directly to us, such as when you create an account, 
            submit a requirement, provide a quote, or contact us for support.
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <li>Account information (name, email, phone number, business details)</li>
            <li>Business requirements and catalog information</li>
            <li>Communication data between retailers and suppliers</li>
            <li>Transaction and quotation history</li>
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            2. How We Use Your Information
          </Typography>
          <Typography paragraph>We use the information we collect to:</Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <li>Provide, maintain, and improve our services</li>
            <li>Connect retailers with suppliers and facilitate business transactions</li>
            <li>Send you technical notices, updates, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Monitor and analyze trends, usage, and activities</li>
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            3. Information Sharing
          </Typography>
          <Typography paragraph>
            We share your information only in the following circumstances:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <li>With other users as necessary to facilitate business connections</li>
            <li>With your consent or at your direction</li>
            <li>To comply with legal obligations</li>
            <li>To protect the rights, property, and safety of Pick N Deal and our users</li>
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            4. Data Security
          </Typography>
          <Typography paragraph>
            We implement appropriate technical and organizational measures to protect your personal 
            information against unauthorized access, alteration, disclosure, or destruction.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            5. Your Rights
          </Typography>
          <Typography paragraph>You have the right to:</Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <li>Access and receive a copy of your personal data</li>
            <li>Update or correct your information</li>
            <li>Delete your account and associated data</li>
            <li>Object to or restrict certain processing</li>
            <li>Data portability</li>
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            6. Contact Us
          </Typography>
          <Typography paragraph>
            If you have any questions about this Privacy Policy, please contact us at:
          </Typography>
          <Typography>Email: privacy@pickndeal.com</Typography>
          <Typography>Phone: +1 (555) 123-4567</Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            7. Changes to This Policy
          </Typography>
          <Typography paragraph>
            We may update this Privacy Policy from time to time. We will notify you of any changes 
            by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </Typography>
          <Typography color="text.secondary">
            Last Updated: {new Date().toLocaleDateString()}
          </Typography>
        </Box>

        <Box sx={{ mt: 5 }}>
          <Button variant="contained" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy;