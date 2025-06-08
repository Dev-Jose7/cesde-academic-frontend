import React, { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Alert from "../../components/ui/alert/Alert";
import PageMeta from "../../components/common/PageMeta";
import axios from "axios";

interface Usuario {
  id: number;
  tipo: "DOCENTE" | "ESTUDIANTE" | string;
  nombre: string;
}

interface Clase {
  docente: string;
  modulo: string;
  grupo: string;
}

interface Asistencia {
  id: number;
  clase: Clase;
  estudiante: string;
  fecha: string;
  estado: "ASISTIO" | "INASISTENCIA" | string;
}

export default function Alerts() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuarioString = localStorage.getItem("usuario");
    if (usuarioString) {
      const user: Usuario = JSON.parse(usuarioString);
      setUsuario(user);

      if (user.tipo === "DOCENTE") {
        axios
          .get("/api/asistencia/lista", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
            },
          })
          .then((res) => {
            const asistenciasDocente = res.data.filter(
              (a: Asistencia) =>
                a?.clase?.docente?.toLowerCase() === user.nombre.toLowerCase()
            );
            setAsistencias(asistenciasDocente);
          })
          .catch((err) => console.error("Error al obtener asistencias:", err))
          .finally(() => setLoading(false));
      } else if (user.tipo === "ESTUDIANTE") {
        axios
          .get(`/api/asistencia/estudiante/${user.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
            },
          })
          .then((res) => {
            setAsistencias(res.data);
          })
          .catch((err) => console.error("Error al obtener asistencias:", err))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const asistenciasAgrupadas = () => {
    return asistencias.reduce((acc: Record<string, Asistencia[]>, asi) => {
      const nombreClase = asi.clase?.modulo || "Sin clase";
      if (!acc[nombreClase]) acc[nombreClase] = [];
      acc[nombreClase].push(asi);
      return acc;
    }, {});
  };

  const eliminarAsistencia = async (id: number) => {
    try {
      await axios.delete(`/api/asistencia/remover/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        },
      });
      setAsistencias((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Error al eliminar asistencia:", err);
    }
  };

  const agregarAsistencia = async (asistencia: Asistencia) => {
    try {
      const actualizada = { ...asistencia, estado: "ASISTIO" };
      await axios.put(`/api/asistencia/editar/${asistencia.id}`, actualizada, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        },
      });
      setAsistencias((prev) =>
        prev.map((a) => (a.id === asistencia.id ? actualizada : a))
      );
    } catch (err) {
      console.error("Error al actualizar asistencia:", err);
    }
  };

  return (
    <>
      <PageMeta title="Asistencias" />
      <PageBreadcrumb title="Asistencias" />

      {loading && (
        <p className="text-center text-gray-600 mt-8 font-medium">Buscando asistencias...</p>
      )}

      {!loading && usuario?.tipo === "DOCENTE" && (
        <ComponentCard title="Asistencias por clase (Docente)">
          {Object.entries(asistenciasAgrupadas()).map(([nombreClase, items]) => (
            <div
              key={nombreClase}
              className="border border-gray-300 p-5 rounded-lg bg-white mb-6 shadow-md"
            >
              <h4 className="font-semibold mb-4 text-lg text-gray-800">{nombreClase}</h4>
              <ul className="space-y-3">
                {items.map((asi) => (
                  <li
                    key={asi.id}
                    className="flex justify-between items-center border-b border-gray-200 pb-3"
                  >
                    <span className="text-gray-700 font-medium">
                      {asi.estudiante} — Fecha: {asi.fecha} — Estado:{" "}
                      <span
                        className={
                          asi.estado === "ASISTIO"
                            ? "text-green-600 font-semibold"
                            : "text-red-600 font-semibold"
                        }
                      >
                        {asi.estado}
                      </span>
                    </span>

                    <span className="space-x-4 flex">
                      {asi.estado === "INASISTENCIA" ? (
                        <button
                          onClick={() => agregarAsistencia(asi)}
                          type="button"
                          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#ed2e91] hover:bg-[#ff5176] transition-colors shadow-md"
                          title="Marcar como asistió"
                          aria-label="Editar asistencia"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            stroke="white"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 24 24"
                            className="w-5 h-5"
                          >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => eliminarAsistencia(asi.id)}
                          type="button"
                          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#ff7c5e] hover:bg-[#ff5176] transition-colors shadow-md"
                          title="Eliminar asistencia"
                          aria-label="Eliminar asistencia"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            stroke="white"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 24 24"
                            className="w-5 h-5"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                          </svg>
                        </button>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </ComponentCard>
      )}

      {!loading && usuario?.tipo === "ESTUDIANTE" && (
        <ComponentCard title="Tu historial de asistencia">
          {asistencias.length === 0 ? (
            <p className="text-gray-600 text-center py-6 font-medium">
              No se encontraron registros de asistencia.
            </p>
          ) : (
            asistencias.map((asi) => (
              <Alert
                key={asi.id}
                variant="info"
                title={`Clase: ${asi.clase?.modulo} - Grupo: ${asi.clase?.grupo}`}
                message={`Fecha: ${asi.fecha} - Estado: ${asi.estado}`}
              />
            ))
          )}
        </ComponentCard>
      )}
    </>
  );
}

