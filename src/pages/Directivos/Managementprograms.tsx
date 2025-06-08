import React, { useEffect, useState } from "react";
import { fetchAuth } from "../../utils/fetchAuth";

interface Programa {
  id: number;
  escuela: string;
  nombre: string;
  creado: string;
  actualizado: string;
}

const ManagementPrograms: React.FC = () => {
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    cargarProgramas();
  }, []);

  const cargarProgramas = async () => {
    setLoading(true);
    try {
      const response = await fetchAuth("/api/programa/lista");
      const data: Programa[] = await response.json();
      setProgramas(data);
    } catch (error) {
      console.error("Error al cargar programas:", error);
    } finally {
      setLoading(false);
    }
  };

  const crearPrograma = async () => {
    const escuela = prompt("Ingrese el nombre de la escuela:");
    if (!escuela) return alert("La escuela es requerida.");

    const nombre = prompt("Ingrese el nombre del programa:");
    if (!nombre) return alert("El nombre del programa es requerido.");

    try {
      const nuevoPrograma: Partial<Programa> = { escuela, nombre };
      const response = await fetchAuth("/api/programa/crear", {
        method: "POST",
        body: JSON.stringify(nuevoPrograma),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        await cargarProgramas();
      } else {
        console.error("Error al crear programa");
      }
    } catch (err) {
      console.error("Error al enviar datos:", err);
    }
  };

  const editarPrograma = async (programa: Programa) => {
    const nuevoNombre = prompt("Editar nombre del programa:", programa.nombre);
    if (!nuevoNombre) return;

    try {
      const actualizado = { ...programa, nombre: nuevoNombre };
      await fetchAuth(`/api/programa/editar/${programa.id}`, {
        method: "PUT",
        body: JSON.stringify(actualizado),
        headers: {
          "Content-Type": "application/json",
        },
      });

      await cargarProgramas();
    } catch (error) {
      console.error("Error al editar programa:", error);
    }
  };

  const eliminarPrograma = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este programa?")) return;

    try {
      await fetchAuth(`/api/programa/remover/${id}`, {
        method: "DELETE",
      });

      setProgramas((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error al eliminar programa:", error);
    }
  };

  const programasFiltrados = programas.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.escuela.toLowerCase().includes(term) ||
      p.nombre.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Programas Directivos</h2>
        <button
          onClick={crearPrograma}
          className="px-5 py-2 rounded-md text-white text-sm font-medium transition-colors bg-[#ed2e91] hover:bg-[#e01980]"
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
                <td className="py-3 px-4">
                  {new Date(programa.creado).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  {new Date(programa.actualizado).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 space-x-3">
                  <button
                    onClick={() => editarPrograma(programa)}
                    className="text-blue-600 hover:underline text-sm"
                    type="button"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarPrograma(programa.id)}
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
};

export default ManagementPrograms;
