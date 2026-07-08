import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { View, Text, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const TOAST_DURATION = 2500;

const TOAST_CONFIG: Record<ToastType, { icon: keyof typeof Ionicons.glyphMap; bg: string; iconColor: string }> = {
  success: { icon: 'checkmark-circle', bg: 'bg-green-50 border-green-200', iconColor: '#10B981' },
  error: { icon: 'close-circle', bg: 'bg-red-50 border-red-200', iconColor: '#EF4444' },
  info: { icon: 'information-circle', bg: 'bg-blue-50 border-blue-200', iconColor: '#3B82F6' },
  warning: { icon: 'warning', bg: 'bg-yellow-50 border-yellow-200', iconColor: '#F59E0B' },
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -20, duration: 200, useNativeDriver: true }),
      ]).start(() => onDismiss());
    }, TOAST_DURATION);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const config = TOAST_CONFIG[toast.type];

  return (
    <Animated.View
      style={{ opacity, transform: [{ translateY }] }}
      className={`mx-5 mb-2 px-4 py-3 rounded-btn border flex-row items-center shadow-sm ${config.bg}`}
    >
      <Ionicons name={config.icon} size={20} color={config.iconColor} />
      <Text className="flex-1 text-sm text-dark ml-3" numberOfLines={2}>
        {toast.message}
      </Text>
    </Animated.View>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev.slice(-2), { id, message, type }]); // Max 3 toasts
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <View
        className="absolute left-0 right-0 z-50"
        style={{ top: Platform.OS === 'ios' ? 60 : 40 }}
        pointerEvents="none"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
