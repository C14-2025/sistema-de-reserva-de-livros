import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookingSuccess from '../BookingSuccess';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('BookingSuccess Page', () => {
  test('botões funcionam corretamente (sair e retornar)', () => {
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);
    render(<BookingSuccess />);
    const exitButton = screen.getByRole('button', { name: /sair/i });
    userEvent.click(exitButton);
    expect(navigate).toHaveBeenCalledWith('/');
    const returnButton = screen.getByRole('button', { name: /retornar à biblioteca/i });
    userEvent.click(returnButton);
    expect(navigate).toHaveBeenCalledWith('/books');
  });
});
