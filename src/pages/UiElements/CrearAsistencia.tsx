import React, { useEffect, useState } from "react";
import { fetchAuth } from "../../utils/fetchAuth";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { hideLoader, showLoader } from "../../components/common/Loader";

interface ClaseInfo {
  grupo: string;
  docente: string;
  modulo: string;
}

interface Asistencia {
  id: number;
  clase: ClaseInfo;
  estudiante: string;
  fecha: string;
  estado: "ASISTIO" | "JUSTIFICADO" | "INASISTENCIA";
}

interface Clase {
  id: number;
  modulo: string;
  grupo: string;
  docente: string;
}

interface Estudiante {
  id: number;
  nombre: string;
}

interface Grupo {
  id: number;
  nombre: string;
  codigo: string;
}

interface GrupoEstudiante {
  grupoId: number;
  estudianteId: number;
}

const estados: Asistencia["estado"][] = ["ASISTIO", "JUSTIFICADO", "INASISTENCIA"];

const AsistenciasProfesor: React.FC = () => {
  const [clases, setClases] = useState<Clase[]>([]);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);

  // Modal para crear/editar
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const [form, setForm] = useState<{
    id: number;
    claseId: string;
    estudianteId: string;
    fecha: string;
    estado: Asistencia["estado"];
  }>({
    id: 0,
    claseId: "",
    estudianteId: "",
    fecha: new Date().toISOString().split("T")[0],
    estado: "ASISTIO",
  });

  // Modal para confirmación de eliminación
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    cargarAsistenciasDocente();
  }, []);

  const cargarAsistenciasDocente = async () => {
    try {
      const usuarioStorage = localStorage.getItem("usuario");
      if (!usuarioStorage) return;
      const usuario = JSON.parse(usuarioStorage);

      // Obtener clases del docente
      
      showLoader("Cargando asistencias...")
      const claseResp = await fetchAuth(`/api/clase/docente/${usuario.id}`);
      if (!claseResp.ok) throw new Error("Error cargando clases");
      const claseData: Clase[] = await claseResp.json();
      setClases(claseData);

      // Obtener grupos relacionados a las clases
      const grupos: Grupo[] = [];
      for (const clase of claseData) {
        const grupoResp = await fetchAuth(`/api/grupo/buscar/codigo/${clase.grupo}`);
        if (!grupoResp.ok) continue;
        const grupoData: Grupo[] = await grupoResp.json();
        grupos.push(...grupoData);
      }

      // Obtener estudiantes de esos grupos sin duplicados
      const estudiantesMap = new Map<number, Estudiante>();
      for (const grupo of grupos) {
        const grupoEstResp = await fetchAuth(`/api/grupo-estudiante/grupo/${grupo.id}`);
        if (!grupoEstResp.ok) continue;
        const grupoEstData: GrupoEstudiante[] = await grupoEstResp.json();

        for (const ge of grupoEstData) {
          if (!estudiantesMap.has(ge.estudianteId)) {
            const estudianteResp = await fetchAuth(`/api/usuario/${ge.estudianteId}`);
            if (!estudianteResp.ok) continue;
            const estudianteData: Estudiante = await estudianteResp.json();
            estudiantesMap.set(estudianteData.id, estudianteData);
          }
        }
      }
      const estudiantesArray = Array.from(estudiantesMap.values());
      setEstudiantes(estudiantesArray);

      // Obtener asistencias
      const todasAsistencias: Asistencia[] = [];
      for (const estudiante of estudiantesArray) {
        const asistenciaResp = await fetchAuth(`/api/asistencia/estudiante/${estudiante.id}`);
        if (!asistenciaResp.ok) continue;
        const asistenciasEst: Asistencia[] = await asistenciaResp.json();

        todasAsistencias.push(...asistenciasEst);
      }

      setAsistencias(todasAsistencias);
    } catch (error) {
      console.error("Error cargando asistencias:", error);
      alert("Error al cargar las asistencias. Intenta nuevamente.");
    } finally {
      hideLoader();
    }
  };

  const openModalNueva = () => {
    setForm({
      id: 0,
      claseId: "",
      estudianteId: "",
      fecha: new Date().toISOString().split("T")[0],
      estado: "ASISTIO",
    });
    setModalError(null);
    setModalOpen(true);
  };

  const openModalEditar = (asistencia: Asistencia) => {
    const claseEncontrada = clases.find(
      (c) =>
        c.grupo === asistencia.clase.grupo &&
        c.docente === asistencia.clase.docente &&
        c.modulo === asistencia.clase.modulo
    );

    const estudianteEncontrado = estudiantes.find((e) => e.nombre === asistencia.estudiante);

    setForm({
      id: asistencia.id,
      claseId: claseEncontrada ? claseEncontrada.id.toString() : "",
      estudianteId: estudianteEncontrado ? estudianteEncontrado.id.toString() : "",
      fecha: asistencia.fecha,
      estado: asistencia.estado,
    });
    setModalError(null);
    setModalOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setModalLoading(true);
    setModalError(null);

    if (!form.claseId || !form.estudianteId || !form.fecha || !form.estado) {
      setModalError("Por favor completa todos los campos.");
      setModalLoading(false);
      return;
    }

    try {
      const claseSeleccionada = clases.find((c) => c.id === Number(form.claseId));
      const estudianteSeleccionado = estudiantes.find((e) => e.id === Number(form.estudianteId));

      if (!claseSeleccionada || !estudianteSeleccionado) {
        setModalError("Clase o estudiante inválido.");
        setModalLoading(false);
        return;
      }

      const payload = {
        claseId: claseSeleccionada.id,
        estudianteId: estudianteSeleccionado.id,
        fecha: form.fecha,
        estado: form.estado,
      };

      let res: Response;

      if (form.id === 0) {
        showLoader("Creando asistencia...")
        res = await fetchAuth("/api/asistencia/crear", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        showLoader("Editando asistencia...")
        res = await fetchAuth(`/api/asistencia/editar/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Error al guardar asistencia");
      }

      setModalOpen(false);
      await cargarAsistenciasDocente();
    } catch (error: any) {
      setModalError(error.message || "Error desconocido");
    } finally {
      hideLoader();
      setModalLoading(false);
    }
  };

  // Nuevo: abrir modal de confirmación para eliminar
  const openDeleteModal = (id: number) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleEliminarConfirmado = async () => {
    if (deleteId === null) return;

    setDeleteLoading(true);
    try {
      showLoader("Eliminando asistencias...");
      const res = await fetchAuth(`/api/asistencia/remover/${deleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar asistencia");

      setDeleteModalOpen(false);
      setDeleteId(null);
      await cargarAsistenciasDocente();
    } catch (error) {
      alert("No se pudo eliminar la asistencia.");
    } finally {
      hideLoader();
      setDeleteLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow border">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Gestión de Asistencias</h1>
        <button
          onClick={openModalNueva}
          className="flex items-center gap-2 bg-[#ed2e91] hover:bg-[#d01b7f] text-white px-4 py-2 rounded-md"
        >
          <FiPlus />
          Nueva Asistencia
        </button>
      </div>

      {asistencias.length === 0 ? (
        <p>No hay asistencias registradas.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Módulo</th>
              <th className="border p-2 text-left">Grupo</th>
              <th className="border p-2 text-left">Docente</th>
              <th className="border p-2 text-left">Estudiante</th>
              <th className="border p-2 text-left">Fecha</th>
              <th className="border p-2 text-left">Estado</th>
              <th className="border p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {asistencias.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="border p-2">{a.clase.modulo}</td>
                <td className="border p-2">{a.clase.grupo}</td>
                <td className="border p-2">{a.clase.docente}</td>
                <td className="border p-2">{a.estudiante}</td>
                <td className="border p-2">{a.fecha}</td>
                <td className="border p-2">{a.estado}</td>
                <td className="border p-2 text-center space-x-2">
                  <button
                    onClick={() => openModalEditar(a)}
                    className="text-blue-600 hover:text-blue-800"
                    aria-label="Editar asistencia"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => openDeleteModal(a.id)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Eliminar asistencia"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal Crear/Editar */}
      {modalOpen && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(255,255,255,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
            <h2 className="text-lg font-semibold mb-4">
              {form.id === 0 ? "Nueva Asistencia" : "Editar Asistencia"}
            </h2>

            <div className="space-y-4">
              <select
                name="claseId"
                value={form.claseId}
                onChange={handleChange}
                className="border p-2 rounded-md w-full"
                required
              >
                <option value="">Seleccionar clase</option>
                {clases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.modulo} - Grupo {c.grupo} - {c.docente}
                  </option>
                ))}
              </select>

              <select
                name="estudianteId"
                value={form.estudianteId}
                onChange={handleChange}
                className="border p-2 rounded-md w-full"
                required
              >
                <option value="">Seleccionar estudiante</option>
                {estudiantes.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre}
                  </option>
                ))}
              </select>

              <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                className="border p-2 rounded-md w-full"
                required
              />

              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="border p-2 rounded-md w-full"
                required
              >
                {estados.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>

              {modalError && <p className="text-red-600">{modalError}</p>}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-md"
                  disabled={modalLoading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={modalLoading}
                  className="px-4 py-2 bg-[#ed2e91] hover:bg-[#d01b7f] text-white rounded-md font-semibold"
                >
                  {modalLoading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmación Eliminar */}
      {deleteModalOpen && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(255,255,255,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000,
          }}
        >
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg relative">
            <h2 className="text-lg font-semibold mb-4 text-center">Confirmar eliminación</h2>
            <p className="mb-6 text-center">¿Estás seguro que deseas eliminar esta asistencia?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleteLoading}
                className="px-4 py-2 border rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminarConfirmado}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold"
              >
                {deleteLoading ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AsistenciasProfesor;
