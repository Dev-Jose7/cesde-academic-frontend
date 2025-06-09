import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAuth } from "../../../utils/fetchAuth";
import "./CalificacionesTeacher.css";
import { FiEdit } from "react-icons/fi";

interface Calificacion {
  id: number;
  actividad: string;
  estudiante: string;
  fecha: string;
  nota: number;
}

interface Actividad {
  id: number;
  nombre: string;
}

const ACTIVIDADES_VALIDAS = ["TAREA", "EVALUACION", "PROYECTO", "TALLER"];

export default function BasicTableOneTeacher() {
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [filtroActividad, setFiltroActividad] = useState<string>("");
  const [busqueda, setBusqueda] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    cargarCalificaciones();
    cargarActividades();
  }, []);

  const cargarCalificaciones = async () => {
    try {
      const response = await fetchAuth("/api/calificacion/lista");
      const data = await response.json();
      // Filtrar solo calificaciones válidas por actividad
      const filtradas = data.filter((c: Calificacion) =>
        ACTIVIDADES_VALIDAS.includes(c.actividad.toUpperCase())
      );
      setCalificaciones(filtradas);
    } catch (error) {
      console.error("Error cargando calificaciones:", error);
    }
  };

  const cargarActividades = async () => {
    try {
      const response = await fetchAuth("/api/actividad/lista");
      const data = await response.json();
      const filtradas = data.filter((a: Actividad) =>
        ACTIVIDADES_VALIDAS.includes(a.nombre.toUpperCase())
      );
      setActividades(filtradas);
    } catch (error) {
      console.error("Error cargando actividades:", error);
    }
  };

  const calificacionesFiltradas = calificaciones.filter((cal) => {
    const coincideActividad =
      !filtroActividad || cal.actividad === filtroActividad;
    const coincideBusqueda = cal.estudiante
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    return coincideActividad && coincideBusqueda;
  });

  return (
    <div className="container">
      <h2 className="titulo">Gestión de Calificaciones</h2>

      <div className="controls-bar">
        <button className="btn btn-primary" onClick={() => navigate("/calificacion/crear")}>
          + Crear Calificación
        </button>

        <select
          className="select-actividad"
          value={filtroActividad}
          onChange={(e) => setFiltroActividad(e.target.value)}
        >
          <option value="">Todas las Actividades</option>
          {["TAREA", "EVALUACION", "PROYECTO", "TALLER"].map((nombre) => (
            <option key={nombre} value={nombre}>
              {nombre}
            </option>
          ))}
        </select>

        <input
          className="input-buscar"
          type="text"
          placeholder="Buscar estudiante..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <table className="tabla-calificaciones">
        <thead>
          <tr>
            <th>Actividad</th>
            <th>Estudiante</th>
            <th>Fecha</th>
            <th>Nota</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {calificacionesFiltradas.map((cal) => (
            <tr key={cal.id}>
              <td>{cal.actividad}</td>
              <td>{cal.estudiante}</td>
              <td>{cal.fecha}</td>
              <td>
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
              <td>
              <button
                className="btn btn-secondary btn-editar-icono"
                onClick={() => navigate(`/calificacion/editar/${cal.id}`)}
              >
                <FiEdit size={16} />
                <span>Editar</span>
              </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
