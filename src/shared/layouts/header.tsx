import { memo, useCallback, useMemo } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

const logoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  cursor: 'pointer',
  mr: 4,
} as const;

const logoTextStyle = {
  fontWeight: 800,
  background: 'linear-gradient(90deg, #B0DA00 0%, #c4e633 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
} as const;

export const Header = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();

  const isPlayersActive = useMemo(
    () =>
      location.pathname === '/players' ||
      location.pathname.startsWith('/players/'),
    [location.pathname]
  );

  const handleLogoClick = useCallback(() => {
    navigate('/players');
  }, [navigate]);

  const handlePlayersClick = useCallback(() => {
    navigate('/players');
  }, [navigate]);

  const navButtonStyle = useMemo(
    () => ({
      color: isPlayersActive ? 'primary.main' : 'text.primary',
      fontWeight: isPlayersActive ? 700 : 400,
      borderBottom: isPlayersActive ? '2px solid' : 'none',
      borderColor: 'primary.main',
      borderRadius: 0,
      px: 2,
      '&:hover': {
        backgroundColor: 'transparent',
        color: 'primary.main',
      },
    }),
    [isPlayersActive]
  );

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 1 }}>
          <Box sx={logoStyle} onClick={handleLogoClick}>
            <SportsSoccerIcon sx={{ color: 'primary.main', fontSize: 32 }} />
            <Typography variant="h5" sx={logoTextStyle}>
              SPORTIAN
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
            <Button onClick={handlePlayersClick} sx={navButtonStyle}>
              Jugadores
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              FC 25 Ratings
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
});

Header.displayName = 'Header';
