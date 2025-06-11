import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import SignIn from '../AuthPages/SignIn';

describe('SignIn component', () => {
  const mockOnLogin = vi.fn();

  const renderWithProviders = () =>
    render(
      React.createElement(HelmetProvider, {},
        React.createElement(MemoryRouter, {},
          React.createElement(SignIn, { onLogin: mockOnLogin })
        )
      )
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería renderizar el formulario de login', () => {
    renderWithProviders();

    expect(screen.getByLabelText(/cédula/i)).not.toBeNull();
    expect(screen.getByLabelText(/contraseña/i)).not.toBeNull();
    expect(screen.getByRole('button', { name: /ingresar/i })).not.toBeNull();
  });

  it('debería mostrar errores si se envía vacío', async () => {
    renderWithProviders();

    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    const errores = await screen.findAllByText(/este campo es obligatorio/i);
    expect(errores.length).toBe(2);
  });

  it('debería llamar a onLogin con datos correctos', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        usuario: {
          id: 1,
          cedula: '123456',
          nombre: 'Usuario Prueba',
          tipo: 'ESTUDIANTE',
          status: 'ACTIVO',
        },
        mensaje: 'Bienvenido',
        accessToken: 'fake-token',
        refreshToken: 'fake-refresh',
      }),
    }) as any;

    renderWithProviders();

    fireEvent.change(screen.getByLabelText(/cédula/i), {
      target: { value: '123456' }
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: '1234' }
    });

    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalled();
    });
  });

  it('debería mostrar mensaje de error si la API falla', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
    }) as any;

    renderWithProviders();

    fireEvent.change(screen.getByLabelText(/cédula/i), {
      target: { value: 'wronguser' }
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'wrongpass' }
    });

    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    await waitFor(() => {
      const error = screen.getByText(/cédula o contraseña incorrecta/i);
      expect(error).not.toBeNull();
    });
  });
});

