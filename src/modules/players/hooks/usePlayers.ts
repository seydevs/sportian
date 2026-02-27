import { useQuery } from '@tanstack/react-query';
import { getPlayers } from '../../../services/players';

export const usePlayers = () => {
  return useQuery({
    queryKey: ['players'],
    queryFn: getPlayers,
    staleTime: 1000 * 60 * 5, // 5 min - datos considerados frescos
    gcTime: 1000 * 60 * 60 * 24, // 24h - mantener en cache
    networkMode: 'offlineFirst', // Usar cache primero, luego red
  });
};
