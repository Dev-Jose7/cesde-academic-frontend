import React from "react";

const courses = [
  { type: "Presencial", count: 12, icon: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A8.966 8.966 0 0112 15c2.28 0 4.377.848 5.879 2.252M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )},
  { type: "Virtual", count: 8, icon: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L15 12m0 0l-5.25-5M15 12H3" />
    </svg>
  )},
  { type: "Híbrida", count: 5, icon: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h2l3 5 4-8 3 6h4" />
    </svg>
  )},
];

export default function CourseTypes() {
  return (
    <div className="p-4 bg-white">
      <h2 className="text-base font-semibold mb-4 text-gray-700 border-b border-gray-300 pb-2">
        Tipos de Formaciones
      </h2>
      <ul>
        {courses.map(({ type, count, icon }) => (
          <li key={type} className="mb-3 flex items-center gap-3 text-gray-700">
            <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[#ed2e91] text-white">
              {icon}
            </div>
            <span>
              <strong>{type}:</strong> {count} cursos
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

