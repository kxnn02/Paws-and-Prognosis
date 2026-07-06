import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View className="flex-1 bg-beige items-center justify-center px-8">
          <View className="w-16 h-16 rounded-full bg-red-50 items-center justify-center mb-4">
            <Ionicons name="warning-outline" size={32} color="#EF4444" />
          </View>
          <Text className="text-xl font-bold text-heading text-center">Something Went Wrong</Text>
          <Text className="text-sm text-grey text-center mt-3 leading-5">
            An unexpected error occurred. Please try again.
          </Text>
          {__DEV__ && this.state.error && (
            <Text className="text-xs text-red-400 text-center mt-3 font-mono">
              {this.state.error.message}
            </Text>
          )}
          <TouchableOpacity
            onPress={this.handleReset}
            className="mt-6 bg-primary h-[44px] px-6 rounded-btn items-center justify-center"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-sm">Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
