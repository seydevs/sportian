import {
  Box,
  Typography,
  Container,
  Grid,
  Link,
  IconButton,
} from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        backgroundColor: '#010d1a',
        borderTop: '1px solid',
        borderColor: 'secondary.main',
      }}
    >
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Logo y descripción */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <SportsSoccerIcon sx={{ color: 'primary.main', fontSize: 28 }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: 'primary.main',
                }}
              >
                SPORTIAN
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Tu plataforma de estadísticas y ratings de jugadores de EA Sports
              FC.
            </Typography>
            {/* Social links */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                <YouTubeIcon />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                <XIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Links */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography
              variant="subtitle2"
              color="text.primary"
              sx={{ mb: 2, fontWeight: 600 }}
            >
              Navegación
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                href="/players"
                color="text.secondary"
                underline="hover"
                variant="body2"
              >
                Jugadores
              </Link>
              <Link
                href="#"
                color="text.secondary"
                underline="hover"
                variant="body2"
              >
                Rankings
              </Link>
              <Link
                href="#"
                color="text.secondary"
                underline="hover"
                variant="body2"
              >
                Equipos
              </Link>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, md: 2 }}>
            <Typography
              variant="subtitle2"
              color="text.primary"
              sx={{ mb: 2, fontWeight: 600 }}
            >
              Recursos
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                href="#"
                color="text.secondary"
                underline="hover"
                variant="body2"
              >
                API
              </Link>
              <Link
                href="#"
                color="text.secondary"
                underline="hover"
                variant="body2"
              >
                Documentación
              </Link>
              <Link
                href="#"
                color="text.secondary"
                underline="hover"
                variant="body2"
              >
                Soporte
              </Link>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="subtitle2"
              color="text.primary"
              sx={{ mb: 2, fontWeight: 600 }}
            >
              EA Sports FC 25
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Datos actualizados de ratings oficiales. Esta aplicación no está
              afiliada con EA Sports.
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* Copyright */}
      <Box
        sx={{ borderTop: '1px solid', borderColor: 'secondary.main', py: 3 }}
      >
        <Container maxWidth="xl">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Sportian. Todos los derechos
            reservados.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};
