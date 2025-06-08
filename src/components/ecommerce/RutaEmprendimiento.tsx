import React from "react";

const RutaEmprendimiento: React.FC = () => {
  return (
    <a
      href="https://www.cesde.edu.co/emprende/"
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-xl p-6 shadow-md bg-white hover:bg-pink-50 transition"
    >
      <h3 className="text-lg font-semibold text-pink-600 mb-2">
        Ruta de Emprendimiento
      </h3>
      <p className="text-sm text-gray-600">
        Descubre los programas y apoyos para desarrollar tu idea de negocio.
      </p>
    </a>
  );
};

export default RutaEmprendimiento;

