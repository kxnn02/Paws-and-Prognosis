import { useState, useEffect, useRef } from 'react';
import { AppState } from 'react-native';

/**
 * Lightweight network status hook for Expo Go.
 * Checks connectivity on app foreground and at intervals.
 * Uses longer intervals when connected (60s) and shorter when disconnected (15s).
 */
export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const appState = useRef(AppState.currentState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function checkConnectivity() {
    setIsChecking(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      await fetch('https://www.google.com/generate_204', {
        method: 'HEAD',
        signal: controller.signal,
      });
      clearTimeout(timeout);
      setIsConnected(true);
    } catch {
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  }

  useEffect(() => {
    checkConnectivity();

    // Re-check when app comes to foreground
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        checkConnectivity();
      }
      appState.current = nextAppState;
    });

    // Adaptive interval: 60s when connected, 15s when disconnected
    function startInterval() {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(checkConnectivity, isConnected ? 60000 : 15000);
    }
    startInterval();

    return () => {
      subscription.remove();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isConnected]);

  return { isConnected, isChecking, checkConnectivity };
}
