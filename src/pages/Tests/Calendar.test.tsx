import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Calendar from '../Calendar';
import * as fetchUtils from '../../utils/fetchAuth';


vi.mock('@fullcalendar/react', () => ({
  default: () => <div data-testid="full-calendar">Calendario Cargado</div>,
}));


vi.spyOn(fetchUtils, 'fetchAuth').mockImplementation(async (url: string) => {
  const mockResponses: Record<string, any> = {
    '/api/grupo-estudiante/estudiante/57': {
      json: async () => [{ grupoId: 1, estudianteId: '57' }],
    },
    '/api/clase/grupo/1': {
      json: async () => [{ id: 1, grupo: 'Grupo 1', docente: 'Profe', modulo: 'Modulo A' }],
    },
    '/api/clase-horario/clase/1': {
      json: async () => [{ clase: 'Modulo A', dia: 'LUNES', horaInicio: '08:00', horaFin: '10:00' }],
    },
  };

  return mockResponses[url] || { json: async () => [] };
});

describe('Calendar component', () => {
  beforeEach(() => {
    localStorage.setItem('usuario', JSON.stringify({ id: 57, tipo: 'ESTUDIANTE' }));
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe renderizar el calendario con el consumo de la api', async () => {
    render(<Calendar />);
    expect(screen.getByText('Cargando calendario...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('full-calendar')).toBeInTheDocument();
    });
  });
});

