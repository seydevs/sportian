import { useMemo } from 'react';
import { usePlayers } from './usePlayers';

export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  commonName: string;
  overallRating: number;
  position: {
    id: string;
    shortLabel: string;
    label: string;
  };
  avatarUrl: string;
  shieldUrl: string;
  nationality: {
    id: number;
    label: string;
    imageUrl: string;
  };
  team: {
    id: number;
    label: string;
    imageUrl: string;
  };
  stats: {
    pac: { value: number };
    sho: { value: number };
    pas: { value: number };
    dri: { value: number };
    def: { value: number };
    phy: { value: number };
  };
  height: number;
  weight: number;
  birthdate: string;
  foot: string;
  weakFootAbility: number;
  skillMoves: number;
}

export const usePlayer = (id: string | undefined) => {
  const { data, isLoading, isError, error, refetch } = usePlayers();

  const player = useMemo(() => {
    if (!data?.items || !id) return null;
    return data.items.find((p: Player) => p.id === Number(id)) || null;
  }, [data, id]);

  const isNotFound = Boolean(!isLoading && !isError && !player && id);

  return {
    player,
    isLoading,
    isError: isError || isNotFound,
    isNotFound,
    error,
    refetch,
  };
};
