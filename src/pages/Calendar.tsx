import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import "./Calendar.css";
import { useModal } from "../hooks/useModal";

// Interfaces
interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
    grupo?: string;
    docente?: string;
    modulo?: string;
    dia?: string;
  };
}

// Mapeos y constantes
const calendarsEvents = {
  Danger: "Prioridad alta",
  Success: "Prioridad baja",
  Primary: "Prioridad media",
  Warning: "Prioridad 100%",
};

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
  const calendarLevel =
    eventInfo.event.extendedProps?.calendar?.toLowerCase() || "primary";
  const colorClass = `fc-bg-${calendarLevel}`;
  const { grupo, docente, modulo } = eventInfo.event.extendedProps;

  return (
    <div className={`p-1 rounded ${colorClass}`}>
      <div className="font-bold text-sm">{eventInfo.timeText}</div>
      <div className="text-xs">{eventInfo.event.title}</div>
      <div className="text-[10px]">Módulo: {modulo}</div>
      <div className="text-[10px]">Grupo: {grupo}</div>
    </div>
  );
};

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("Primary");

  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("No hay token de autenticación. Por favor, inicia sesión.");
          return;
        }

        // Usa la ruta proxy configurada en vite.config.ts ("/api/clase/lista")
        const response = await fetch("/api/clase/lista", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(
            `Error HTTP ${response.status}: ${response.statusText || "Error"}`
          );
        }

        const data = await response.json();

        // Obtener usuario para filtrar clases por docente
        const usuarioString = localStorage.getItem("usuario");
        if (!usuarioString) return;
        const usuario = JSON.parse(usuarioString);

        // Filtrar clases según docente que esté en localStorage.usuario.nombre
        const filteredClasses = data.filter(
          (item: any) =>
            item.docente?.toUpperCase() === usuario.nombre.toUpperCase()
        );

        // Por cada clase traer sus horarios
        const horariosPorClase = await Promise.all(
          filteredClasses.map(async (clase: any) => {
            const res = await fetch(`/api/clase-horario/clase/${clase.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
              throw new Error(
                `Error HTTP ${res.status}: ${res.statusText || "Error"}`
              );
            }

            const horarios = await res.json();

            // Mapea los horarios con información de la clase
            return horarios.map((horario: any) => ({
              ...horario,
              claseNombre: clase.nombre,
              grupo: clase.grupo,
              docente: clase.docente,
              modulo: clase.modulo,
            }));
          })
        );

        // Aplanar el array para tener todos los horarios juntos
        const todosLosHorarios = horariosPorClase.flat();

        // Mapear a eventos para FullCalendar
        const mappedEvents: CalendarEvent[] = todosLosHorarios.map((item: any) => {
          const diaSemana = dayMap[item.dia?.toUpperCase()] ?? 0;

          return {
            id: item.id?.toString(),
            title: item.claseNombre || "Clase",
            daysOfWeek: [diaSemana],
            startTime: item.horaInicio,
            endTime: item.horaFin,
            startRecur: "2025-01-01",
            endRecur: "2025-12-31",
            extendedProps: {
              calendar: "Academico",
              grupo: item.grupo,
              docente: item.docente,
              modulo: item.modulo,
              dia: item.dia,
            },
          };
        });

        setEvents(mappedEvents);
      } catch (error: any) {
        console.error("Error cargando eventos:", error.message || error);
        alert(
          `No se pudieron cargar los eventos. ${error.message || "Error desconocido"}`
        );
      }
    };

    fetchEvents();
  }, []);

  // Limpia campos modal
  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventLevel("Primary");
    setSelectedEvent(null);
  };

  // Selección rango fecha en calendario
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setEventStartDate(selectInfo.startStr);
    setEventEndDate(selectInfo.endStr || selectInfo.startStr);
    openModal();
  };

  // Click en evento existente
  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent({
      id: event.id,
      title: event.title || "",
      start: event.start?.toISOString(),
      end: event.end?.toISOString(),
      extendedProps: {
        calendar: event.extendedProps?.calendar || "Primary",
      },
    });

    setEventTitle(event.title || "");
    setEventStartDate(event.start?.toISOString().split("T")[0] || "");
    setEventEndDate(event.end?.toISOString().split("T")[0] || "");
    setEventLevel(event.extendedProps?.calendar || "Primary");
    openModal();
  };

  // Agregar o actualizar evento desde modal
  const handleAddOrUpdateEvent = () => {
    if (!eventTitle) {
      alert("El título es obligatorio");
      return;
    }

    const newEvent: CalendarEvent = {
      id: selectedEvent?.id || Date.now().toString(),
      title: eventTitle,
      start: eventStartDate,
      end: eventEndDate,
      allDay: true,
      extendedProps: { calendar: eventLevel },
    };

    setEvents((prev) =>
      selectedEvent
        ? prev.map((e) => (e.id === selectedEvent.id ? newEvent : e))
        : [...prev, newEvent]
    );

    closeModal();
    resetModalFields();
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="custom-calendar">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={esLocale}
          headerToolbar={{
            left: "prev,next addEventButton",
            center: "title",
            right: "dayGridMonth,timeGridWeek",
          }}
          events={events}
          selectable
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          customButtons={{
            addEventButton: {
              text: "Agregar Reunión Personal +",
              click: () => {
                resetModalFields();
                openModal();
              },
            },
          }}
        />
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]"
          onClick={() => {
            closeModal();
            resetModalFields();
          }}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg z-[10000]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">
              {selectedEvent ? "Editar Evento" : "Nuevo Evento"}
            </h2>

            <label className="block mb-2 font-medium">Título</label>
            <input
              type="text"
              className="border rounded p-2 w-full mb-4"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Escribe el título"
            />

            <label className="block mb-2 font-medium">Fecha inicio</label>
            <DatePicker
              selected={eventStartDate ? new Date(eventStartDate) : null}
              onChange={(date: Date | null) =>
                date && setEventStartDate(date.toISOString().split("T")[0])
              }
              dateFormat="yyyy-MM-dd"
              className="border rounded p-2 w-full mb-4"
            />

            <label className="block mb-2 font-medium">Fecha fin</label>
            <DatePicker
              selected={eventEndDate ? new Date(eventEndDate) : null}
              onChange={(date: Date | null) =>
                date && setEventEndDate(date.toISOString().split("T")[0])
              }
              dateFormat="yyyy-MM-dd"
              className="border rounded p-2 w-full mb-4"
            />

            <label className="block mb-2 font-medium">Prioridad</label>
            <select
              className="border rounded p-2 w-full mb-4"
              value={eventLevel}
              onChange={(e) => setEventLevel(e.target.value)}
            >
              {Object.entries(calendarsEvents).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>

            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => {
                  closeModal();
                  resetModalFields();
                }}
              >
                Cancelar
              </button>

              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleAddOrUpdateEvent}
              >
                {selectedEvent ? "Actualizar" : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;


