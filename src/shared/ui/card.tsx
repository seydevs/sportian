import { memo, useCallback, useMemo } from 'react';
import {
  Card as MuiCard,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  CardActionArea,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface CardProps {
  id: number;
  name: string;
  ovr: number;
  position: string;
  image: string;
}

const getOvrColor = (ovr: number) => {
  if (ovr >= 85) return '#B0DA00';
  if (ovr >= 75) return '#3b82f6';
  if (ovr >= 65) return '#f59e0b';
  return '#94a3b8';
};

const gradientStyle = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: '50%',
  background: 'linear-gradient(to top, #012134 0%, transparent 100%)',
} as const;

const positionChipStyle = {
  backgroundColor: 'rgba(176, 218, 0, 0.15)',
  color: '#B0DA00',
  fontWeight: 600,
  border: '1px solid rgba(176, 218, 0, 0.3)',
} as const;

export const Card = memo(({ id, name, ovr, position, image }: CardProps) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(`/players/${id}`);
  }, [navigate, id]);

  const ovrChipStyle = useMemo(
    () => ({
      backgroundColor: getOvrColor(ovr),
      color: '#011528',
      fontWeight: 800,
      minWidth: 40,
      ml: 1,
    }),
    [ovr]
  );

  return (
    <MuiCard sx={{ maxWidth: 280 }}>
      <CardActionArea onClick={handleClick}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="220"
            image={image}
            alt={name}
            sx={{
              objectFit: 'cover',
              objectPosition: 'top',
            }}
          />
          <Box sx={gradientStyle} />
        </Box>

        <CardContent sx={{ pt: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              noWrap
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                flex: 1,
              }}
            >
              {name}
            </Typography>
            <Chip label={ovr} size="small" sx={ovrChipStyle} />
          </Box>
          <Chip label={position} size="small" sx={positionChipStyle} />
        </CardContent>
      </CardActionArea>
    </MuiCard>
  );
});

Card.displayName = 'Card';
