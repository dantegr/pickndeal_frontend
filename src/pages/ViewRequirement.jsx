import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Divider,
  Avatar,
  Button,
  Stack,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import {
  LocationOn,
  Category,
  CalendarToday,
  AttachMoney,
  Inventory,
  Person,
  Email,
  Phone,
  AccessTime,
  CheckCircle,
  ArrowBack,
  LocalOffer,
  Repeat,
  PriorityHigh,
  Description,
  FormatQuote,
  Business,
  CurrencyRupee,
  Chat,
  CheckCircleOutline
} from '@mui/icons-material';
import api from '../services/api';
import { toast } from 'react-toastify';
import ChatModal from '../components/ChatModal';
import { useAuth } from '../contexts/AuthContext';

const ViewRequirement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [requirement, setRequirement] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quotesLoading, setQuotesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [selectedQuoter, setSelectedQuoter] = useState(null);

  useEffect(() => {
    fetchRequirement();
  }, [id]);

  useEffect(() => {
    if (requirement?.uuid) {
      fetchQuotes();
    }
  }, [requirement]);

  const fetchRequirement = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/requirement/get/${id}`);
      setRequirement(response.data);
    } catch (err) {
      console.error('Error fetching requirement:', err);
      setError(err.response?.data?.message || 'Failed to load requirement details');
      toast.error('Failed to load requirement details');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuotes = async () => {
    try {
      setQuotesLoading(true);
      const response = await api.get(`/quotes/byRequirement/${requirement.uuid}`);
      setQuotes(response.data.data || []);
    } catch (err) {
      console.error('Error fetching quotes:', err);
      toast.error('Failed to load quotes');
    } finally {
      setQuotesLoading(false);
    }
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'CREATED': return 'default';
      case 'ACTIVE': return 'primary';
      case 'PROCESSING': return 'warning';
      case 'COMPLETED': return 'success';
      default: return 'default';
    }
  };

  const getUrgencyColor = (urgency) => {
    const urgencyColors = {
      high: 'error',
      medium: 'warning',
      low: 'info'
    };
    return urgencyColors[urgency] || 'default';
  };

  const getQuoteStateColor = (state) => {
    switch (state) {
      case 'SUBMITTED': return 'info';
      case 'ACCEPTED': return 'success';
      case 'REJECTED': return 'error';
      case 'PENDING': return 'warning';
      default: return 'default';
    }
  };

  const handleChatWithQuoter = (quote) => {
    // Set the selected quoter with their information
    setSelectedQuoter({
      id: quote.quoterId,
      name: quote.quoterName || 'Unknown Supplier',
      avatarImage: quote.avatarImage
    });
    setChatModalOpen(true);
  };

  const handleAcceptQuote = (quoteId) => {
    // Placeholder for accept functionality
    toast.info('Accept quote functionality coming soon!');
    console.log('Accept quote:', quoteId);
  };

  const isRequirementOwner = requirement?.postedBy?._id === user?.id;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/requirements')}
        >
          Back to Requirements
        </Button>
      </Container>
    );
  }

  if (!requirement) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">No requirement found</Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/requirements')}
          sx={{ mt: 2 }}
        >
          Back to Requirements
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBack />}
        onClick={() => navigate('/requirements')}
        sx={{ mb: 3 }}
      >
        Back to Requirements
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            {requirement.title}
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
            <Chip
              label={requirement.state || requirement.status}
              color={getStateColor(requirement.state || requirement.status)}
            />
            {requirement.recurring && (
              <Chip
                label="Recurring"
                color="secondary"
                icon={<Repeat />}
                variant="outlined"
              />
            )}
            {requirement.urgency && (
              <Chip
                label={requirement.urgency}
                color={getUrgencyColor(requirement.urgency)}
                icon={requirement.urgency === 'high' ? <PriorityHigh /> : null}
                variant="outlined"
              />
            )}
            <Chip
              label={`${requirement.quotesCount || 0} Quotes`}
              icon={<LocalOffer />}
              variant="outlined"
            />
          </Stack>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Posted By Information */}
        {requirement.postedBy && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar
                sx={{ width: 56, height: 56 }}
                src={requirement.postedByImage}
              >
                {!requirement.postedByImage && requirement.postedBy.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="medium">
                  {requirement.postedBy.name || requirement.postedByName}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                  {requirement.postedBy.email && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Email fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {requirement.postedBy.email}
                      </Typography>
                    </Box>
                  )}
                  {requirement.postedBy.phone_number && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Phone fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {requirement.postedBy.phone_number}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </Box>
          </Box>
        )}

        <Divider sx={{ mb: 4 }} />

        {/* Description Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Description color="primary" />
            <Typography variant="h6" color="primary">
              Description
            </Typography>
          </Box>
          <Typography variant="body1" paragraph sx={{ ml: 4 }}>
            {requirement.description || 'No description provided'}
          </Typography>
        </Box>

        {/* Details Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Details
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, ml: 2 }}>
            {requirement.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <LocationOn color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body2">
                    {requirement.location}
                  </Typography>
                </Box>
              </Box>
            )}

            {requirement.deliveryDate && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CalendarToday color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Delivery Date
                  </Typography>
                  <Typography variant="body2">
                    {requirement.recurring
                      ? `Every ${requirement.deliveryDate}`
                      : requirement.deliveryDate
                    }
                  </Typography>
                </Box>
              </Box>
            )}

            {requirement.budget && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AttachMoney color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Budget
                  </Typography>
                  <Typography variant="body2">
                    {requirement.budget}
                  </Typography>
                </Box>
              </Box>
            )}

            {requirement.createdAt && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AccessTime color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Posted On
                  </Typography>
                  <Typography variant="body2">
                    {new Date(requirement.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        {/* Products Section */}
        {requirement.products && requirement.products.length > 0 && (
          <>
            <Divider sx={{ mb: 4 }} />
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Inventory color="primary" />
                <Typography variant="h6" color="primary">
                  Products ({requirement.products.length})
                </Typography>
              </Box>
              <List sx={{ ml: 2 }}>
                {requirement.products.map((product, index) => (
                  <ListItem key={index} divider={index < requirement.products.length - 1}>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={product.name || 'Unnamed Product'}
                      secondary={`Quantity: ${product.quantity || 0} ${product.unit_of_measurement || ''}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </>
        )}

        {/* Categories Section */}
        {requirement.categories && requirement.categories.length > 0 && (
          <>
            <Divider sx={{ mb: 4 }} />
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Category color="primary" />
                <Typography variant="h6" color="primary">
                  Categories
                </Typography>
              </Box>
              <Stack direction="row" flexWrap="wrap" spacing={1} sx={{ ml: 4 }}>
                {requirement.categories.map((category, index) => (
                  <Chip
                    key={index}
                    label={category}
                    variant="outlined"
                    color="primary"
                  />
                ))}
              </Stack>
            </Box>
          </>
        )}
      </Paper>

      {/* Quotes Section */}
      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <FormatQuote color="primary" />
            <Typography variant="h5" color="primary" fontWeight="bold">
              Quotes ({quotes.length})
            </Typography>
          </Box>

          {quotesLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={4}>
              <CircularProgress />
            </Box>
          ) : quotes.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              No quotes have been submitted for this requirement yet.
            </Alert>
          ) : (
            <Stack spacing={2}>
              {quotes.map((quote, index) => (
                <Card key={quote._id || index} variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{ width: 40, height: 40 }}
                          src={quote.avatarImage}
                        >
                          {quote.quoterName?.charAt(0).toUpperCase() || 'Q'}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {quote.quoterName || 'Unknown Supplier'}
                          </Typography>
                          {quote.businessName && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Business fontSize="small" color="action" />
                              <Typography variant="caption" color="text.secondary">
                                {quote.businessName}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                      {quote.state && (
                        <Chip
                          label={quote.state}
                          size="small"
                          color={getQuoteStateColor(quote.state)}
                        />
                      )}
                    </Box>

                    {/* Quote Details */}
                    <Box sx={{ mb: 2 }}>
                      {quote.details && (
                        <Typography variant="body2" paragraph>
                          {quote.details}
                        </Typography>
                      )}

                      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mt: 2 }}>
                        {quote.proposedAmount && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AttachMoney fontSize="small" color="primary" />
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              Proposed Amount: {quote.proposedAmount} DKK
                            </Typography>
                          </Box>
                        )}
                        {quote.canDeliver !== undefined && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CheckCircle fontSize="small" color={quote.canDeliver ? "success" : "error"} />
                            <Typography variant="body2" color={quote.canDeliver ? "success.main" : "error.main"}>
                              {quote.canDeliver ? "Can Deliver" : "Cannot Deliver"}
                            </Typography>
                          </Box>
                        )}
                        {quote.deliveryDate && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarToday fontSize="small" color="action" />
                            <Typography variant="body2">
                              Delivery: {quote.deliveryDate}
                            </Typography>
                          </Box>
                        )}
                        {quote.validUntil && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTime fontSize="small" color="action" />
                            <Typography variant="body2">
                              Valid until: {new Date(quote.validUntil).toLocaleDateString()}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>

                    {/* Quote Products */}
                    {quote.products && quote.products.length > 0 && (
                      <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="caption" fontWeight="medium" color="text.secondary">
                          Products Quoted:
                        </Typography>
                        {quote.products.map((product, pIndex) => (
                          <Box key={pIndex} sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="body2">
                              {product.name} ({product.quantity} {product.unit})
                            </Typography>
                            {product.unitPrice && (
                              <Typography variant="body2" fontWeight="medium">
                                {product.unitPrice} DKK/unit
                              </Typography>
                            )}
                          </Box>
                        ))}
                      </Box>
                    )}

                    {/* Quote Submitted Date */}
                    {quote.createdAt && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                        Submitted on {new Date(quote.createdAt).toLocaleString()}
                      </Typography>
                    )}
                  </CardContent>

                  {/* Quote Actions */}
                  <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Chat />}
                      onClick={() => handleChatWithQuoter(quote)}
                      sx={{ mr: 1 }}
                    >
                      Chat
                    </Button>
                    {isRequirementOwner && quote.state !== 'ACCEPTED' && (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleOutline />}
                        onClick={() => handleAcceptQuote(quote._id || quote.uuid)}
                      >
                        Accept
                      </Button>
                    )}
                  </CardActions>
                </Card>
              ))}
            </Stack>
          )}
        </Box>
      </Paper>

      {/* Chat Modal */}
      {selectedQuoter && (
        <ChatModal
          open={chatModalOpen}
          onClose={() => {
            setChatModalOpen(false);
            setSelectedQuoter(null);
          }}
          receiver={selectedQuoter}
        />
      )}
    </Container>
  );
};

export default ViewRequirement;