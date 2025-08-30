import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
} from 'react-native';import { buttonStyles } from './button.styles';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: keyof typeof buttonStyles.variants;
  size?: keyof typeof buttonStyles.sizes;
  children: React.ReactNode;
}

const Button = React.forwardRef<React.ComponentRef<typeof TouchableOpacity>, ButtonProps>(
  ({ variant = 'default', size = 'default', children, style, ...props }, ref) => {
    const containerStyle = [
      buttonStyles.baseContainer,
      buttonStyles.variants[variant].container,
      buttonStyles.sizes[size].container,
      style,
    ];

    const textStyle = [
      buttonStyles.baseText,
      buttonStyles.variants[variant].text,
      buttonStyles.sizes[size].text,
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