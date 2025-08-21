import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  LocationOn,
  LocalShipping,
  Chat,
  Visibility
} from '@mui/icons-material';

const SupplierCard = ({ supplier }) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/user/public/profile/${supplier.id}`);
  };

  const handleChat = () => {
    navigate(`/user/chat/${supplier.id}/0`);
  };

  const getCategoryColor = (index) => {
    const colors = ['primary', 'secondary', 'error', 'warning', 'info', 'success'];
    return colors[index % colors.length];
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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              bgcolor: supplier.avatarColor || '#2e42e2',
              mr: 2,
            }}
            src={supplier.image}
          >
            {!supplier.image && supplier.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
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
              onClick={handleViewProfile}
            >
              {supplier.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {supplier.businessType}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {supplier.categories.slice(0, 4).map((category, index) => (
              <Chip
                key={index}
                label={category}
                size="small"
                color={getCategoryColor(index)}
                sx={{ fontSize: '0.75rem' }}
              />
            ))}
            {supplier.categories.length > 4 && (
              <Chip
                label={`+${supplier.categories.length - 4} more`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
              />
            )}
          </Box>
        </Box>

        <Stack spacing={1}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalShipping sx={{ fontSize: 16, color: '#909097' }} />
            <Typography variant="body2" color="text.secondary">
              Delivery Radius: <strong>{supplier.deliveryRadius || 0}</strong> KM
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOn sx={{ fontSize: 16, color: '#909097' }} />
            <Typography variant="body2" color="text.secondary">
              Distance: <strong>{supplier.distance || 'N/A'}</strong> KM
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ mt: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minHeight: '2.5em',
            }}
          >
            <LocationOn sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
            {supplier.address}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {supplier.rating && (
            <Typography variant="body2" color="text.secondary">
              ⭐ {supplier.rating}
            </Typography>
          )}
        </Box>
        <Box>
          <Tooltip title="View Profile">
            <IconButton
              size="small"
              color="primary"
              onClick={handleViewProfile}
            >
              <Visibility />
            </IconButton>
          </Tooltip>
          <Tooltip title="Chat">
            <IconButton
              size="small"
              color="primary"
              onClick={handleChat}
            >
              <Chat />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
};

export default SupplierCard;