import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../Login';

describe('Login Page', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
    // Simula location
    delete window.location;
    window.location = { href: '' };
  });

  test('exibe mensagem de erro se campos de email ou senha estiverem vazios', async () => {
    render(<Login />);
    const loginButton = screen.getByRole('button', { name: /entrar/i });
    await userEvent.click(loginButton);
    expect(await screen.findByText(/preencha todos os campos/i)).toBeInTheDocument();
  });

  test('realiza login com sucesso e redireciona para /books', async () => {
    const fakeUser = { name: 'Test User', email: 'test@example.com' };
    const fakeToken = 'fake-token';
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ token: fakeToken, user: fakeUser }),
    });

    render(<Login />);
    const emailInput = screen.getByPlaceholderText(/e-mail/i);
    const passwordInput = screen.getByPlaceholderText(/senha/i);
    
    await userEvent.type(emailInput, fakeUser.email);
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

    // Aguarda atualização assíncrona
    await screen.findByRole('button', { name: /entrar/i });
    expect(localStorage.getItem('token')).toBe(fakeToken);
    expect(localStorage.getItem('user')).toBe(JSON.stringify(fakeUser));
    expect(window.location.href).toBe('/books');
  });

  test('exibe mensagem de erro ao falhar no login', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Credenciais inválidas' }),
    });

    render(<Login />);
    const emailInput = screen.getByPlaceholderText(/e-mail/i);
    const passwordInput = screen.getByPlaceholderText(/senha/i);
    
    await userEvent.type(emailInput, 'wrong@example.com');
    await userEvent.type(passwordInput, 'wrongpass');
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

    expect(await screen.findByText(/email ou senha inválidos/i)).toBeInTheDocument();
  });
});
