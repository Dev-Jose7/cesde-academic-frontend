import React, { useEffect, useState } from "react";
import {
  FaLaptop,
  FaPaintBrush,
  FaBook,
  FaSyringe,
  FaTree,
} from "react-icons/fa";
import { GiChefToque } from "react-icons/gi";
import { fetchAuth } from "../../utils/fetchAuth";

interface Escuela {
  id: number;
  nombre: string;
}

const Iconos: Record<string, React.ReactNode> = {
  "Nuevas Tecnologías": <FaLaptop size={20} color="white" />,
  "Industrias Creativas": <FaPaintBrush size={20} color="white" />,
  "Gastronomía y Turismo": <GiChefToque size={20} color="white" />,
  "Desarrollo Empresarial": <FaBook size={20} color="white" />,
  "Salud y Cuidado": <FaSyringe size={20} color="white" />,
  "Agro": <FaTree size={20} color="white" />,
};

async function fetchAuthJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetchAuth(url, options);
  if (!response.ok) {
    throw new Error(`Error al obtener datos de ${url} (status ${response.status})`);
  }
  return response.json();
}

export default function EscuelasPanel() {
  const [escuelas, setEscuelas] = useState<Escuela[]>([]);
  const [loading, setLoading] = useState(false);

  // Estado modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [currentEscuela, setCurrentEscuela] = useState<Escuela | null>(null);
  const [nombreInput, setNombreInput] = useState("");

  // Fetch escuelas
  const fetchEscuelas = async () => {
    setLoading(true);
    try {
      const data = await fetchAuthJson<Escuela[]>("/api/escuela/lista");
      if (Array.isArray(data)) setEscuelas(data);
    } catch (error) {
      console.error("Error al obtener escuelas:", error);
      setEscuelas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEscuelas();
  }, []);

  // Abrir modal crear
  const handleCrear = () => {
    setModalTitle("Crear Escuela");
    setCurrentEscuela(null);
    setNombreInput("");
    setModalOpen(true);
  };

  // Abrir modal editar
  const handleEditar = (escuela: Escuela) => {
    setModalTitle("Editar Escuela");
    setCurrentEscuela(escuela);
    setNombreInput(escuela.nombre);
    setModalOpen(true);
  };

  // Guardar (crear o editar)
  const handleGuardar = async () => {
    if (nombreInput.trim() === "") {
      alert("El nombre no puede estar vacío.");
      return;
    }

    try {
      if (currentEscuela) {
        // Editar (PUT)
        const res = await fetchAuth(`/api/escuela/editar/${currentEscuela.id}`, {
          method: "PUT",
          body: JSON.stringify({ nombre: nombreInput.trim() }),
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Error actualizando escuela");
      } else {
        // Crear (POST)
        const res = await fetchAuth(`/api/escuela/crear`, {
          method: "POST",
          body: JSON.stringify({ nombre: nombreInput.trim() }),
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Error creando escuela");
      }

      setModalOpen(false);
      fetchEscuelas();
    } catch (error) {
      alert("Hubo un error al guardar la escuela. Intenta nuevamente.");
      console.error(error);
    }
  };

  // Eliminar escuela
  const handleEliminar = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta escuela?")) return;
    try {
      const res = await fetchAuth(`/api/escuela/remover/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error eliminando escuela");
      setEscuelas((prev) => prev.filter((esc) => esc.id !== id));
    } catch (error) {
      alert("No se pudo eliminar la escuela. Intenta nuevamente.");
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Escuelas</h2>
        <button
          onClick={handleCrear}
          className="px-5 py-2 rounded-md text-white text-sm font-medium"
          style={{ backgroundColor: "#ff5176" }}
        >
          Crear Escuela
        </button>
      </div>

      {loading && (
        <p className="text-center text-sm text-gray-500 mb-4">
          Actualizando datos desde el servidor...
        </p>
      )}

      <table className="w-full text-left text-gray-700 text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-4"></th>
            <th className="py-3 px-4">Nombre</th>
            <th className="py-3 px-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {escuelas.length > 0 ? (
            escuelas.map((esc) => (
              <tr key={esc.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <div
                    className="flex justify-center items-center rounded-full"
                    style={{ backgroundColor: "#ff5176", width: 36, height: 36 }}
                    title={esc.nombre}
                  >
                    {Iconos[esc.nombre] || null}
                  </div>
                </td>
                <td className="py-3 px-4 font-medium">{esc.nombre}</td>
                <td className="py-3 px-4 space-x-3">
                  <button
                    onClick={() => handleEditar(esc)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(esc.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : !loading ? (
            <tr>
              <td colSpan={3} className="text-center py-6 text-gray-500">
                No hay escuelas disponibles
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
            <h3 className="text-xl font-semibold mb-4">{modalTitle}</h3>
            <input
              type="text"
              value={nombreInput}
              onChange={(e) => setNombreInput(e.target.value)}
              placeholder="Nombre de la escuela"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                className="px-4 py-2 rounded-md bg-pink-500 text-white hover:bg-pink-600"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
