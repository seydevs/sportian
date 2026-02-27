import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
    },
  });

export const createWrapper = () => {
  const queryClient = createTestQueryClient();
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export const mockPlayer = {
  id: 1,
  firstName: 'Lionel',
  lastName: 'Messi',
  commonName: 'Messi',
  overallRating: 93,
  position: {
    id: 'RW',
    shortLabel: 'RW',
    label: 'Right Winger',
  },
  avatarUrl: 'https://example.com/messi.jpg',
  shieldUrl: 'https://example.com/shield.jpg',
  nationality: {
    id: 1,
    label: 'Argentina',
    imageUrl: 'https://example.com/argentina.png',
  },
  team: {
    id: 1,
    label: 'Inter Miami',
    imageUrl: 'https://example.com/miami.png',
  },
  stats: {
    pac: { value: 85 },
    sho: { value: 90 },
    pas: { value: 91 },
    dri: { value: 95 },
    def: { value: 35 },
    phy: { value: 65 },
  },
  height: 170,
  weight: 72,
  birthdate: '1987-06-24',
  foot: 'Left',
  weakFootAbility: 4,
  skillMoves: 4,
};

export const mockPlayersResponse = {
  items: [
    mockPlayer,
    {
      ...mockPlayer,
      id: 2,
      firstName: 'Cristiano',
      lastName: 'Ronaldo',
      commonName: 'Ronaldo',
    },
    {
      ...mockPlayer,
      id: 3,
      firstName: 'Kylian',
      lastName: 'Mbappé',
      commonName: 'Mbappé',
    },
  ],
};
