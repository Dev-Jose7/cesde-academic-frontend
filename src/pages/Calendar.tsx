import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import "./Calendar.css";
import { fetchAuth } from "../utils/fetchAuth";
import { Usuario } from "../context/UserContext";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
    grupo?: string;
    docente?: string;
    modulo?: string;
    dia?: string;
    horaInicio?: string;
    horaFin?: string;
  };
}

export interface GrupoEstudiante {
  grupoId: number;
  estudianteId: string;
}

export interface Clase {
  id: number;
  grupo: string;
  docente: string;
  modulo: string;
}

export interface ClaseHorario {
  clase: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
}

const dayMap: Record<string, number> = {
  DOMINGO: 0,
  LUNES: 1,
  MARTES: 2,
  MIERCOLES: 3,
  JUEVES: 4,
  VIERNES: 5,
  SABADO: 6,
};

const renderEventContent = (eventInfo: any) => {
  const { docente, horaInicio, horaFin } = eventInfo.event.extendedProps;
  return (
    <div className="p-1 rounded">
      <div className="text-sm font-semibold text-black break-words whitespace-normal">
        {eventInfo.event.title}
      </div>
      <div className="text-xs font-medium text-black break-words whitespace-normal">
        Docente: {docente}
      </div>
      <div className="text-xs text-black break-words whitespace-normal">
        {horaInicio} - {horaFin}
      </div>
    </div>
  );
};

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const usuarioStorage = localStorage.getItem("usuario");
        if (!usuarioStorage) return;

        const usuario: Usuario = JSON.parse(usuarioStorage);
        let eventosTotales: CalendarEvent[] = [];

        if (usuario.tipo === "ESTUDIANTE") {
          const grupoEstudianteResponse = await fetchAuth(`/api/grupo-estudiante/estudiante/${usuario.id}`);
          const grupoEstudianteData: GrupoEstudiante[] = await grupoEstudianteResponse.json();

          for (const grupo of grupoEstudianteData) {
            const claseResponse = await fetchAuth(`/api/clase/grupo/${grupo.grupoId}`);
            const claseData: Clase[] = await claseResponse.json();

            for (const clase of claseData) {
              const horarioResponse = await fetchAuth(`/api/clase-horario/clase/${clase.id}`);
              const horarios: ClaseHorario[] = await horarioResponse.json();

              const eventos = horarios.map((horario) => ({
                id: `${clase.id}-${horario.dia}-${horario.horaInicio}`,
                title: horario.clase,
                daysOfWeek: [dayMap[horario.dia.toUpperCase()] ?? 0],
                startTime: horario.horaInicio,
                endTime: horario.horaFin,
                startRecur: "2025-01-01",
                endRecur: "2025-12-31",
                extendedProps: {
                  calendar: "Academico",
                  grupo: clase.grupo,
                  docente: clase.docente,
                  modulo: clase.modulo,
                  dia: horario.dia,
                  horaInicio: horario.horaInicio,
                  horaFin: horario.horaFin,
                },
              }));

              eventosTotales = eventosTotales.concat(eventos);
            }
          }
        }

        if (usuario.tipo === "DOCENTE") {
          const claseResponse = await fetchAuth(`/api/clase/docente/${usuario.id}`);
          const clases: Clase[] = await claseResponse.json();

          for (const clase of clases) {
            const horarioResponse = await fetchAuth(`/api/clase-horario/clase/${clase.id}`);
            const horarios: ClaseHorario[] = await horarioResponse.json();

            const eventos = horarios.map((horario) => ({
              id: `${clase.id}-${horario.dia}-${horario.horaInicio}`,
              title: horario.clase,
              daysOfWeek: [dayMap[horario.dia.toUpperCase()] ?? 0],
              startTime: horario.horaInicio,
              endTime: horario.horaFin,
              startRecur: "2025-01-01",
              endRecur: "2025-12-31",
              extendedProps: {
                calendar: "Academico",
                grupo: clase.grupo,
                docente: clase.docente,
                modulo: clase.modulo,
                dia: horario.dia,
                horaInicio: horario.horaInicio,
                horaFin: horario.horaFin,
              },
            }));

            eventosTotales = eventosTotales.concat(eventos);
          }
        }

        setEvents(eventosTotales);
      } catch (error) {
        console.error("Error al cargar eventos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDateSelect = (_: DateSelectArg) => {};
  const handleEventClick = (_: EventClickArg) => {};

  // Opcional: si quieres puedes controlar loading interno del calendario:
  const handleLoading = (isLoadingCalendar: boolean) => {
    setCalendarLoading(isLoadingCalendar);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] min-h-[400px] flex items-center justify-center">
      {isLoading || calendarLoading ? (
        <div className="flex flex-col items-center space-y-3">
          <svg
            className="animate-spin h-10 w-10 text-pink-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <p className="text-gray-600 font-semibold text-lg">Cargando calendario...</p>
        </div>
      ) : (
        <div className="custom-calendar w-full">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            locale={esLocale}
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "dayGridMonth,timeGridWeek",
            }}
            events={events}
            selectable
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            loading={handleLoading} 
          />
        </div>
      )}
    </div>
  );
};

export default Calendar;




