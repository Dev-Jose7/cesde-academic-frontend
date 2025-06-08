import React from "react";

const teachers = [
  { name: "Ana Pérez", specialty: "Matemáticas", rating: 4.5 },
  { name: "Carlos Gómez", specialty: "Física", rating: 4.2 },
  { name: "Laura Martínez", specialty: "Química", rating: 4.8 },
  { name: "Jorge Ramírez", specialty: "Historia", rating: 4.1 },
];

export default function TeacherInfo() {
  return (
    <div className="p-4 bg-white">
      <h2 className="text-sm font-semibold mb-4 text-gray-700 border-b border-gray-300 pb-2">
        Información de Profesores
      </h2>
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="py-2 text-gray-500 font-medium">Nombre</th>
            <th className="py-2 text-gray-500 font-medium">Especialidad</th>
            <th className="py-2 text-gray-500 font-medium">Evaluación</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map(({ name, specialty, rating }) => (
            <tr
              key={name}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <td className="py-3 text-gray-700">{name}</td>
              <td className="py-3 text-gray-700">{specialty}</td>
              <td className="py-3 text-gray-700">{rating} / 5</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


