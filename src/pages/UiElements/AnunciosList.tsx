import React, { useEffect, useState } from "react";
import { fetchAuth } from "../../utils/fetchAuth";
import { FaChalkboardTeacher, FaCalendarAlt, FaInfoCircle } from "react-icons/fa";

interface Clase {
  grupo: string;
  docente: string;
  modulo: string;
}

interface Anuncio {
  id: number;
  clase: Clase;
  titulo: string;
  mensaje: string;
  fecha: string; // YYYY-MM-DD
}

const AnunciosList: React.FC = () => {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarAnuncios() {
      try {
        const res = await fetchAuth("/api/anuncio/lista");
        if (!res.ok) throw new Error("Error cargando anuncios");
        const data = await res.json();
        setAnuncios(data);
      } catch (e) {
        setError((e as Error).message);
      }
    }
    cargarAnuncios();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-pink-600">Anuncios Recientes</h2>
      {error && (
        <div className="text-red-600 font-semibold mb-4">{error}</div>
      )}
      <ul className="space-y-4">
        {anuncios.map(({ id, titulo, mensaje, fecha, clase }) => (
          <li
            key={id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center mb-2">
              <FaInfoCircle className="text-pink-500 mr-2" size={22} />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{titulo}</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">{mensaje}</p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <FaChalkboardTeacher />
                <span>{clase.docente}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaChalkboardTeacher />
                <span>{clase.modulo}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaCalendarAlt />
                <time dateTime={fecha}>{new Date(fecha).toLocaleDateString()}</time>
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-semibold">Grupo:</span>
                <span>{clase.grupo}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnunciosList;

