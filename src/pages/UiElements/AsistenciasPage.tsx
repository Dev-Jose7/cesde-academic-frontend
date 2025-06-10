import React, { useEffect, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Alert from "../../components/ui/alert/Alert";
import { fetchAuth } from "../../utils/fetchAuth";
import { Usuario } from "../../context/UserContext";
import { FiCheck, FiEdit, FiCheckCircle } from "react-icons/fi";
import CrearAsistencia from "./CrearAsistencia";


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

        if (user.tipo === "DOCENTE") {
          const res = await fetchAuth("/api/asistencia/lista");
          if (!res.ok) throw new Error(`Error al obtener asistencias. Código: ${res.status}`);

          const allAsistencias: Asistencia[] = await res.json();
          asistenciasData = allAsistencias.filter(
            (a) => a?.clase?.docente?.toLowerCase() === user.nombre.toLowerCase()
          );
        } else if (user.tipo === "ESTUDIANTE") {
          const res = await fetchAuth(`/api/asistencia/estudiante/${user.id}`);
          if (!res.ok) throw new Error(`Error al obtener asistencias. Código: ${res.status}`);

          asistenciasData = await res.json();
        }

        setAsistencias(asistenciasData);
      } catch (error: any) {
        console.error("Error al obtener asistencias:", error.message);
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

  const agregarAsistencia = async (asistencia: Asistencia) => {
    try {
      const actualizada = { ...asistencia, estado: "ASISTIO" };

      const res = await fetchAuth(`/api/asistencia/editar/${asistencia.id}`, {
        method: "PUT",
        body: JSON.stringify(actualizada),
      });

      if (!res.ok) throw new Error("Error al actualizar asistencia");

      setAsistencias((prev) =>
        prev.map((a) => (a.id === asistencia.id ? actualizada : a))
      );
    } catch (err) {
      console.error("Error al actualizar asistencia:", err);
    }
  };

  const renderIconoDerecha = (asi: Asistencia) => {
    if (asi.estado === "ASISTIO") {
      return (
        <div
          className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-700"
          title="Asistió"
        >
          <FiCheck size={18} />
        </div>
      );
    }

    if (asi.estado === "JUSTIFICADO") {
      return (
        <div
          className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-700"
          title="Justificado"
        >
          <FiCheckCircle size={18} />
        </div>
      );
    }

    if (asi.estado === "INASISTENCIA") {
      return (
        <button
          onClick={() => agregarAsistencia(asi)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
          title="Marcar como asistió"
        >
          <FiEdit size={18} />
        </button>
      );
    }

    return null;
  };

  return (
    <>
      {loading && (
        <p className="text-center text-gray-500 mt-10 text-lg font-medium">
          ⏳ Buscando asistencias...
        </p>
      )}

      {!loading && usuario?.tipo === "DOCENTE" && (
  <>
    <CrearAsistencia
    />
    {/* <ComponentCard title="Asistencias por clase">
      {Object.entries(asistenciasAgrupadas()).map(([nombreClase, items]) => (
        <div
          key={nombreClase}
          className="border border-gray-200 p-6 rounded-2xl bg-white mb-6 shadow-md"
        >
          <h4 className="font-semibold text-xl mb-4 text-gray-800 border-b pb-2">
            {nombreClase}
          </h4>
          <ul className="space-y-4">
            {items.map((asi) => {
              const estadoClase =
                asi.estado === "ASISTIO"
                  ? "bg-green-100 text-green-700"
                  : asi.estado === "JUSTIFICADO"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700";

              return (
                <li
                  key={asi.id}
                  className="flex justify-between items-center bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow transition"
                >
                  <div>
                    <p className="text-gray-800 font-semibold">{asi.estudiante}</p>
                    <p className="text-sm text-gray-500">
                      Fecha: {asi.fecha}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 mt-1 text-sm font-semibold px-2 py-1 rounded-full ${estadoClase}`}
                    >
                      {asi.estado}
                    </span>
                  </div>
                    {renderIconoDerecha(asi)}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </ComponentCard> */}
    </>
    )}

      {!loading && usuario?.tipo === "ESTUDIANTE" && (
        <ComponentCard title="🧾 Tu historial de asistencia">
          {asistencias.length === 0 ? (
            <p className="text-center text-gray-500 py-6 font-medium">
              No se encontraron registros de asistencia.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {asistencias.map((asi) => (
                <Alert
                  key={asi.id}
                  variant={
                    asi.estado === "ASISTIO"
                      ? "success"
                      : asi.estado === "JUSTIFICADO"
                      ? "warning"
                      : "error"
                  }
                  title={`📘 ${asi.clase?.modulo} - Grupo ${asi.clase?.grupo}`}
                  message={`📅 ${asi.fecha} — Estado: ${asi.estado}`}
                />
              ))}
            </div>
          )}
        </ComponentCard>
      )}
    </>
  );
};

export default AsistenciasPage;





