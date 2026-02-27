import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

import './assets/styles/global.css';
import { App } from './App.tsx';
import { MuiProvider } from './shared/theme/muiProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos - datos frescos
      gcTime: 1000 * 60 * 60 * 24, // 24 horas - tiempo en cache
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'sportian-cache',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <BrowserRouter>
        <MuiProvider>
          <App />
        </MuiProvider>
      </BrowserRouter>
    </PersistQueryClientProvider>
  </StrictMode>
);
