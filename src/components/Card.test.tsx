import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Card } from './Card';
import { Text } from 'react-native';

describe('Componente: Card', () => {
  it('deve renderizar o conteúdo (children)', () => {
    render(
      <Card variant="default">
        <Text>Conteúdo do Card</Text>
      </Card>
    );
    expect(screen.getByText('Conteúdo do Card')).toBeTruthy();
  });

  it('deve ser clicável se a variant for "default"', () => {
    const mockOnPress = jest.fn();
    render(
      <Card variant="default" onPress={mockOnPress}>
        <Text>Card Clicável</Text>
      </Card>
    );

    fireEvent.press(screen.getByText('Card Clicável'));
    
    expect(mockOnPress).toHaveBeenCalled(); 
  });

  it('deve ser clicável se a variant for "interactive"', () => {
    const mockOnPress = jest.fn();
    render(
      <Card variant="interactive" onPress={mockOnPress}>
        <Text>Clique Aqui</Text>
      </Card>
    );
    
    fireEvent.press(screen.getByText('Clique Aqui'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});