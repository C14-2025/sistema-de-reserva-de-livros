import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Reservations from '../Reservations';
import { useReservations } from '../../contexts/ReservationContext';

// Mock do contexto de reservas (caminho relativo corrigido)
jest.mock('../../contexts/ReservationContext', () => ({
  useReservations: jest.fn(),
}));

describe('Reservations Page', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    window.confirm = jest.fn();
    window.alert = jest.fn();
  });

  test('exibe indicador de carregamento quando loading for true', () => {
    useReservations.mockReturnValue({
      reservations: [],
      removeReservation: jest.fn(),
      loading: true,
      refreshReservations: jest.fn(),
    });
    render(<Reservations navigate={jest.fn()} />);
    expect(screen.getByText(/carregando suas reservas/i)).toBeInTheDocument();
  });

  test('exibe mensagem de vazio quando não há reservas ativas', () => {
    useReservations.mockReturnValue({
      reservations: [],
      removeReservation: jest.fn(),
      loading: false,
      refreshReservations: jest.fn(),
    });
    const navigate = jest.fn();
    render(<Reservations navigate={navigate} />);
    expect(screen.getByText(/você ainda não tem reservas ativas/i)).toBeInTheDocument();
    const button = screen.getByRole('button', { name: /ir para biblioteca/i });
    userEvent.click(button);
    expect(navigate).toHaveBeenCalledWith('/books');
  });

  test('exibe reservas ativas e permite cancelar e finalizar', () => {
    const reservation = {
      id: 1,
      status: 'active',
      Book: { title: 'Livro Reserva', author: 'Autor X', genre: 'Gênero Y', cover: '' },
      reservationDate: '2023-10-01T00:00:00.000Z',
    };
    const removeReservation = jest.fn();
    useReservations.mockReturnValue({
      reservations: [reservation],
      removeReservation,
      loading: false,
      refreshReservations: jest.fn(),
    });
    // Mocka confirmações em sequência: true (cancel), true (finalize)
    window.confirm = jest.fn()
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true);
    const navigate = jest.fn();
    render(<Reservations navigate={navigate} />);

    // Botão de cancelar reserva
    const cancelButton = screen.getByText(/cancelar reserva/i);
    userEvent.click(cancelButton);
    expect(removeReservation).toHaveBeenCalledWith(reservation.id);

    // Botão de finalizar reserva
    const finalizeButton = screen.getByRole('button', { name: /finalizar reserva/i });
    userEvent.click(finalizeButton);
    expect(navigate).toHaveBeenCalledWith('/booking-success');
  });
});
