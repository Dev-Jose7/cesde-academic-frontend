import React, { useEffect, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Alert from "../../components/ui/alert/Alert";
import { fetchAuth } from "../../utils/fetchAuth";
import { Usuario } from "../../context/UserContext";
// import PageMeta from "../../components/common/PageMeta";
// import PageBreadcrumb from "../../components/common/PageBreadCrumb";

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
  estado: "ASISTIO" | "INASISTENCIA" | "JUSTIFICADO" | string;
}

const AsistenciasPage: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAsistencias = async () => {
      const usuarioStorage = localStorage.getItem("usuario");

      if (!usuarioStorage) return setLoading(false);

      const user: Usuario = JSON.parse(usuarioStorage);
      setUsuario(user);

      try {
        let asistenciasData: Asistencia[] = [];

        switch (user.tipo) {
          case "DOCENTE":
            const asistenciaListaResponse = await fetchAuth("/api/asistencia/lista");
            const asistenciaListaData: Asistencia[] = await asistenciaListaResponse.json();
            
            asistenciasData = asistenciaListaData.filter(
              (a) => a?.clase?.docente?.toLowerCase() === user.nombre.toLowerCase()
            );
            break;

          case "ESTUDIANTE":
            const responseEstudiante = await fetchAuth(`/api/asistencia/estudiante/${user.id}`);
            asistenciasData = await responseEstudiante.json();
            break;

          default:
            asistenciasData = [];
            break;
        }

        setAsistencias(asistenciasData);
      } catch (error) {
        console.error("Error al obtener asistencias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAsistencias();
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
      await fetchAuth(`/api/asistencia/remover/${id}`, {
        method: "DELETE",
      });
      setAsistencias((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Error al eliminar asistencia:", err);
    }
  };

  const agregarAsistencia = async (asistencia: Asistencia) => {
    try {
      const actualizada = { ...asistencia, estado: "ASISTIO" };
      await fetchAuth(`/api/asistencia/editar/${asistencia.id}`, {
        method: "PUT",
        body: JSON.stringify(actualizada),
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
      {/* <PageMeta title="Asistencias" />
      <PageBreadcrumb title="Asistencias" /> */}

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
                          ✔
                        </button>
                      ) : (
                        <button
                          onClick={() => eliminarAsistencia(asi.id)}
                          type="button"
                          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#ff7c5e] hover:bg-[#ff5176] transition-colors shadow-md"
                          title="Eliminar asistencia"
                          aria-label="Eliminar asistencia"
                        >
                          ✖
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
};

export default AsistenciasPage;
