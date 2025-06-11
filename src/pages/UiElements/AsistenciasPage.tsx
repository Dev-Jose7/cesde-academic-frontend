import React, { useEffect, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Alert from "../../components/ui/alert/Alert";
import { fetchAuth } from "../../utils/fetchAuth";
import { Usuario } from "../../context/UserContext";
import { FiCheck, FiEdit, FiCheckCircle } from "react-icons/fi";
import CrearAsistencia from "./CrearAsistencia";
import { hideLoader, showLoader } from "../../components/common/Loader";


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

  useEffect(() => {
    const fetchAsistencias = async () => {
      const usuarioStorage = localStorage.getItem("usuario");
      if (!usuarioStorage) return 

      const user: Usuario = JSON.parse(usuarioStorage);
      setUsuario(user);

      try {
        let asistenciasData: Asistencia[] = [];

        if (user.tipo === "ESTUDIANTE") {

          const res = await fetchAuth(`/api/asistencia/estudiante/${user.id}`);
          if (!res.ok) throw new Error(`Error al obtener asistencias. Código: ${res.status}`);

          asistenciasData = await res.json();
        }

        setAsistencias(asistenciasData);
      } catch (error: any) {
        console.error("Error al obtener asistencias:", error.message);
      } finally {
        hideLoader();
      }
    };

    fetchAsistencias();
  }, []);

  const agregarAsistencia = async (asistencia: Asistencia) => {
    try {
      const actualizada = { ...asistencia, estado: "ASISTIO" };

      showLoader("Creando actividades...")
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
    } finally {
      hideLoader();
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
      {console.log(renderIconoDerecha)}

      {usuario?.tipo === "DOCENTE" && (
    <>
      <CrearAsistencia/>
    </>
    )}

      {usuario?.tipo === "ESTUDIANTE" && (
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





