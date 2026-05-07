import React, { ReactNode } from 'react';
import { createStyles } from './styles/card.styles';
import { useIsTablet } from '../utils/useIsTablet';
import { View, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface CardProps extends TouchableOpacityProps {
  children: ReactNode;
  variant?: 'default' | 'interactive' | 'info';
  style?: any;
}

export const Card = ({ 
  children, 
  variant = 'default', 
  style, 
  ...props 
}: CardProps) => {
  const isTablet = useIsTablet();
  const styles = createStyles(isTablet);

  const cardStyle = [
    styles.baseContainer,
    variant === 'interactive' && styles.interactive,
    variant === 'info' && styles.info,
    style,
  ];

  if (variant === 'interactive') {
    return (
      <TouchableOpacity 
        style={cardStyle} 
        activeOpacity={0.8}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
};