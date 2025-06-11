import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CrearUsuario from '../UiElements/CrearUsuario';
import '@testing-library/jest-dom';

describe('CrearUsuario', () => {
  it('debe permitir completar el formulario correctamente', () => {
    // Crear un mock para la función onCrear
    const mockOnCrear = vi.fn();

    render(<CrearUsuario onCrear={mockOnCrear} />);

    const nombreInput = screen.getByPlaceholderText('Ej: Laura Torres Vanegas');
    const cedulaInput = screen.getByPlaceholderText('Ej: 1034543213');
    const correoInput = screen.getByPlaceholderText('Ej: correo@ejemplo.com');
    const contrasenaInput = screen.getByPlaceholderText('••••••••');
    const tipoUsuarioSelect = screen.getByDisplayValue('Seleccione una opción');

    // Simular entrada de datos
    fireEvent.change(nombreInput, { target: { value: 'Juan Pérez' } });
    fireEvent.change(cedulaInput, { target: { value: '1234567890' } });
    fireEvent.change(correoInput, { target: { value: 'juan@example.com' } });
    fireEvent.change(contrasenaInput, { target: { value: 'secreta123' } });
    fireEvent.change(tipoUsuarioSelect, { target: { value: 'DOCENTE' } });

    // Verificar que los valores fueron ingresados correctamente
    expect(nombreInput).toHaveValue('Juan Pérez');
    expect(cedulaInput).toHaveValue('1234567890');
    expect(correoInput).toHaveValue('juan@example.com');
    expect(contrasenaInput).toHaveValue('secreta123');
    expect(tipoUsuarioSelect).toHaveValue('DOCENTE');

    // Simular envío del formulario
    const submitButton = screen.getByRole('button', { name: /crear usuario/i });
    fireEvent.click(submitButton);

    // Verificar que onCrear fue llamado con los datos correctos
    expect(mockOnCrear).toHaveBeenCalledWith({
      nombre: 'Juan Pérez',
      cedula: '1234567890',
      correo: 'juan@example.com',
      contrasena: 'secreta123',
      tipo: 'DOCENTE',
    });
  });
});
