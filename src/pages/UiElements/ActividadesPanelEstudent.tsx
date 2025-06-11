// src/pages/estudiante/ActividadesPanelEstudent.tsx
import { useEffect, useState } from "react";
import { fetchAuth } from "../../utils/fetchAuth";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { FiUploadCloud } from "react-icons/fi";
import { FaTasks } from "react-icons/fa";

interface Clase {
  id: number;
  grupo: string;
  docente: string;
  modulo: string;
}

interface Actividad {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  clase: Clase;
  fechaEntrega?: string;
}

interface GrupoEstudiante {
  grupoId: number;
  estudianteId: string;
}

const ActividadesPanelEstudent = () => {
  const [usuario, setUsuario] = useState<any>(null);
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (usuario?.tipo === "ESTUDIANTE") {
      obtenerActividades();
    }
  }, [usuario]);

  const obtenerActividades = async () => {
    setIsLoading(true);
    try {
      // 1. Obtener grupos del estudiante
      const grupoEstudianteResp = await fetchAuth(
        `/api/grupo-estudiante/estudiante/${usuario.id}`
      );
      const grupoEstudianteData: GrupoEstudiante[] = await grupoEstudianteResp.json();

      const actividadesCargadas: Actividad[] = [];

      // 2. Para cada grupo obtener las clases
      for (const grupo of grupoEstudianteData) {
        const claseResp = await fetchAuth(`/api/clase/grupo/${grupo.grupoId}`);
        const claseData: Clase[] = await claseResp.json();

        // 3. Para cada clase obtener las actividades
        for (const clase of claseData) {
          const actividadResp = await fetchAuth(`/api/actividad/clase/${clase.id}`);
          if (!actividadResp.ok) {
            console.error(`Error al cargar actividades para clase ${clase.id}`);
            continue;
          }
          const actividadData: Actividad[] = await actividadResp.json();

          actividadesCargadas.push(...actividadData);
        }
      }

      setActividades(actividadesCargadas);
    } catch (error) {
      console.error("Error al obtener actividades:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center p-10">
        <p>Cargando actividades...</p>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Actividades"
        description="Actividades asignadas para estudiantes"
      />
      <PageBreadcrumb pageTitle="Actividades" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actividades.length === 0 ? (
          <p className="text-center col-span-full">No hay actividades asignadas.</p>
        ) : (
          actividades.map((actividad) => (
            <div
              key={actividad.id}
              className="bg-white border border-gray-100 rounded-xl shadow-md p-5 hover:shadow-lg transition"
            >
              <div className="mb-4 flex items-center gap-2 text-gray-700">
                <FaTasks className="text-pink-500 text-lg" />
                <h3 className="text-base font-bold">{actividad.titulo}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">{actividad.descripcion}</p>
              <p className="text-xs text-gray-500 mb-1">Tipo: {actividad.tipo}</p>
              <p className="text-xs text-gray-500 mb-1">
                Clase: {actividad.clase?.grupo} - {actividad.clase?.modulo} -{" "}
                {actividad.clase?.docente}
              </p>
              <p className="text-xs text-gray-500">
                Fecha Entrega: {actividad.fechaEntrega || "No definida"}
              </p>
              <div className="mt-4 flex justify-end">
                <button
                  className="flex items-center gap-2 px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 transition"
                  onClick={() => alert("Funcionalidad de subida aún no implementada")}
                >
                  <FiUploadCloud /> Subir Actividad
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default ActividadesPanelEstudent;