import React from 'react';
import { Button } from './Button';
import { render, screen, fireEvent } from '@testing-library/react-native';

describe('Componente: Button', () => {

  it('deve renderizar o texto corretamente', () => {
    render(<Button>Clique-me</Button>);

    const buttonText = screen.getByText('Clique-me');

    expect(buttonText).toBeTruthy();
  });

  it('deve chamar a função onPress ao ser clicado', () => {
    const mockOnPress = jest.fn();

    render(<Button onPress={mockOnPress}>Clique-me</Button>);

    fireEvent.press(screen.getByText('Clique-me'));

    expect(mockOnPress).toHaveBeenCalled();
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
