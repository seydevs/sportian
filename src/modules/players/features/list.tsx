import { useEffect, useRef, useMemo, useCallback, memo } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Skeleton,
  Alert,
  Button,
  Chip,
  LinearProgress,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useInfinitePlayers } from '../hooks';
import { Card } from '../../../shared/ui';

interface Player {
  id: number;
  firstName: string;
  lastName: string;
  overallRating: number;
  position: { shortLabel: string };
  avatarUrl: string;
}

const skeletonItems = Array.from({ length: 8 }, (_, i) => i);

const LoadingSkeleton = memo(() => (
  <Box>
    <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
    <Grid container spacing={2}>
      {skeletonItems.map((index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
          <Box
            sx={{
              p: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Skeleton
              variant="rectangular"
              height={200}
              sx={{ borderRadius: 1 }}
            />
            <Skeleton variant="text" width="80%" sx={{ mt: 1 }} />
            <Skeleton variant="text" width="40%" />
          </Box>
        </Grid>
      ))}
    </Grid>
  </Box>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

const ErrorState = memo(({ onRetry }: { onRetry: () => void }) => (
  <Box sx={{ py: 4 }}>
    <Alert
      severity="error"
      action={
        <Button
          color="inherit"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={onRetry}
        >
          Reintentar
        </Button>
      }
    >
      Error al cargar los jugadores. Verifica tu conexión a internet.
    </Alert>
  </Box>
));

ErrorState.displayName = 'ErrorState';

const PlayerCard = memo(({ player }: { player: Player }) => {
  const name = useMemo(
    () => `${player.firstName} ${player.lastName}`,
    [player.firstName, player.lastName]
  );

  return (
    <Card
      id={player.id}
      name={name}
      ovr={player.overallRating}
      position={player.position.shortLabel}
      image={player.avatarUrl}
    />
  );
});

PlayerCard.displayName = 'PlayerCard';

const LoadingMoreIndicator = memo(() => (
  <Box sx={{ width: '100%', maxWidth: 300 }}>
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      sx={{ mb: 1 }}
    >
      Cargando más jugadores...
    </Typography>
    <LinearProgress />
  </Box>
));

LoadingMoreIndicator.displayName = 'LoadingMoreIndicator';

function ListPlayers() {
  const {
    data,
    status,
    isLoading,
    isLoadingMore,
    isError,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    refetch,
    totalItems,
    loadedItems,
  } = useInfinitePlayers();
  const observerRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isLoadingMore) {
        fetchNextPage();
      }
    },
    [hasNextPage, fetchNextPage, isLoadingMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: '100px',
    });

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [handleIntersection]);

  const players = useMemo(
    () => data?.pages.flatMap((page) => page.items) || [],
    [data?.pages]
  );

  const statusLabel = useMemo(
    () => `${loadedItems} de ${totalItems}`,
    [loadedItems, totalItems]
  );

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <CircularProgress size={24} />
          <Typography variant="h6" color="text.secondary">
            Cargando jugadores...
          </Typography>
        </Box>
        <LoadingSkeleton />
      </Box>
    );
  }

  if (isError) {
    return <ErrorState onRetry={handleRetry} />;
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" component="h1">
            Jugadores
          </Typography>
          <Chip
            label={statusLabel}
            size="small"
            color={status === 'success' ? 'success' : 'default'}
          />
        </Box>
        {isRefetching && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={16} />
            <Typography variant="body2" color="text.secondary">
              Actualizando...
            </Typography>
          </Box>
        )}
      </Box>

      <Grid container spacing={2}>
        {players.map((player: Player) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={player.id}>
            <PlayerCard player={player} />
          </Grid>
        ))}
      </Grid>

      <Box
        ref={observerRef}
        sx={{
          py: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          minHeight: 80,
        }}
      >
        {isLoadingMore && <LoadingMoreIndicator />}
        {!hasNextPage && players.length > 0 && (
          <Chip
            label="Has visto todos los jugadores"
            color="primary"
            variant="outlined"
          />
        )}
      </Box>
    </Box>
  );
}

export { ListPlayers };
