import React from "react";

const eventos = [
  {
    fecha: "22 de octubre de 2024",
    descripcion: "Inicio de matrículas estudiantes nuevos",
  },
  {
    fecha: "10 de diciembre de 2024",
    descripcion: "Inicio de matrículas de estudiantes antiguos para todas las escuelas",
  },
  {
    fecha: "21 de diciembre de 2024",
    descripcion: "Límite de pago sin recargo estudiantes antiguos todas las escuelas",
  },
  {
    fecha: "15 de febrero de 2025",
    descripcion:
      "Límite de pago con recargo estudiantes antiguos todas las escuelas, valor recargo: $105.000",
  },
  {
    fecha: "10 de febrero de 2025",
    descripcion: "Inicio de clases todas las escuelas/sedes",
  },
];

const CronogramaAcademico: React.FC = () => {
  return (
    <div className="bg-white text-gray-800 rounded-xl p-8 shadow-md border border-gray-200">
      <div className="mb-6">
        <p className="text-sm uppercase text-gray-400">Agéndate</p>
        <h2 className="text-3xl font-bold text-gray-800">
          Primer semestre <span className="text-gray-400">2025</span>
        </h2>
        <p className="mt-4 text-gray-600 max-w-2xl">
          Queremos invitarte a que realices tu proceso de matrícula de manera
          oportuna, evites el pago de recargos por extemporaneidad. Para ello, te
          recordamos la información que debes tener en cuenta:
        </p>
      </div>

      <div className="border border-pink-600 rounded-lg overflow-hidden">
        <div className="bg-pink-600 text-white px-4 py-2 font-semibold">
          📅 Cronograma académico
        </div>

        <div className="divide-y divide-gray-200 bg-white">
          {eventos.map((evento, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-3"
            >
              <p className="font-medium">{evento.fecha}</p>
              <p className="text-gray-700">{evento.descripcion}</p>
            </div>
          ))}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-3 bg-gray-50">
            <p className="font-semibold text-gray-800">
              Horarios para el proceso de matrícula
            </p>
            <p className="text-gray-600">
              Lunes a viernes: de 7:30 a.m. a 6:30 p.m. (jornada continua)<br />
              Sábados: de 8:00 a.m. a 12:00 p.m.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CronogramaAcademico;


