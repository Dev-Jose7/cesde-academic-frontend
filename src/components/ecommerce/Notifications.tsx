import React from "react";
import { Bell } from "lucide-react";

const notifications = [
  { id: 1, message: "Revisión de notas finaliza el 15 de junio." },
  { id: 2, message: "Nuevos cursos de verano disponibles." },
  { id: 3, message: "Capacitación para docentes el próximo lunes." },
];

export default function Notifications() {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <div className="flex items-center mb-4">
        <Bell className="w-5 h-5 text-[#ed2e91] mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Notificaciones</h2>
      </div>
      <ul className="space-y-3 text-gray-700 text-sm">
        {notifications.map(({ id, message }) => (
          <li
            key={id}
            className="bg-[#fff0f7] text-[#ed2e91] px-4 py-2 rounded-lg border border-[#ed2e91] hover:bg-[#ffe3ef] transition"
          >
            {message}
          </li>
        ))}
      </ul>
    </div>
  );
}



