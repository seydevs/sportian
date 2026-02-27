import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { usePlayers } from './usePlayers';

const PAGE_SIZE = 20;

type Status = 'idle' | 'loading' | 'loadingMore' | 'success' | 'error';

export const useInfinitePlayers = () => {
  const { data, isLoading, isError, error, refetch, isRefetching } =
    usePlayers();
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isLoadingMoreRef = useRef(false);

  const allItems = useMemo(() => data?.items || [], [data]);
  const totalItems = allItems.length;
  const totalItemsRef = useRef(totalItems);
  // Mantener el total de items sincronizado sin tocar refs en render
  useEffect(() => {
    totalItemsRef.current = totalItems;
  }, [totalItems]);

  const visibleItems = useMemo(() => {
    return allItems.slice(0, page * PAGE_SIZE);
  }, [allItems, page]);

  const hasNextPage = visibleItems.length < allItems.length;

  const fetchNextPage = useCallback(() => {
    if (!hasNextPage || isLoadingMoreRef.current) return;

    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);
    setTimeout(() => {
      setPage((prev) => {
        const nextPage = prev + 1;
        const maxPage = Math.ceil(totalItemsRef.current / PAGE_SIZE);
        return nextPage <= maxPage ? nextPage : prev;
      });
      isLoadingMoreRef.current = false;
      setIsLoadingMore(false);
    }, 500);
  }, [hasNextPage]);

  const status: Status = useMemo(() => {
    if (isLoading) return 'loading';
    if (isLoadingMore) return 'loadingMore';
    if (isError) return 'error';
    if (data) return 'success';
    return 'idle';
  }, [isLoading, isLoadingMore, isError, data]);

  return {
    data: { pages: [{ items: visibleItems }] },
    status,
    isLoading,
    isLoadingMore,
    isError,
    isRefetching,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
    totalItems,
    loadedItems: visibleItems.length,
  };
};
