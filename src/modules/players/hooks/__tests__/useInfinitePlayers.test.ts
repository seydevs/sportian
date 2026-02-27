import { jest } from '@jest/globals';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useInfinitePlayers } from '../useInfinitePlayers';
import { createWrapper, mockPlayer } from './testUtils';
let mockFetch: jest.MockedFunction<typeof fetch>;
beforeEach(() => {
  mockFetch = jest.fn() as unknown as jest.MockedFunction<typeof fetch>;
  Object.defineProperty(globalThis, 'fetch', {
    value: mockFetch as unknown as typeof fetch,
    configurable: true,
    writable: true,
  });
});

// Create 50 mock players for pagination testing
const createMockPlayers = (count: number) => ({
  items: Array.from({ length: count }, (_, i) => ({
    ...mockPlayer,
    id: i + 1,
    firstName: `Player${i + 1}`,
    lastName: `Last${i + 1}`,
  })),
});

describe('useInfinitePlayers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return loading state initially', () => {
    mockFetch.mockReturnValue(
      new Promise(() => {}) as unknown as ReturnType<typeof fetch>
    );

    const { result } = renderHook(() => useInfinitePlayers(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.status).toBe('loading');
  });

  it('should return first 20 items on success', async () => {
    mockFetch.mockResolvedValue({
      json: async () => createMockPlayers(50),
    } as unknown as Response);

    const { result } = renderHook(() => useInfinitePlayers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.status).toBe('success');
    expect(result.current.data.pages[0].items).toHaveLength(20);
    expect(result.current.loadedItems).toBe(20);
    expect(result.current.totalItems).toBe(50);
    expect(result.current.hasNextPage).toBe(true);
  });

  it('should load next page when fetchNextPage is called', async () => {
    mockFetch.mockResolvedValue({
      json: async () => createMockPlayers(50),
    } as unknown as Response);

    const { result } = renderHook(() => useInfinitePlayers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.loadedItems).toBe(20);

    act(() => {
      result.current.fetchNextPage();
    });

    expect(result.current.isLoadingMore).toBe(true);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current.isLoadingMore).toBe(false);
    });

    expect(result.current.loadedItems).toBe(40);
  });

  it('should not have next page when all items are loaded', async () => {
    mockFetch.mockResolvedValue({
      json: async () => createMockPlayers(15),
    } as unknown as Response);

    const { result } = renderHook(() => useInfinitePlayers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.loadedItems).toBe(15);
    expect(result.current.totalItems).toBe(15);
  });

  it('should return error state on failure', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useInfinitePlayers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.status).toBe('error');
  });

  it('should not fetch more when already loading', async () => {
    mockFetch.mockResolvedValue({
      json: async () => createMockPlayers(50),
    } as unknown as Response);

    const { result } = renderHook(() => useInfinitePlayers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.fetchNextPage();
      result.current.fetchNextPage(); // Second call should be ignored
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current.isLoadingMore).toBe(false);
    });

    // Should only have loaded one additional page
    expect(result.current.loadedItems).toBe(40);
  });

  it('should not fetch more when no next page', async () => {
    mockFetch.mockResolvedValue({
      json: async () => createMockPlayers(10),
    } as unknown as Response);

    const { result } = renderHook(() => useInfinitePlayers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const initialLoadedItems = result.current.loadedItems;

    act(() => {
      result.current.fetchNextPage();
    });

    // Should not change since there's no next page
    expect(result.current.loadedItems).toBe(initialLoadedItems);
  });
});
