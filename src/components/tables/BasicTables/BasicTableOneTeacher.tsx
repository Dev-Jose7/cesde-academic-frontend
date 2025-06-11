import { useEffect, useState } from "react";
import { fetchAuth } from "../../../utils/fetchAuth";
import "./CalificacionesTeacher.css";
import { FiEdit, FiTrash } from "react-icons/fi";
import { hideLoader, showLoader } from "../../common/Loader";

interface Calificacion {
  id: number;
  actividad: {
    id: number;
    titulo: string;
    tipo: "TAREA" | "EVALUACION" | "PROYECTO" | "TALLER";
  };
  estudiante: string;
  fecha: string;
  nota: number;
  actividadId?: number;
  estudianteId?: number;
}

interface Actividad {
  id: number;
  claseId: number;
  titulo: string;
  descripcion: string;
  tipo: "TAREA" | "EVALUACION" | "PROYECTO" | "TALLER" | null;
  fechaEntrega: string;
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

interface Clase {
  id: number;
  grupo: string;
  docente: string;
  modulo: string;
}

interface Estudiante {
  id: number;
  nombre: string;
}

export default function BasicTableOneTeacher() {
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [filtroActividad, setFiltroActividad] = useState<string>("");
  const [busqueda, setBusqueda] = useState<string>("");
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [actividadIdCrear, setActividadIdCrear] = useState<number | null>(null);
  const [estudianteIdCrear, setEstudianteIdCrear] = useState<number | null>(null);
  const [notaCrear, setNotaCrear] = useState<number>(0);

  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [calificacionSeleccionada, setCalificacionSeleccionada] = useState<Calificacion | null>(null);
  const [notaEditar, setNotaEditar] = useState<number>(0);

  const [modalEliminarOpen, setModalEliminarOpen] = useState(false);

  useEffect(() => {
    recargarCalificaciones();
  }, []);

  const recargarCalificaciones = async () => {
    try {
      showLoader("Cargando calificaciones");
      const usuarioStorage = localStorage.getItem("usuario");
      if (!usuarioStorage) return;
      const usuario = JSON.parse(usuarioStorage);
  
      const claseResp = await fetchAuth(`/api/clase/docente/${usuario.id}`);
      const claseData: Clase[] = await claseResp.json();
  
      const actividadesCargadas: Actividad[] = [];
      for (const clase of claseData) {
        const actividadResp = await fetchAuth(`/api/actividad/clase/${clase.id}`);
        const actividadData: Actividad[] = await actividadResp.json();
        actividadesCargadas.push(...actividadData);
      }
      setActividades(actividadesCargadas);
  
      const grupos: Grupo[] = [];
      for (const clase of claseData) {
        const grupoResp = await fetchAuth(`/api/grupo/buscar/codigo/${clase.grupo}`);
        const grupoData: Grupo[] = await grupoResp.json();
        grupos.push(...grupoData);
      }
  
      const estudiantesMap = new Map<number, Estudiante>();
      for (const grupo of grupos) {
        const grupoEstResp = await fetchAuth(`/api/grupo-estudiante/grupo/${grupo.id}`);
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
  
      const todasCalificaciones: Calificacion[] = [];
      for (const estudiante of estudiantesArray) {
        const calificacionResp = await fetchAuth(`/api/calificacion/estudiante/${estudiante.id}`);
        if (!calificacionResp.ok) continue;
        const calificacionesEst: Calificacion[] = await calificacionResp.json();
  
        for (const cal of calificacionesEst) {
          const actividad = cal.actividad;
          if (actividad) {
            cal.actividadId = actividad.id;
          }
          cal.estudiante = estudiante.nombre;
          cal.estudianteId = estudiante.id;
        }
  
        todasCalificaciones.push(...calificacionesEst);
      }
  
      setCalificaciones(todasCalificaciones);
    } catch (error) {
      console.error("Error recargando calificaciones:", error);
    } finally {
      hideLoader();
    }
  };
  

  const calificacionesFiltradas = calificaciones.filter((cal) => {
    const coincideActividad =
      !filtroActividad || cal.actividad.id.toString() === filtroActividad;

    const coincideBusqueda = cal.estudiante.toLowerCase().includes(busqueda.toLowerCase());

    return coincideActividad && coincideBusqueda;
  });

  const crearCalificacion = async () => {
    if (actividadIdCrear === null || estudianteIdCrear === null) {
      alert("Debe seleccionar actividad y estudiante");
      return;
    }

    if (notaCrear < 0 || notaCrear > 5) {
      alert("La nota debe estar entre 0 y 5");
      return;
    }

    const body = {
      actividadId: actividadIdCrear,
      estudianteId: estudianteIdCrear,
      fecha: new Date().toISOString().split("T")[0],
      nota: notaCrear,
    };

    try {
      showLoader("Creando calificación...");
      const res = await fetchAuth("/api/calificacion/crear", {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        alert("Error al crear calificación");
        return;
      }
      const nueva: Calificacion = await res.json();

      const actividad = actividades.find((a) => a.id === nueva.actividadId);
      if (actividad) {
        nueva.actividad = {
          id: actividad.id,
          titulo: actividad.titulo,
          tipo: actividad.tipo!,
        };
      }

      const estudiante = estudiantes.find((e) => e.id === nueva.estudianteId);
      if (estudiante) {
        nueva.estudiante = estudiante.nombre;
      }

      cerrarModalCrear();
      await recargarCalificaciones();
    } catch (err) {
      console.error("Error creando calificación", err);
    } finally {
      hideLoader();
    }
  };

  const abrirModalEditar = (cal: Calificacion) => {
    if (!cal.actividadId && typeof cal.actividad === "object") {
      cal.actividadId = cal.actividad.id;
    }
    setCalificacionSeleccionada(cal);
    setNotaEditar(cal.nota);
    setModalEditarOpen(true);
  };

  const cerrarModalEditar = () => {
    setModalEditarOpen(false);
    setCalificacionSeleccionada(null);
  };

  const guardarEdicion = async () => {
    if (!calificacionSeleccionada) return;

    if (notaEditar < 0 || notaEditar > 5) {
      alert("La nota debe estar entre 0 y 5");
      return;
    }

    const actividadId = calificacionSeleccionada.actividadId ?? calificacionSeleccionada.actividad?.id;
    const estudianteId = calificacionSeleccionada.estudianteId;
    const fecha = calificacionSeleccionada.fecha;

    if (!actividadId || !estudianteId || !fecha) {
      alert("Faltan datos requeridos para editar");
      return;
    }

    const body = {
      actividadId,
      estudianteId,
      fecha,
      nota: notaEditar,
    };

    try {
      showLoader("Editando calificacion...")
      const res = await fetchAuth(`/api/calificacion/editar/${calificacionSeleccionada.id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        alert("Error al editar calificación");
        return;
      }

      cerrarModalEditar();
      await recargarCalificaciones();
    } catch (err) {
      console.error("Error editando calificación", err);
    } finally {
      hideLoader();
    }
  };

  const abrirModalEliminar = (cal: Calificacion) => {
    setCalificacionSeleccionada(cal);
    setModalEliminarOpen(true);
  };

  const cerrarModalEliminar = () => {
    setModalEliminarOpen(false);
    setCalificacionSeleccionada(null);
  };

  const confirmarEliminar = async () => {
    if (!calificacionSeleccionada) return;

    try {
      showLoader("Eliminando calificación...")
      const res = await fetchAuth(`/api/calificacion/remover/${calificacionSeleccionada.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        alert("Error al eliminar calificación");
        return;
      }

      cerrarModalEliminar();
      await recargarCalificaciones();
    } catch (err) {
      console.error("Error eliminando calificación", err);
    } finally {
      hideLoader();
    }
  };

  const cerrarModalCrear = () => {
    setModalOpen(false);
    setActividadIdCrear(null);
    setEstudianteIdCrear(null);
    setNotaCrear(0);
  };

  return (
    <div className="container">
      <h2 className="titulo">Gestión de Calificaciones</h2>

      <div className="controls-bar" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <button
          className="btn btn-primary"
          onClick={() => setModalOpen(true)}
        >
          + Crear Calificación
        </button>

        <select
          className="select-actividad"
          value={filtroActividad}
          onChange={(e) => setFiltroActividad(e.target.value)}
          style={{ flexGrow: 1 }}
        >
          <option value="">Todas las Actividades</option>
          {actividades.map((actividad) => (
            <option key={actividad.id} value={actividad.id}>
              {actividad.titulo} ({actividad.tipo})
            </option>
          ))}
        </select>

        <input
          className="input-buscar"
          type="text"
          placeholder="Buscar por estudiante..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ flexGrow: 1 }}
        />
      </div>

      <table
        className="tabla-calificaciones"
        style={{ width: "100%", marginTop: "1rem", fontSize: "0.875rem" }}
      >
        <thead>
          <tr>
            <th style={{ padding: "6px 8px" }}>Actividad</th>
            <th style={{ padding: "6px 8px" }}>Estudiante</th>
            <th style={{ padding: "6px 8px" }}>Fecha</th>
            <th style={{ padding: "6px 8px" }}>Nota</th>
            <th style={{ padding: "6px 8px" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {calificacionesFiltradas.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center" style={{ padding: "10px" }}>
                No se encontraron calificaciones.
              </td>
            </tr>
          )}
          {calificacionesFiltradas.map((cal) => (
            <tr key={cal.id}>
              <td style={{ padding: "6px 8px" }}>{cal.actividad.tipo}</td>
              <td style={{ padding: "6px 8px" }}>{cal.estudiante}</td>
              <td style={{ padding: "6px 8px" }}>{cal.fecha}</td>
              <td style={{ padding: "6px 8px" }}>
                <span
                  className={`nota-badge ${
                    cal.nota >= 4
                      ? "bg-pink"
                      : cal.nota >= 3
                      ? "bg-gray-medium"
                      : "bg-gray-light"
                  }`}
                >
                  {cal.nota.toFixed(1)}
                </span>
              </td>
              <td
                style={{
                  padding: "6px 8px",
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <button
                  className="btn btn-secondary btn-editar-icono"
                  onClick={() => abrirModalEditar(cal)}
                >
                  <FiEdit size={16} />
                  <span style={{ marginLeft: 4 }}>Editar</span>
                </button>
                <button
                  className="btn btn-danger btn-eliminar-icono"
                  onClick={() => abrirModalEliminar(cal)}
                >
                  <FiTrash size={16} />
                  <span style={{ marginLeft: 4 }}>Eliminar</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {/* Modal Crear */}
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
            zIndex: 10000,
          }}
          onClick={cerrarModalCrear}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "#fff",
              padding: "1.5rem",
              borderRadius: "8px",
              width: "400px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Crear Calificación</h3>

            <label htmlFor="actividad-select" style={{ marginTop: "1rem", display: "block" }}>
              Actividad:
            </label>
            <select
              id="actividad-select"
              value={actividadIdCrear ?? ""}
              onChange={(e) => setActividadIdCrear(Number(e.target.value))}
              style={{ width: "100%", padding: "0.5rem" }}
            >
              <option value="">Seleccione actividad</option>
              {actividades.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.titulo} ({a.tipo})
                </option>
              ))}
            </select>

            <label htmlFor="estudiante-select" style={{ marginTop: "1rem", display: "block" }}>
              Estudiante:
            </label>
            <select
              id="estudiante-select"
              value={estudianteIdCrear ?? ""}
              onChange={(e) => setEstudianteIdCrear(Number(e.target.value))}
              style={{ width: "100%", padding: "0.5rem" }}
            >
              <option value="">Seleccione estudiante</option>
              {estudiantes.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre}
                </option>
              ))}
            </select>

            <label htmlFor="nota-crear" style={{ marginTop: "1rem", display: "block" }}>
              Nota (0 - 5):
            </label>
            <input
              id="nota-crear"
              type="number"
              min={0}
              max={5}
              step={0.1}
              value={notaCrear}
              onChange={(e) => setNotaCrear(Number(e.target.value))}
              style={{ width: "100%", padding: "0.5rem" }}
            />

            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button className="btn btn-secondary" onClick={cerrarModalCrear}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={crearCalificacion}>
                Crear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {modalEditarOpen && calificacionSeleccionada && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000,
          }}
          onClick={cerrarModalEditar}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "#fff",
              padding: "1.5rem",
              borderRadius: "8px",
              width: "400px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Editar Calificación</h3>

            <p>
              <strong>Actividad:</strong> {calificacionSeleccionada.actividad.titulo}
            </p>
            <p>
              <strong>Estudiante:</strong> {calificacionSeleccionada.estudiante}
            </p>

            <label htmlFor="nota-editar" style={{ marginTop: "1rem", display: "block" }}>
              Nota (0 - 5)
            </label>
            <input
              id="nota-editar"
              type="number"
              min={0}
              max={5}
              step={0.1}
              value={notaEditar}
              onChange={(e) => setNotaEditar(Number(e.target.value))}
              style={{ width: "100%", padding: "0.5rem" }}
            />

            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button className="btn btn-secondary" onClick={cerrarModalEditar}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={guardarEdicion}>
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {modalEliminarOpen && calificacionSeleccionada && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000,
          }}
          onClick={cerrarModalEliminar}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "#fff",
              padding: "1.5rem",
              borderRadius: "8px",
              width: "400px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Confirmar Eliminación</h3>

            <p>
              ¿Está seguro que desea eliminar la calificación de <strong>{calificacionSeleccionada.estudiante}</strong> en la actividad <strong>{calificacionSeleccionada.actividad.titulo}</strong>?
            </p>

            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button className="btn btn-secondary" onClick={cerrarModalEliminar}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={confirmarEliminar}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

