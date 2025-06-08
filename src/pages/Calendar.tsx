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

// Interfaces
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

// Día a número para FullCalendar
const dayMap: Record<string, number> = {
  DOMINGO: 0,
  LUNES: 1,
  MARTES: 2,
  MIERCOLES: 3,
  JUEVES: 4,
  VIERNES: 5,
  SABADO: 6,
};

// Renderizado de cada evento
const renderEventContent = (eventInfo: any) => {
  const calendarLevel =
    eventInfo.event.extendedProps?.calendar?.toLowerCase() || "primary";
  const colorClass = `fc-bg-${calendarLevel}`;
  const { docente, horaInicio, horaFin } = eventInfo.event.extendedProps;

  return (
    <div className={`p-1 rounded ${colorClass}`}>

      {/* Nombre clase */}
      <div className="text-sm text-primary font-semibold break-words whitespace-normal">
        {eventInfo.event.title}
      </div>

      {/* Nombre docente */}
      <div className="text-xs font-medium break-words whitespace-normal">
        Docente: {docente}
      </div>

      {/* Rango horario */}
      <div className="text-xs break-words whitespace-normal">
        {horaInicio} - {horaFin}
      </div>
    </div>
  );
};

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const usuarioStorage = localStorage.getItem("usuario");

        if (usuarioStorage) {
          const usuario: Usuario = JSON.parse(usuarioStorage);
          let eventosTotales: CalendarEvent[] = [];

          switch (usuario.tipo) {
            case "ESTUDIANTE":
              const grupoEstudianteResponse = await fetchAuth(
                `/api/grupo-estudiante/estudiante/${usuario.id}`
              );
              const grupoEstudianteData: GrupoEstudiante[] =
                await grupoEstudianteResponse.json();

              for (const grupo of grupoEstudianteData) {
                const claseResponse = await fetchAuth(
                  `/api/clase/grupo/${grupo.grupoId}`
                );
                const claseData: Clase[] = await claseResponse.json();

                for (const clase of claseData) {
                  const claseHorarioResponse = await fetchAuth(
                    `/api/clase-horario/clase/${clase.id}`
                  );
                  const claseHorarioData: ClaseHorario[] =
                    await claseHorarioResponse.json();

                  const eventosClase = claseHorarioData.map((horario) => {
                    const diaSemana = dayMap[horario.dia.toUpperCase()] ?? 0;

                    return {
                      id: `${clase.id}-${horario.dia}-${horario.horaInicio}`,
                      title: horario.clase,
                      daysOfWeek: [diaSemana],
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
                    } as CalendarEvent;
                  });

                  eventosTotales = eventosTotales.concat(eventosClase);
                }
              }

              break;

            case "DOCENTE":
              const response = await fetchAuth(`/api/clase/docente/${usuario.id}`);
              const clasesDocente: Clase[] = await response.json();

              for (const clase of clasesDocente) {
                const claseHorarioResponse = await fetchAuth(`/api/clase-horario/clase/${clase.id}`);
                const claseHorarioData: ClaseHorario[] = await claseHorarioResponse.json();

                const eventosClase = claseHorarioData.map((horario) => {
                  const diaSemana = dayMap[horario.dia.toUpperCase()] ?? 0;

                  return {
                    id: `${clase.id}-${horario.dia}-${horario.horaInicio}`,
                    title: horario.clase,
                    daysOfWeek: [diaSemana],
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
                  } as CalendarEvent;
                });

                eventosTotales = eventosTotales.concat(eventosClase);
              }

              break;

            case "ADMINISTRATIVO":
            case "DIRECTIVO":
              // Implementar si es necesario
              break;
          }

          setEvents(eventosTotales);
        }
      } catch (error) {
        console.error("Error al cargar eventos:", error);
      }
    };

    fetchEvents();
  }, []);

  // 🔇 Modal desactivado al seleccionar fecha
  const handleDateSelect = (_selectInfo: DateSelectArg) => {};

  // 🔇 Modal desactivado al hacer clic en evento
  const handleEventClick = (_clickInfo: EventClickArg) => {};

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="custom-calendar">
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
        />
      </div>
    </div>
  );
};

export default Calendar;
