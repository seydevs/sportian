import { memo, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardMedia,
  Chip,
  Grid,
  Paper,
  Skeleton,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import { usePlayer } from '../hooks';

interface StatBarProps {
  label: string;
  shortLabel: string;
  value: number;
}

const getStatColor = (value: number) => {
  if (value >= 85) return '#B0DA00';
  if (value >= 75) return '#3b82f6';
  if (value >= 65) return '#f59e0b';
  return '#94a3b8';
};

const statBarContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  p: 1.5,
  borderRadius: 2,
  backgroundColor: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.05)',
} as const;

const StatBar = memo(({ label, shortLabel, value }: StatBarProps) => {
  const color = useMemo(() => getStatColor(value), [value]);

  const circleStyle = useMemo(
    () => ({
      width: 48,
      height: 48,
      borderRadius: '50%',
      backgroundColor: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#011528',
      fontWeight: 800,
      fontSize: '1rem',
    }),
    [color]
  );

  const barStyle = useMemo(
    () => ({
      width: `${value}%`,
      height: '100%',
      backgroundColor: color,
      borderRadius: 3,
    }),
    [value, color]
  );

  return (
    <Box sx={statBarContainerStyle}>
      <Box sx={circleStyle}>{value}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: '0.75rem' }}
        >
          {shortLabel}
        </Typography>
        <Typography variant="body1" fontWeight={600}>
          {label}
        </Typography>
      </Box>
      <Box
        sx={{
          flex: 2,
          height: 6,
          borderRadius: 3,
          backgroundColor: 'rgba(255,255,255,0.1)',
          overflow: 'hidden',
        }}
      >
        <Box sx={barStyle} />
      </Box>
    </Box>
  );
});

StatBar.displayName = 'StatBar';

const skeletonBgStyle = { bgcolor: 'rgba(255,255,255,0.1)' };
const skeletonItems = [0, 1, 2, 3, 4, 5];

const LoadingSkeleton = memo(() => (
  <Box>
    <Skeleton
      variant="text"
      width={100}
      height={40}
      sx={{ mb: 2, ...skeletonBgStyle }}
    />
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Skeleton
          variant="rectangular"
          height={350}
          sx={{ borderRadius: 3, ...skeletonBgStyle }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Skeleton variant="text" width="60%" height={50} sx={skeletonBgStyle} />
        <Skeleton
          variant="text"
          width="40%"
          height={30}
          sx={{ mb: 2, ...skeletonBgStyle }}
        />
        <Grid container spacing={2}>
          {skeletonItems.map((i) => (
            <Grid size={{ xs: 12, sm: 6 }} key={i}>
              <Skeleton
                variant="rectangular"
                height={70}
                sx={{ borderRadius: 2, ...skeletonBgStyle }}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  </Box>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

const errorAlertStyle = {
  backgroundColor: 'rgba(239, 68, 68, 0.1)',
  border: '1px solid rgba(239, 68, 68, 0.3)',
} as const;

const ErrorState = memo(
  ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <Box sx={{ py: 4 }}>
      <Alert
        severity="error"
        sx={errorAlertStyle}
        action={
          <Button
            color="inherit"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={onRetry}
            sx={{ color: '#ef4444' }}
          >
            Reintentar
          </Button>
        }
      >
        {message}
      </Alert>
    </Box>
  )
);

ErrorState.displayName = 'ErrorState';

function DetailPlayers() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { player, isLoading, isError, isNotFound, refetch } = usePlayer(id);

  const handleBack = useCallback(() => {
    navigate('/players');
  }, [navigate]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const fullName = useMemo(
    () =>
      player
        ? player.commonName || `${player.firstName} ${player.lastName}`
        : '',
    [player]
  );

  const ovrColor = useMemo(() => {
    if (!player) return '#f59e0b';
    if (player.overallRating >= 85) return '#B0DA00';
    if (player.overallRating >= 75) return '#3b82f6';
    return '#f59e0b';
  }, [player]);

  const playerAge = useMemo(() => {
    if (!player?.birthdate) return '-';
    return new Date().getFullYear() - new Date(player.birthdate).getFullYear();
  }, [player]);

  // Estado: Loading
  if (isLoading) {
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <CircularProgress size={24} />
          <Typography variant="h6" color="text.secondary">
            Cargando jugador...
          </Typography>
        </Box>
        <LoadingSkeleton />
      </Box>
    );
  }

  // Estado: Error - Jugador no encontrado
  if (isNotFound) {
    return (
      <Box>
        <IconButton onClick={handleBack} sx={{ mb: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <ErrorState message="Jugador no encontrado" onRetry={handleRetry} />
      </Box>
    );
  }

  // Estado: Error - Error de red
  if (isError) {
    return (
      <Box>
        <IconButton onClick={handleBack} sx={{ mb: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <ErrorState
          message="Error al cargar el jugador. Verifica tu conexión."
          onRetry={handleRetry}
        />
      </Box>
    );
  }

  // Estado: Success
  if (!player) return null;

  return (
    <Box>
      {/* Header con botón volver */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <IconButton
          onClick={handleBack}
          sx={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            '&:hover': { backgroundColor: 'rgba(176, 218, 0, 0.1)' },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={700}>
          Detalle del Jugador
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Imagen del jugador */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* OVR Badge */}
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 1,
                backgroundColor: ovrColor,
                color: '#011528',
                fontWeight: 800,
                fontSize: '1.5rem',
                width: 64,
                height: 64,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              }}
            >
              {player.overallRating}
            </Box>
            <CardMedia
              component="img"
              image={player.avatarUrl}
              alt={fullName}
              sx={{ height: 350, objectFit: 'cover', objectPosition: 'top' }}
            />
          </Card>

          {/* Info del equipo y nacionalidad */}
          <Paper
            sx={{
              p: 2.5,
              mt: 2,
              borderRadius: 3,
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              {player.team?.imageUrl && (
                <img
                  src={player.team.imageUrl}
                  alt={player.team.label}
                  width={44}
                />
              )}
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.75rem' }}
                >
                  Equipo
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {player.team?.label}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {player.nationality?.imageUrl && (
                <img
                  src={player.nationality.imageUrl}
                  alt={player.nationality.label}
                  width={36}
                />
              )}
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.75rem' }}
                >
                  Nacionalidad
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {player.nationality?.label}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Información del jugador */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Nombre y rating */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {fullName}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={player.position?.label}
                sx={{
                  backgroundColor: 'rgba(176, 218, 0, 0.15)',
                  color: '#B0DA00',
                  fontWeight: 600,
                  border: '1px solid rgba(176, 218, 0, 0.3)',
                }}
              />
              <Chip
                label={`Pie: ${player.foot}`}
                variant="outlined"
                size="small"
                sx={{ borderColor: 'rgba(255,255,255,0.2)' }}
              />
              <Chip
                label={`Skill: ${'★'.repeat(player.skillMoves)}`}
                variant="outlined"
                size="small"
                sx={{ borderColor: 'rgba(255,255,255,0.2)' }}
              />
              <Chip
                label={`Pie débil: ${'★'.repeat(player.weakFootAbility)}`}
                variant="outlined"
                size="small"
                sx={{ borderColor: 'rgba(255,255,255,0.2)' }}
              />
            </Box>
          </Box>

          {/* Atributos principales */}
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: '#B0DA00', fontWeight: 700, mb: 3 }}
            >
              Atributos Principales
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <StatBar
                  label="Ritmo"
                  shortLabel="PAC"
                  value={player.stats?.pac?.value || 0}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <StatBar
                  label="Tiro"
                  shortLabel="SHO"
                  value={player.stats?.sho?.value || 0}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <StatBar
                  label="Pase"
                  shortLabel="PAS"
                  value={player.stats?.pas?.value || 0}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <StatBar
                  label="Regate"
                  shortLabel="DRI"
                  value={player.stats?.dri?.value || 0}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <StatBar
                  label="Defensa"
                  shortLabel="DEF"
                  value={player.stats?.def?.value || 0}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <StatBar
                  label="Físico"
                  shortLabel="PHY"
                  value={player.stats?.phy?.value || 0}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Info adicional */}
          <Paper
            sx={{
              p: 3,
              mt: 2,
              borderRadius: 3,
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: '#B0DA00', fontWeight: 700, mb: 3 }}
            >
              Información Física
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{ color: '#B0DA00' }}
                  >
                    {player.height}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    cm
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{ color: '#B0DA00' }}
                  >
                    {player.weight}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    kg
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{ color: '#B0DA00' }}
                  >
                    {playerAge}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    años
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{ color: '#B0DA00' }}
                  >
                    {player.position?.shortLabel}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    posición
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export { DetailPlayers };
