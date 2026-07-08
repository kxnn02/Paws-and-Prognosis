import React, { forwardRef } from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const Input = forwardRef<TextInput, InputProps>(({ label, error, containerClassName = '', ...props }, ref) => {
  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label && (
        <Text className="text-[13px] font-semibold text-heading mb-1.5">{label}</Text>
      )}
      <TextInput
        ref={ref}
        className={`bg-input-bg border rounded-btn px-4 py-3 text-[14px] text-dark h-[48px] ${
          error ? 'border-red-500' : 'border-gray-200'
        }`}
        placeholderTextColor="#AA865D"
        accessibilityLabel={label || props.placeholder}
        {...props}
      />
      {error && (
        <Text className="text-xs text-red-500 mt-1">{error}</Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';
export default Input;
