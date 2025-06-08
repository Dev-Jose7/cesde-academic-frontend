import React from "react";

const LineaTransparencia: React.FC = () => {
  return (
    <a
      href="https://www.cesde.edu.co/nosotros/linea-de-transparencia/"
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-xl p-6 shadow-md bg-white hover:bg-pink-50 transition"
    >
      <h3 className="text-lg font-semibold text-pink-600 mb-2">
        Línea de Transparencia
      </h3>
      <p className="text-sm text-gray-600">
        Un canal para reportar situaciones que requieran atención institucional.
      </p>
    </a>
  );
};

export default LineaTransparencia;

