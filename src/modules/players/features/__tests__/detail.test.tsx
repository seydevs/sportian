import { jest } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  createTestQueryClient,
  mockPlayersResponse,
} from '../../hooks/__tests__/testUtils';
import { DetailPlayers } from '../detail';

describe('DetailPlayers', () => {
  let mockFetch: jest.MockedFunction<typeof fetch>;

  const renderAt = (path: string) => {
    const qc = createTestQueryClient();
    return render(
      <QueryClientProvider client={qc}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/players/:id" element={<DetailPlayers />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    mockFetch = jest.fn() as unknown as jest.MockedFunction<typeof fetch>;
    Object.defineProperty(globalThis, 'fetch', {
      value: mockFetch as unknown as typeof fetch,
      configurable: true,
      writable: true,
    });
    jest.clearAllMocks();
  });

  it('muestra estado loading', () => {
    mockFetch.mockReturnValue(
      new Promise(() => {}) as unknown as ReturnType<typeof fetch>
    );
    renderAt('/players/1');

    expect(screen.getByText(/Cargando jugador/i)).toBeInTheDocument();
  });

  it('muestra estado success con datos del jugador', async () => {
    mockFetch.mockResolvedValue({
      json: async () => mockPlayersResponse,
    } as unknown as Response);

    renderAt('/players/1');

    await waitFor(() => {
      // Título de la página de detalle
      expect(screen.getByText(/Detalle del Jugador/i)).toBeInTheDocument();
    });

    // Nombre mostrado (usa commonName si existe)
    expect(screen.getByText(/Messi/i)).toBeInTheDocument();
  });

  it('muestra estado error de red', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));
    renderAt('/players/1');

    await waitFor(() => {
      expect(
        screen.getByText(/Error al cargar el jugador/i)
      ).toBeInTheDocument();
    });
    expect(screen.getByText(/Reintentar/i)).toBeInTheDocument();
  });
});
