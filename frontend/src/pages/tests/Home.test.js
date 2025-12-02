import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../Home';

describe('Home Page', () => {
  test('renderiza elementos principais', () => {
    const navigate = jest.fn();
    render(<Home navigate={navigate} />);

    expect(screen.getByText(/seu sistema de/i)).toBeInTheDocument();
    expect(screen.getByText(/reserva de livros/i)).toBeInTheDocument();
    expect(screen.getByText(/bem-vindo ao/i)).toBeInTheDocument();
  });

  test('renderiza o botão de início', () => {
    const navigate = jest.fn();
    render(<Home navigate={navigate} />);

    const button = screen.getByRole('button', { name: /comece agora!/i });
    expect(button).toBeInTheDocument();
  });

  test('chama navigate com /signup quando clica no botão', async () => {
    const navigate = jest.fn();
    render(<Home navigate={navigate} />);

    const button = screen.getByRole('button', { name: /comece agora!/i });
    await userEvent.click(button);
    
    expect(navigate).toHaveBeenCalledWith('/signup');
    expect(navigate).toHaveBeenCalledTimes(1);
  });

  test('renderiza o header com botões de autenticação', () => {
    const navigate = jest.fn();
    render(<Home navigate={navigate} />);

    // Verifica se há pelo menos um botão (do header)
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('renderiza a imagem principal', () => {
    const navigate = jest.fn();
    render(<Home navigate={navigate} />);

    const image = screen.getByAltText(/biblioteca ilustração/i);
    expect(image).toBeInTheDocument();
  });
});
