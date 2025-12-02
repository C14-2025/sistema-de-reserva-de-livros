import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUp from '../SignUp';

describe('SignUp Page', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
    delete window.location;
    window.location = { href: '' };
  });

  test('exibe erro se nome não for preenchido', async () => {
    render(<SignUp />);
    await userEvent.click(screen.getByRole('button', { name: /criar conta/i }));
    expect(await screen.findByText(/nome é obrigatório/i)).toBeInTheDocument();
  });

  test('exibe erro se email não for preenchido', async () => {
    render(<SignUp />);
    const nameInput = screen.getByPlaceholderText(/nome/i);
    await userEvent.type(nameInput, 'Usuario');
    await userEvent.click(screen.getByRole('button', { name: /criar conta/i }));
    expect(await screen.findByText(/e-mail é obrigatório/i)).toBeInTheDocument();
  });

  test('exibe erro se email for inválido', async () => {
    render(<SignUp />);
    const nameInput = screen.getByPlaceholderText(/nome/i);
    const emailInput = screen.getByPlaceholderText(/e-mail/i);
    
    await userEvent.type(nameInput, 'Usuario');
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.click(screen.getByRole('button', { name: /criar conta/i }));
    expect(await screen.findByText(/e-mail inválido/i)).toBeInTheDocument();
  });

  test('exibe erro se senha for muito curta', async () => {
    render(<SignUp />);
    const nameInput = screen.getByPlaceholderText(/nome/i);
    const emailInput = screen.getByPlaceholderText(/e-mail/i);
    const passwordInput = screen.getByPlaceholderText(/senha/i);
    
    await userEvent.type(nameInput, 'Usuario');
    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, '123');
    await userEvent.click(screen.getByRole('button', { name: /criar conta/i }));
    expect(await screen.findByText(/senha deve ter no mínimo 6 caracteres/i)).toBeInTheDocument();
  });

  test('realiza cadastro com sucesso e redireciona para /login', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Conta criada com sucesso' }),
    });

    render(<SignUp />);
    const nameInput = screen.getByPlaceholderText(/nome/i);
    const emailInput = screen.getByPlaceholderText(/e-mail/i);
    const passwordInput = screen.getByPlaceholderText(/senha/i);
    
    await userEvent.type(nameInput, 'Novo User');
    await userEvent.type(emailInput, 'novo@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(screen.getByRole('button', { name: /criar conta/i }));

    // Aguarda a redireção
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(window.location.href).toBe('/login');
  });

  test('exibe mensagem de erro ao falhar no cadastro', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Usuário já existe' }),
    });

    render(<SignUp />);
    const nameInput = screen.getByPlaceholderText(/nome/i);
    const emailInput = screen.getByPlaceholderText(/e-mail/i);
    const passwordInput = screen.getByPlaceholderText(/senha/i);
    
    await userEvent.type(nameInput, 'Novo User');
    await userEvent.type(emailInput, 'novo@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(screen.getByRole('button', { name: /criar conta/i }));

    expect(await screen.findByText(/usuário já existe/i)).toBeInTheDocument();
  });
});
