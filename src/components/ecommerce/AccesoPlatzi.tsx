import React from "react";

const AccesoPlatzi: React.FC = () => {
  return (
    <a
      href="https://platzi.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-xl p-6 shadow-md bg-white hover:bg-pink-50 transition"
    >
      <h3 className="text-lg font-semibold text-pink-600 mb-2">
        Accede a Platzi
      </h3>
      <p className="text-sm text-gray-600">
        Plataforma educativa gratuita para estudiantes del CESDE.
      </p>
    </a>
  );
};

export default AccesoPlatzi;
