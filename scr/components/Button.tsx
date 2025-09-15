import React from 'react';
import { useIsTablet } from '../utils/useIsTablet';
import { TouchableOpacity, TouchableOpacityProps, Text } from 'react-native';
import { ButtonSize, ButtonVariant, createButtonStyles } from './styles/button.styles';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const Button = React.forwardRef<React.ComponentRef<typeof TouchableOpacity>, ButtonProps>(
  ({ variant = 'default', size = 'default', children, style, ...props }, ref) => {
    const isTablet = useIsTablet();
    const styles = createButtonStyles(isTablet);
    
    const containerStyle = [
      styles.baseContainer,
      styles.variants[variant].container,
      styles.sizes[size].container,
      style,
    ];

    const textStyle = [
      styles.baseText,
      styles.variants[variant].text,
      styles.sizes[size].text,
    ];

    return (
      <TouchableOpacity ref={ref} style={containerStyle} activeOpacity={0.8} {...props}>
        {typeof children === 'string' ? (
          <Text style={textStyle}>{children}</Text>
        ) : (
          children
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';
export { Button };