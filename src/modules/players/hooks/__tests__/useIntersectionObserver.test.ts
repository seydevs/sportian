import { jest } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import { useIntersectionObserver } from '../useIntersectionObserver';

// Mock IntersectionObserver
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

let intersectionCallback: IntersectionObserverCallback;

const mockIntersectionObserver = jest.fn(
  (callback: IntersectionObserverCallback) => {
    intersectionCallback = callback;
    return {
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: mockDisconnect,
    } as unknown as IntersectionObserver;
  }
) as unknown as jest.Mock;

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: mockIntersectionObserver,
});

describe('useIntersectionObserver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a targetRef', () => {
    const { result } = renderHook(() => useIntersectionObserver());

    expect(result.current.targetRef).toBeDefined();
    expect(result.current.targetRef.current).toBeNull();
  });

  type Options = {
    threshold?: number;
    rootMargin?: string;
    onIntersect?: () => void;
  };
  type HookReturn = ReturnType<typeof useIntersectionObserver>;
  it('should keep ref usable with default options', () => {
    const { result, rerender } = renderHook<HookReturn, Options>(
      (props) => useIntersectionObserver(props),
      {
        initialProps: {},
      }
    );

    const mockElement = document.createElement('div');
    (
      result.current.targetRef as unknown as { current: HTMLDivElement | null }
    ).current = mockElement;

    act(() => {
      rerender({});
    });

    expect(result.current.targetRef.current).toBe(mockElement);
  });

  it('should create IntersectionObserver with custom options', () => {
    const { result, rerender } = renderHook<HookReturn, Options>(
      (props) => useIntersectionObserver(props),
      {
        initialProps: {},
      }
    );

    const mockElement = document.createElement('div');
    (
      result.current.targetRef as unknown as { current: HTMLDivElement | null }
    ).current = mockElement;

    rerender({ threshold: 0.5, rootMargin: '50px' });

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        threshold: 0.5,
        rootMargin: '50px',
      }
    );
  });

  it('should call onIntersect when element intersects', () => {
    const onIntersect = jest.fn();

    const { result, rerender } = renderHook<HookReturn, Options>(
      (props) => useIntersectionObserver(props),
      { initialProps: { onIntersect } }
    );

    const mockElement = document.createElement('div');
    (
      result.current.targetRef as unknown as { current: HTMLDivElement | null }
    ).current = mockElement;

    // Trigger effect by changing dependency
    rerender({ onIntersect, threshold: 0.2 });

    // Simulate intersection
    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(onIntersect).toHaveBeenCalled();
  });

  it('should not call onIntersect when element is not intersecting', () => {
    const onIntersect = jest.fn();

    const { result, rerender } = renderHook<HookReturn, Options>(
      (props) => useIntersectionObserver(props),
      { initialProps: { onIntersect } }
    );

    const mockElement = document.createElement('div');
    (
      result.current.targetRef as unknown as { current: HTMLDivElement | null }
    ).current = mockElement;

    // Trigger effect by changing dependency
    rerender({ onIntersect, threshold: 0.2 });

    // Simulate non-intersection
    act(() => {
      intersectionCallback(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(onIntersect).not.toHaveBeenCalled();
  });

  it('should disconnect observer on unmount', () => {
    const { result, rerender, unmount } = renderHook<HookReturn, Options>(
      (props) => useIntersectionObserver(props),
      { initialProps: {} }
    );

    const mockElement = document.createElement('div');
    (
      result.current.targetRef as unknown as { current: HTMLDivElement | null }
    ).current = mockElement;

    // Trigger effect by changing dependency
    rerender({ threshold: 0.2 });

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('should update onIntersect callback when it changes', () => {
    const onIntersect1 = jest.fn();
    const onIntersect2 = jest.fn();

    const { result, rerender } = renderHook<HookReturn, Options>(
      (props) => useIntersectionObserver(props),
      { initialProps: { onIntersect: onIntersect1 } }
    );

    const mockElement = document.createElement('div');
    Object.defineProperty(result.current.targetRef, 'current', {
      value: mockElement,
      writable: true,
    });

    // First, create observer
    rerender({ onIntersect: onIntersect1, threshold: 0.2 });
    // Then update onIntersect callback
    rerender({ onIntersect: onIntersect2, threshold: 0.2 });

    // Simulate intersection
    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(onIntersect1).not.toHaveBeenCalled();
    expect(onIntersect2).toHaveBeenCalled();
  });
});
