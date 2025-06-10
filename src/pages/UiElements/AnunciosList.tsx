import React, { useEffect, useState } from "react";
import { fetchAuth } from "../../utils/fetchAuth";
import {
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaInfoCircle,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";

interface Clase {
  id: number;
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

interface GrupoEstudiante {
  grupoId: number;
  estudianteId: string;
}

const AnunciosList: React.FC = () => {
  const [usuario, setUsuario] = useState<any>(null);
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Para formulario de creación/edición
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalCrearLoading, setModalCrearLoading] = useState(false);
  const [modalCrearError, setModalCrearError] = useState<string | null>(null);

  // Para modal de confirmación de eliminación
  const [modalEliminarOpen, setModalEliminarOpen] = useState(false);
  const [modalEliminarLoading, setModalEliminarLoading] = useState(false);
  const [modalEliminarError, setModalEliminarError] = useState<string | null>(null);
  const [anuncioEliminarId, setAnuncioEliminarId] = useState<number | null>(null);

  // Para editar: guardamos el id del anuncio en edición o null si es creación
  const [anuncioEditarId, setAnuncioEditarId] = useState<number | null>(null);

  // Para lista de clases (para el select en crear/editar anuncio)
  const [clasesDocente, setClasesDocente] = useState<Clase[]>([]);

  // Formulario crear/editar anuncio
  const [formCrear, setFormCrear] = useState<{
    claseId: string;
    titulo: string;
    mensaje: string;
    fecha: string;
  }>({
    claseId: "",
    titulo: "",
    mensaje: "",
    fecha: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (!usuario) return;

    const cargarAnuncios = async () => {
      setLoading(true);
      setError(null);
      let anunciosTotales: Anuncio[] = [];

      try {
        if (usuario.tipo === "ESTUDIANTE") {
          const grupoRes = await fetchAuth(
            `/api/grupo-estudiante/estudiante/${usuario.id}`
          );
          const grupos: GrupoEstudiante[] = await grupoRes.json();

          for (const grupo of grupos) {
            const claseRes = await fetchAuth(`/api/clase/grupo/${grupo.grupoId}`);
            const clases: Clase[] = await claseRes.json();

            for (const clase of clases) {
              const anuncioRes = await fetchAuth(`/api/anuncio/clase/${clase.id}`);
              if (anuncioRes.ok && anuncioRes.status !== 204) {
                const anunciosClase: Anuncio[] = await anuncioRes.json();
                anunciosTotales.push(...anunciosClase);
              }
            }
          }
        }

        if (usuario.tipo === "DOCENTE") {
          const claseRes = await fetchAuth(`/api/clase/docente/${usuario.id}`);
          const clases: Clase[] = await claseRes.json();
          setClasesDocente(clases);

          for (const clase of clases) {
            const anuncioRes = await fetchAuth(`/api/anuncio/clase/${clase.id}`);
            if (anuncioRes.ok && anuncioRes.status !== 204) {
              const anunciosClase: Anuncio[] = await anuncioRes.json();
              anunciosTotales.push(...anunciosClase);
            }
          }
        }

        setAnuncios(anunciosTotales);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los anuncios.");
      } finally {
        setLoading(false);
      }
    };

    cargarAnuncios();
  }, [usuario]);

  // --- FUNCIONES CREAR / EDITAR ---

  // Abrir modal crear con campos vacíos
  const abrirModalCrear = () => {
    setAnuncioEditarId(null);
    setFormCrear({
      claseId: "",
      titulo: "",
      mensaje: "",
      fecha: new Date().toISOString().split("T")[0],
    });
    setModalCrearError(null);
    setModalCrearOpen(true);
  };

  // Abrir modal editar con campos llenos según anuncio
  const abrirModalEditar = (anuncio: Anuncio) => {
    setAnuncioEditarId(anuncio.id);
    setFormCrear({
      claseId: String(anuncio.clase.id),
      titulo: anuncio.titulo,
      mensaje: anuncio.mensaje,
      fecha: anuncio.fecha,
    });
    setModalCrearError(null);
    setModalCrearOpen(true);
  };

  const handleChangeCrear = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormCrear((prev) => ({ ...prev, [name]: value }));
  };

  const handleCrearSubmit = async () => {
    setModalCrearLoading(true);
    setModalCrearError(null);

    if (!formCrear.claseId || !formCrear.titulo || !formCrear.mensaje || !formCrear.fecha) {
      setModalCrearError("Por favor completa todos los campos.");
      setModalCrearLoading(false);
      return;
    }

    try {
      const payload = {
        claseId: Number(formCrear.claseId),
        titulo: formCrear.titulo.trim(),
        mensaje: formCrear.mensaje.trim(),
        fecha: formCrear.fecha,
      };

      let res: Response;

      if (anuncioEditarId === null) {
        // Crear nuevo
        res = await fetchAuth("/api/anuncio/crear", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Editar existente
        res = await fetchAuth(`/api/anuncio/editar/${anuncioEditarId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || (anuncioEditarId === null ? "Error al crear anuncio" : "Error al actualizar anuncio"));
      }

      setModalCrearOpen(false);
      setAnuncioEditarId(null);
      await recargarAnuncios();
    } catch (error: any) {
      setModalCrearError(error.message || "Error desconocido");
    } finally {
      setModalCrearLoading(false);
    }
  };

  // --- FUNCIONES ELIMINAR ---

  const abrirModalEliminar = (id: number) => {
    setAnuncioEliminarId(id);
    setModalEliminarError(null);
    setModalEliminarOpen(true);
  };

  const handleEliminarConfirm = async () => {
    if (anuncioEliminarId === null) return;

    setModalEliminarLoading(true);
    setModalEliminarError(null);

    try {
      const res = await fetchAuth(`/api/anuncio/remover/${anuncioEliminarId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error al eliminar anuncio");
      }

      setModalEliminarOpen(false);
      setAnuncioEliminarId(null);
      await recargarAnuncios();
    } catch (error: any) {
      setModalEliminarError(error.message || "Error desconocido");
    } finally {
      setModalEliminarLoading(false);
    }
  };

  const recargarAnuncios = async () => {
    setLoading(true);
    setError(null);
    let anunciosTotales: Anuncio[] = [];

    try {
      if (usuario?.tipo === "ESTUDIANTE") {
        const grupoRes = await fetchAuth(
          `/api/grupo-estudiante/estudiante/${usuario.id}`
        );
        const grupos: GrupoEstudiante[] = await grupoRes.json();

        for (const grupo of grupos) {
          const claseRes = await fetchAuth(`/api/clase/grupo/${grupo.grupoId}`);
          const clases: Clase[] = await claseRes.json();

          for (const clase of clases) {
            const anuncioRes = await fetchAuth(`/api/anuncio/clase/${clase.id}`);
            if (anuncioRes.ok && anuncioRes.status !== 204) {
              const anunciosClase: Anuncio[] = await anuncioRes.json();
              anunciosTotales.push(...anunciosClase);
            }
          }
        }
      }

      if (usuario?.tipo === "DOCENTE") {
        for (const clase of clasesDocente) {
          const anuncioRes = await fetchAuth(`/api/anuncio/clase/${clase.id}`);

          if (anuncioRes.ok && anuncioRes.status !== 204) {
            const anunciosClase: Anuncio[] = await anuncioRes.json();
            anunciosTotales.push(...anunciosClase);
          }
        }
      }

      setAnuncios(anunciosTotales);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los anuncios.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-pink-600 flex items-center gap-2">
        Anuncios Recientes
        {usuario?.tipo === "DOCENTE" && (
          <button
            onClick={abrirModalCrear}
            className="ml-auto text-green-600 hover:text-green-800"
            title="Crear Anuncio"
          >
            <FaPlus size={20} />
          </button>
        )}
      </h2>

      {loading && <p className="text-center text-gray-500">Cargando anuncios...</p>}
      {error && <p className="text-red-600 mb-4 font-semibold">{error}</p>}

      {anuncios.length === 0 && !loading && (
        <p className="text-center text-gray-600">No hay anuncios disponibles.</p>
      )}

      <ul className="space-y-4">
        {anuncios.map(({ id, titulo, mensaje, fecha, clase }) => (
          <li
            key={id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center mb-2 justify-between">
              <div className="flex items-center gap-2">
                <FaInfoCircle className="text-pink-500" size={22} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {titulo}
                </h3>
              </div>
              {usuario?.tipo === "DOCENTE" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => abrirModalEditar(anuncios.find(a => a.id === id)!)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Editar Anuncio"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => abrirModalEliminar(id)}
                    className="text-red-600 hover:text-red-800"
                    title="Eliminar Anuncio"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
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

      {/* Modal Crear/Editar Anuncio */}
      {modalCrearOpen && (
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
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg shadow-lg relative">
            <h2 className="text-xl font-bold mb-4 text-pink-600">
              {anuncioEditarId === null ? "Crear Anuncio" : "Editar Anuncio"}
            </h2>

            {modalCrearError && (
              <p className="text-red-600 mb-3 font-semibold">{modalCrearError}</p>
            )}

            <label className="block mb-2">
              Clase:
              <select
                name="claseId"
                value={formCrear.claseId}
                onChange={handleChangeCrear}
                className="w-full mt-1 p-2 border rounded"
              >
                <option value="">Selecciona una clase</option>
                {clasesDocente.map((clase) => (
                  <option key={clase.id} value={clase.id}>
                    {clase.modulo} - Grupo {clase.grupo}
                  </option>
                ))}
              </select>
            </label>

            <label className="block mb-2">
              Título:
              <input
                type="text"
                name="titulo"
                value={formCrear.titulo}
                onChange={handleChangeCrear}
                className="w-full mt-1 p-2 border rounded"
                placeholder="Título del anuncio"
              />
            </label>

            <label className="block mb-2">
              Mensaje:
              <textarea
                name="mensaje"
                value={formCrear.mensaje}
                onChange={handleChangeCrear}
                className="w-full mt-1 p-2 border rounded"
                rows={4}
                placeholder="Mensaje del anuncio"
              />
            </label>

            <label className="block mb-4">
              Fecha:
              <input
                type="date"
                name="fecha"
                value={formCrear.fecha}
                onChange={handleChangeCrear}
                className="w-full mt-1 p-2 border rounded"
              />
            </label>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setModalCrearOpen(false);
                  setAnuncioEditarId(null);
                }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                disabled={modalCrearLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleCrearSubmit}
                className="px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-700 disabled:opacity-50"
                disabled={modalCrearLoading}
              >
                {modalCrearLoading
                  ? anuncioEditarId === null
                    ? "Creando..."
                    : "Actualizando..."
                  : anuncioEditarId === null
                  ? "Crear"
                  : "Actualizar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmación Eliminar */}
      {modalEliminarOpen && (
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
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-lg relative">
            <h2 className="text-xl font-bold mb-4 text-red-600">Eliminar Anuncio</h2>

            {modalEliminarError && (
              <p className="text-red-600 mb-3 font-semibold">{modalEliminarError}</p>
            )}

            <p className="mb-6">
              ¿Estás seguro que deseas eliminar este anuncio? Esta acción no se puede
              deshacer.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalEliminarOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                disabled={modalEliminarLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminarConfirm}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                disabled={modalEliminarLoading}
              >
                {modalEliminarLoading ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnunciosList;
