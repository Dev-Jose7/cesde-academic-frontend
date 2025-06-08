import React, { useEffect, useState } from "react";
import axios from "axios";

const datosQuemados = [
  {
    id: 1,
    escuela: "Nuevas Tecnologías",
    nombre: "Técnico Laboral como Asistente en Desarrollo de Software",
    creado: "2025-05-15T16:11:12.227179",
    actualizado: "2025-05-15T16:11:12.227153",
  },
  {
    id: 2,
    escuela: "Industrias Creativas",
    nombre: "Técnico Laboral como Asistente de Animación 3D/VFX",
    creado: "2025-05-15T17:18:04.838258",
    actualizado: "2025-05-15T17:18:04.838191",
  },
];

export default function ManagementPrograms() {
  const [programas, setProgramas] = useState(datosQuemados);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProgramas();
  }, []);

  const fetchProgramas = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://cesde-academic-app-development.up.railway.app/programa/lista"
      );
      if (Array.isArray(response.data) && response.data.length > 0) {
        setProgramas(response.data);
      } else {
        console.warn(
          "API respondió con datos vacíos o no es arreglo, manteniendo datos quemados."
        );
      }
    } catch (error) {
      console.error("Error al cargar programas:", error);
      // Se mantienen datos quemados si hay error
    } finally {
      setLoading(false);
    }
  };

  const handleCrear = () => {
    const escuela = prompt("Ingrese el nombre de la escuela:");
    if (!escuela) return alert("La escuela es requerida.");

    const nombre = prompt("Ingrese el nombre del programa:");
    if (!nombre) return alert("El nombre del programa es requerido.");

    const nuevoId = programas.length > 0 ? Math.max(...programas.map((p) => p.id)) + 1 : 1;

    const nuevoPrograma = {
      id: nuevoId,
      escuela,
      nombre,
      creado: new Date().toISOString(),
      actualizado: new Date().toISOString(),
    };

    setProgramas((prev) => [nuevoPrograma, ...prev]);
  };

  // FILTRADO SOLO POR ESCUELA Y NOMBRE, NO POR ID
  const programasFiltrados = programas.filter((p) => {
    const escuela = p?.escuela?.toLowerCase() ?? "";
    const nombre = p?.nombre?.toLowerCase() ?? "";
    const term = searchTerm.toLowerCase();
    return escuela.includes(term) || nombre.includes(term);
  });

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Programas Directivos</h2>
        <button
          onClick={handleCrear}
          className="px-5 py-2 rounded-md text-white text-sm font-medium transition-colors"
          style={{ backgroundColor: "#ed2e91" }}
          type="button"
        >
          Crear Programa
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar por escuela o nombre del programa..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4 px-4 py-2 border rounded-md text-gray-700"
      />

      {loading ? (
        <p className="text-center text-gray-500">Cargando programas...</p>
      ) : programasFiltrados.length === 0 ? (
        <p className="text-center text-gray-500">No se encontraron programas.</p>
      ) : (
        <table className="w-full text-left text-gray-700 text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4">Escuela</th>
              <th className="py-3 px-4">Nombre del Programa</th>
              <th className="py-3 px-4">Creado</th>
              <th className="py-3 px-4">Actualizado</th>
              <th className="py-3 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {programasFiltrados.map((programa) => (
              <tr key={programa.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-medium">{programa.escuela}</td>
                <td className="py-3 px-4">{programa.nombre}</td>
                <td className="py-3 px-4">{new Date(programa.creado).toLocaleDateString()}</td>
                <td className="py-3 px-4">{new Date(programa.actualizado).toLocaleDateString()}</td>
                <td className="py-3 px-4 space-x-3">
                  <button
                    className="text-red-600 hover:underline text-sm"
                    type="button"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}



