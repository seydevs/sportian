import { jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { usePlayer } from '../usePlayer';
import { createWrapper, mockPlayersResponse, mockPlayer } from './testUtils';
let mockFetch: jest.MockedFunction<typeof fetch>;
beforeEach(() => {
  mockFetch = jest.fn() as unknown as jest.MockedFunction<typeof fetch>;
  Object.defineProperty(globalThis, 'fetch', {
    value: mockFetch as unknown as typeof fetch,
    configurable: true,
    writable: true,
  });
});

describe('usePlayer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return loading state initially', () => {
    mockFetch.mockReturnValue(
      new Promise(() => {}) as unknown as ReturnType<typeof fetch>
    );

    const { result } = renderHook(() => usePlayer('1'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.player).toBeNull();
  });

  it('should return player when found', async () => {
    mockFetch.mockResolvedValue({
      json: async () => mockPlayersResponse,
    } as unknown as Response);

    const { result } = renderHook(() => usePlayer('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.player).toEqual(mockPlayer);
    expect(result.current.isError).toBe(false);
    expect(result.current.isNotFound).toBe(false);
  });

  it('should return isNotFound when player does not exist', async () => {
    mockFetch.mockResolvedValue({
      json: async () => mockPlayersResponse,
    } as unknown as Response);

    const { result } = renderHook(() => usePlayer('999'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.player).toBeNull();
    expect(result.current.isNotFound).toBe(true);
    expect(result.current.isError).toBe(true);
  });

  it('should return null when id is undefined', async () => {
    mockFetch.mockResolvedValue({
      json: async () => mockPlayersResponse,
    } as unknown as Response);

    const { result } = renderHook(() => usePlayer(undefined), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.player).toBeNull();
  });

  it('should return error state on API failure', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => usePlayer('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.player).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should find correct player by id', async () => {
    mockFetch.mockResolvedValue({
      json: async () => mockPlayersResponse,
    } as unknown as Response);

    const { result } = renderHook(() => usePlayer('2'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.player?.id).toBe(2);
    expect(result.current.player?.firstName).toBe('Cristiano');
  });
});
