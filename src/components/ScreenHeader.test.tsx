import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ScreenHeader } from './ScreenHeader';

const mockOnBackPress = jest.fn();

describe('Componente: ScreenHeader', () => {

  beforeEach(() => {
    mockOnBackPress.mockClear();
  });

  it('deve renderizar o botão de voltar e ser clicável', () => {
    render(<ScreenHeader onBackPress={mockOnBackPress} isTablet={false} />);

    render(<ScreenHeader onBackPress={mockOnBackPress} isTablet={false} />);
    
     expect(screen.queryByText('Editar')).toBeNull();
  });

  it('deve renderizar o botão de ação (actionText) se for passado', () => {
    const mockOnActionPress = jest.fn();
    
    render(
      <ScreenHeader 
        onBackPress={mockOnBackPress} 
        isTablet={false}
        actionText="Editar"
        onActionPress={mockOnActionPress}
      />
    );

    const actionButton = screen.getByText('Editar');
    expect(actionButton).toBeTruthy();

    fireEvent.press(actionButton);

    expect(mockOnActionPress).toHaveBeenCalledTimes(1);

    expect(mockOnBackPress).not.toHaveBeenCalled();
  });

  it('não deve renderizar o botão de ação se onActionPress não for passado', () => {
    render(
      <ScreenHeader 
        onBackPress={mockOnBackPress} 
        isTablet={false}
        actionText="Editar"
      />
    );

    const actionButton = screen.queryByText('Editar');
    expect(actionButton).toBeNull();
  });
});
