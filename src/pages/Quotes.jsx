import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import QuoteCard from '../components/QuoteCard';
import api from '../services/api';

const Quotes = () => {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchQuotes();
    }
  }, [user]);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/quotes/byQuoter/${user.id}`);

      if (response.data.success) {
        setQuotes(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching quotes:', err);
      setError('Failed to load quotes');
    } finally {
      setLoading(false);
    }
  };

  const handleQuoteUpdated = (updatedQuote) => {
    setQuotes(prevQuotes =>
      prevQuotes.map(quote =>
        quote.uuid === updatedQuote.uuid ? { ...quote, ...updatedQuote } : quote
      )
    );
  };

  const handleQuoteDeleted = (quoteId) => {
    setQuotes(prevQuotes => prevQuotes.filter(quote => quote.uuid !== quoteId));
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#4b4b4b' }}>
          My Quotes
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {quotes.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No quotes found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You haven't submitted any quotes yet. Browse requirements to submit your first quote!
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {quotes.map((quote) => (
              <Grid item xs={12} md={6} lg={4} key={quote.uuid}>
                <QuoteCard
                  quote={quote}
                  onQuoteUpdated={handleQuoteUpdated}
                  onQuoteDeleted={handleQuoteDeleted}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Quotes;