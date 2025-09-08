import { useState, useRef, useEffect } from 'react';

interface PinchZoomState {
  scale: number;
  translateX: number;
  translateY: number;
}

export function usePinchZoom() {
  const [zoomState, setZoomState] = useState<PinchZoomState>({
    scale: 1,
    translateX: 0,
    translateY: 0
  });
  
  const [isZooming, setIsZooming] = useState(false);
  const lastDistance = useRef<number>(0);
  const lastCenter = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialZoomState = useRef<PinchZoomState>({ scale: 1, translateX: 0, translateY: 0 });

  const getDistance = (touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getCenter = (touch1: Touch, touch2: Touch) => {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    };
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      setIsZooming(true);
      lastDistance.current = getDistance(e.touches[0], e.touches[1]);
      lastCenter.current = getCenter(e.touches[0], e.touches[1]);
      initialZoomState.current = { ...zoomState };
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2 && isZooming) {
      e.preventDefault();
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const currentCenter = getCenter(e.touches[0], e.touches[1]);
      
      const scale = Math.max(0.5, Math.min(3, initialZoomState.current.scale * (currentDistance / lastDistance.current)));
      
      const deltaX = currentCenter.x - lastCenter.current.x;
      const deltaY = currentCenter.y - lastCenter.current.y;
      
      setZoomState({
        scale,
        translateX: initialZoomState.current.translateX + deltaX,
        translateY: initialZoomState.current.translateY + deltaY
      });
    }
  };

  const handleTouchEnd = () => {
    setIsZooming(false);
  };

  const resetZoom = () => {
    setZoomState({ scale: 1, translateX: 0, translateY: 0 });
  };

  const setupPinchZoom = (element: HTMLElement | null) => {
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  };

  return {
    zoomState,
    isZooming,
    setupPinchZoom,
    resetZoom
  };
}
