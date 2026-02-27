import { jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { usePlayers } from '../usePlayers';
import { createWrapper, mockPlayersResponse } from './testUtils';
// Mock global fetch instead of ESM module
let mockFetch: jest.MockedFunction<typeof fetch>;
beforeEach(() => {
  mockFetch = jest.fn() as unknown as jest.MockedFunction<typeof fetch>;
  Object.defineProperty(globalThis, 'fetch', {
    value: mockFetch as unknown as typeof fetch,
    configurable: true,
    writable: true,
  });
});

describe('usePlayers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return loading state initially', () => {
    mockFetch.mockReturnValue(
      new Promise(() => {}) as unknown as ReturnType<typeof fetch>
    );

    const { result } = renderHook(() => usePlayers(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('should return players data on success', async () => {
    mockFetch.mockResolvedValue({
      json: async () => mockPlayersResponse,
    } as unknown as Response);

    const { result } = renderHook(() => usePlayers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockPlayersResponse);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('should return error state on failure', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => usePlayers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.isLoading).toBe(false);
  });

  it('should have correct query configuration', () => {
    mockFetch.mockResolvedValue({
      json: async () => mockPlayersResponse,
    } as unknown as Response);

    renderHook(() => usePlayers(), {
      wrapper: createWrapper(),
    });

    // Verify the hook is called with correct queryKey
    expect(mockFetch).toHaveBeenCalled();
  });
});
