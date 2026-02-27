import { jest } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createTestQueryClient } from '../../hooks/__tests__/testUtils';
import { QueryClientProvider } from '@tanstack/react-query';
import { ListPlayers } from '../list';
import { mockPlayersResponse } from '../../hooks/__tests__/testUtils';

describe('ListPlayers', () => {
  let mockFetch: jest.MockedFunction<typeof fetch>;
  // Polyfill IntersectionObserver para el componente
  beforeAll(() => {
    if (!('IntersectionObserver' in globalThis)) {
      Object.defineProperty(globalThis, 'IntersectionObserver', {
        configurable: true,
        writable: true,
        value: class {
          constructor() {}
          observe() {}
          unobserve() {}
          disconnect() {}
        },
      });
    }
  });
  const renderWithProviders = (ui: React.ReactElement) => {
    const qc = createTestQueryClient();
    return render(
      <QueryClientProvider client={qc}>
        <MemoryRouter>{ui}</MemoryRouter>
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
    renderWithProviders(<ListPlayers />);

    expect(screen.getByText(/Cargando jugadores/i)).toBeInTheDocument();
  });

  it('muestra la lista en estado success', async () => {
    mockFetch.mockResolvedValue({
      json: async () => mockPlayersResponse,
    } as unknown as Response);

    renderWithProviders(<ListPlayers />);

    await waitFor(() => {
      expect(screen.getByText(/Jugadores/i)).toBeInTheDocument();
    });

    // Verifica que aparezcan nombres de jugadores renderizados por Card
    expect(await screen.findByText(/Messi/i)).toBeInTheDocument();
    expect(await screen.findByText(/Cristiano/i)).toBeInTheDocument();
  });

  it('muestra estado error y opción de reintentar', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    renderWithProviders(<ListPlayers />);

    await waitFor(() => {
      expect(
        screen.getByText(/Error al cargar los jugadores/i)
      ).toBeInTheDocument();
    });
    expect(screen.getByText(/Reintentar/i)).toBeInTheDocument();
  });
});
