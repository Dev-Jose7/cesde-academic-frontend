import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CrearUsuario from '../UiElements/CrearUsuario';
import '@testing-library/jest-dom';

describe('CrearUsuario', () => {
  it('debe permitir completar el formulario correctamente', () => {
    render(<CrearUsuario />);

    // Buscar los campos por placeholder en lugar de label
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
    fireEvent.change(tipoUsuarioSelect, { target: { value: 'Docente' } });

    // Verificar que los valores fueron ingresados correctamente
    expect(nombreInput).toHaveValue('Juan Pérez');
    expect(cedulaInput).toHaveValue('1234567890');
    expect(correoInput).toHaveValue('juan@example.com');
    expect(contrasenaInput).toHaveValue('secreta123');
    expect(tipoUsuarioSelect).toHaveValue('Docente');
  });
});



