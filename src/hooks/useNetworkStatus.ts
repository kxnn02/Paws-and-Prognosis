import { useState, useEffect, useRef } from 'react';
import { AppState } from 'react-native';

/**
 * Lightweight network status hook for Expo Go.
 * Periodically checks connectivity by attempting a HEAD request.
 */
export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const appState = useRef(AppState.currentState);

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

    // Periodic check every 30 seconds
    const interval = setInterval(checkConnectivity, 30000);

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, []);

  return { isConnected, isChecking, checkConnectivity };
}
