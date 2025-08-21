import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import {
  AccessTime,
  LocationOn,
  Category,
  LocalOffer,
  Visibility,
  Send
} from '@mui/icons-material';

const RequirementCard = ({ requirement }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/requirements/view/${requirement.id}`);
  };

  const handleSubmitQuote = () => {
    navigate(`/quotes/submit/${requirement.id}`);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      open: 'success',
      pending: 'warning',
      closed: 'error',
      completed: 'info'
    };
    return statusColors[status] || 'default';
  };

  const getUrgencyColor = (urgency) => {
    const urgencyColors = {
      high: 'error',
      medium: 'warning',
      low: 'info'
    };
    return urgencyColors[urgency] || 'default';
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 'bold',
              color: '#4b4b4b',
              cursor: 'pointer',
              '&:hover': {
                color: '#2e42e2',
              },
            }}
            onClick={handleViewDetails}
          >
            {requirement.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Chip
              label={requirement.status}
              size="small"
              color={getStatusColor(requirement.status)}
            />
            {requirement.urgency && (
              <Chip
                label={requirement.urgency}
                size="small"
                color={getUrgencyColor(requirement.urgency)}
                variant="outlined"
              />
            )}
          </Box>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minHeight: '2.5em',
          }}
        >
          {requirement.description}
        </Typography>

        <Stack spacing={1.5}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Category sx={{ fontSize: 16, color: '#909097' }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {requirement.categories.slice(0, 3).map((category, index) => (
                <Chip
                  key={index}
                  label={category}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem', height: '20px' }}
                />
              ))}
              {requirement.categories.length > 3 && (
                <Typography variant="caption" color="text.secondary">
                  +{requirement.categories.length - 3} more
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOn sx={{ fontSize: 16, color: '#909097' }} />
            <Typography variant="body2" color="text.secondary">
              {requirement.location}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime sx={{ fontSize: 16, color: '#909097' }} />
            <Typography variant="body2" color="text.secondary">
              Delivery: {requirement.deliveryDate}
            </Typography>
          </Box>

          {requirement.budget && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalOffer sx={{ fontSize: 16, color: '#909097' }} />
              <Typography variant="body2" color="text.secondary">
                Budget: <strong>{requirement.budget}</strong>
              </Typography>
            </Box>
          )}
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Posted by: <strong>{requirement.postedBy}</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {requirement.quotesCount || 0} quotes received
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<Visibility />}
          onClick={handleViewDetails}
        >
          View Details
        </Button>
        {requirement.status === 'open' && (
          <Button
            size="small"
            variant="contained"
            startIcon={<Send />}
            onClick={handleSubmitQuote}
          >
            Submit Quote
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default RequirementCard;