import React, { ReactNode } from 'react';
import { styles } from './styles/gameCard.styles';
import { View, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface GameCardProps extends TouchableOpacityProps {
  children: ReactNode;
  variant?: 'default' | 'interactive' | 'info';
  style?: any;
}

export const GameCard = ({ 
  children, 
  variant = 'default', 
  style, 
  ...props 
}: GameCardProps) => {
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