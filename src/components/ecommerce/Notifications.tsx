import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { fetchAuth } from "../../utils/fetchAuth";

interface Anuncio {
  id: number;
  titulo: string,
  mensaje: string,
  fecha: string; // si tu API devuelve fecha, úsala para ordenar
}

export default function Notifications() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerAnuncios = async () => {
      try {
        const res = await fetchAuth("/api/anuncio/lista");
        const data: Anuncio[] = await res.json();

        // Ordenar por ID descendente (suponiendo que mayor ID = más reciente)
        const ultimosCinco = data
          .sort((a, b) => b.id - a.id) // o usar fechaCreacion si está disponible
          .slice(0, 4);

        setAnuncios(ultimosCinco);
      } catch (error) {
        console.error("Error al cargar los anuncios:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerAnuncios();
  }, []);

  return (
    <div className="p-6 bg-white rounded-2xl border border-gray-200">
      <div className="flex items-center mb-4">
        <Bell className="w-5 h-5 text-[#ed2e91] mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Notificaciones</h2>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Cargando anuncios...</p>
      ) : anuncios.length === 0 ? (
        <p className="text-sm text-gray-500">No hay notificaciones.</p>
      ) : (
        <ul className="space-y-3 text-gray-700 text-sm">
          {anuncios.map(({ id, mensaje }) => (
            <li
              key={id}
              className="bg-[#fff0f7] text-[#ed2e91] px-4 py-2 rounded-lg border border-[#ed2e91] hover:bg-[#ffe3ef] transition"
            >
              {mensaje}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
