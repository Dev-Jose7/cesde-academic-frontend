import React, { useEffect, useState } from "react";
import { fetchAuth } from "../../utils/fetchAuth";
import { hideLoader, showLoader } from "../../components/common/Loader";

interface Programa {
  id: number;
  escuela: string;
  nombre: string;
  creado: string;
  actualizado: string;
}

const ManagementPrograms: React.FC = () => {
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [escuelas, setEscuelas] = useState<{ id: number; nombre: string }[]>([]);
  const [escuelaSeleccionada, setEscuelaSeleccionada] = useState<number | null>(null);

  // Modal de creación/edición
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Crear Programa");
  const [nombreInput, setNombreInput] = useState("");
  const [programaSeleccionado, setProgramaSeleccionado] = useState<Programa | null>(null);

  // Modal de eliminación
  const [modalEliminarOpen, setModalEliminarOpen] = useState(false);
  const [programaAEliminar, setProgramaAEliminar] = useState<Programa | null>(null);

  useEffect(() => {
    cargarProgramas();
    cargarEscuelas(); // Cargar escuelas de inmediato
  }, []);

  const cargarEscuelas = async () => {
    try {
      const response = await fetchAuth("/api/escuela/lista");
      const data = await response.json();
      setEscuelas(data);
    } catch (error) {
      console.error("Error al cargar las escuelas:", error);
    }
  };

  const cargarProgramas = async () => {
    try {
      showLoader("Cargando programas...");
      const response = await fetchAuth("/api/programa/lista");
      const data: Programa[] = await response.json();
      setProgramas(data);
    } catch (error) {
      console.error("Error al cargar programas:", error);
    } finally {
      hideLoader();
    }
  };

  const abrirModalCrear = () => {
    setModalTitle("Crear Programa");
    setNombreInput("");
    setEscuelaSeleccionada(null);
    setProgramaSeleccionado(null);
    setModalOpen(true);
  };

  const abrirModalEditar = (programa: Programa) => {
    setModalTitle("Editar Programa");
    setNombreInput(programa.nombre);
    const escuela = escuelas.find(e => e.nombre === programa.escuela);
    setEscuelaSeleccionada(escuela ? escuela.id : null);
    setProgramaSeleccionado(programa);
    setModalOpen(true);
  };

  const handleGuardar = async () => {
    if (!nombreInput || !escuelaSeleccionada) {
      alert("Todos los campos son requeridos.");
      return;
    }

    try {
      showLoader(programaSeleccionado ? "Editando programa..." : "Creando programa...");

      if (programaSeleccionado) {
        // Editar
        await fetchAuth(`/api/programa/editar/${programaSeleccionado.id}`, {
          method: "PUT",
          body: JSON.stringify({
            escuelaId: escuelas.find(e => e.id === escuelaSeleccionada)?.id || "",
            nombre: nombreInput,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        // Crear
        await fetchAuth("/api/programa/crear", {
          method: "POST",
          body: JSON.stringify({
            escuelaId: escuelas.find(e => e.id === escuelaSeleccionada)?.id || "",
            nombre: nombreInput,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      await cargarProgramas();
      setModalOpen(false);
    } catch (error) {
      console.error("Error al guardar programa:", error);
      alert("Hubo un error al guardar el programa.");
    } finally {
      hideLoader();
    }
  };

  const confirmarEliminar = (programa: Programa) => {
    setProgramaAEliminar(programa);
    setModalEliminarOpen(true);
  };

  const eliminarPrograma = async () => {
    if (!programaAEliminar) return;

    try {
      showLoader("Eliminando programa...");
      await fetchAuth(`/api/programa/remover/${programaAEliminar.id}`, {
        method: "DELETE",
      });
      setProgramas(prev => prev.filter(p => p.id !== programaAEliminar.id));
      setModalEliminarOpen(false);
    } catch (error) {
      console.error("Error al eliminar programa:", error);
    } finally {
      hideLoader();
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
          onClick={abrirModalCrear}
          className="px-5 py-2 rounded-md text-white text-sm font-medium transition-colors bg-[#ed2e91] hover:bg-[#e01980]"
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

      {programasFiltrados.length === 0 ? (
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
                    onClick={() => abrirModalEditar(programa)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => confirmarEliminar(programa)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal Crear/Editar */}
      {modalOpen && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.3)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}>
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl relative">
            <h3 className="text-xl font-semibold mb-4">{modalTitle}</h3>
            <select
              value={escuelaSeleccionada || ""}
              onChange={(e) => setEscuelaSeleccionada(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
            >
              <option value="">Seleccione una escuela</option>
              {escuelas.map((escuela) => (
                <option key={escuela.id} value={escuela.id}>
                  {escuela.nombre}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={nombreInput}
              onChange={(e) => setNombreInput(e.target.value)}
              placeholder="Nombre del programa"
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

      {/* Modal Confirmación de eliminación */}
      {modalEliminarOpen && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.3)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}>
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl relative">
            <h3 className="text-xl font-semibold mb-4">Confirmar eliminación</h3>
            <p className="mb-6">
              ¿Estás seguro de que deseas eliminar el programa{" "}
              <strong>{programaAEliminar?.nombre}</strong>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setModalEliminarOpen(false)}
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={eliminarPrograma}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagementPrograms;
