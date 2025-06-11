import { useEffect, useState } from "react";
import { fetchAuth } from "../../utils/fetchAuth";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Usuario } from "../../context/UserContext";
import { hideLoader, showLoader } from "../../components/common/Loader";

interface Clase {
  id: number;
  docente?: string;
  modulo?: string;
  grupo?: string;
}

interface Actividad {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  fechaEntrega: string;
  clase?: Clase;
}

export default function FormElements() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [error, setError] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal) {
      try {
        const user = JSON.parse(usuarioLocal);
        setUsuario(user);
      } catch (err) {
        console.error("Error al parsear usuario desde localStorage:", err);
      }
    }
  }, []);

  useEffect(() => {
    const cargarActividades = async () => {
      if (!usuario) return;

      try {
        showLoader("Cargando actividades...")
        let actividadesTotales: Actividad[] = [];

        if (usuario.tipo === "ESTUDIANTE") {
          const gruposResponse = await fetchAuth(`/api/grupo-estudiante/estudiante/${usuario.id}`, {
            method: "GET",
          });

          if (!gruposResponse.ok) throw new Error("No se pudieron obtener los grupos.");

          const grupos = await gruposResponse.json();

          for (const grupo of grupos) {
            const clasesResponse = await fetchAuth(`/api/clase/grupo/${grupo.id}`, {
              method: "GET",
            });

            if (!clasesResponse.ok) continue;

            const clases = await clasesResponse.json();

            for (const clase of clases) {
              const actividadesResponse = await fetchAuth(`/api/actividad/clase/${clase.id}`, {
                method: "GET",
              });

              if (!actividadesResponse.ok) continue;

              const actividadesClase = await actividadesResponse.json();
              actividadesTotales.push(...actividadesClase);
            }
          }
        }

        if (usuario.tipo === "DOCENTE") {
          const clasesResponse = await fetchAuth(`/api/clase/docente/${usuario.id}`, {
            method: "GET",
          });

          if (!clasesResponse.ok) throw new Error("No se pudieron obtener las clases del docente.");

          const clases = await clasesResponse.json();

          for (const clase of clases) {
            const actividadesResponse = await fetchAuth(`/api/actividad/clase/${clase.id}`, {
              method: "GET",
            });

            if (!actividadesResponse.ok) continue;

            const actividadesClase = await actividadesResponse.json();
            actividadesTotales.push(...actividadesClase);
          }
        }

        setActividades(actividadesTotales);
      } catch (err) {
        console.error("Error al cargar actividades:", err);
        setError(true);
      } finally {
        hideLoader();
      }
    };

    cargarActividades();
  }, [usuario]);

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        Error al cargar las actividades.
      </div>
    );
  }

  return (
    <div>
      <PageMeta
        title="Actividades Académicas | CesdeAcademic"
        description="Lista de actividades académicas para los estudiantes y docentes"
      />
      <PageBreadcrumb pageTitle="Actividades Académicas" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
        {actividades.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No hay actividades disponibles para {usuario?.nombre || "el usuario actual"}.
          </div>
        ) : (
          actividades.map((actividad) => (
            <div
              key={actividad.id}
              className="border rounded-2xl shadow-md p-4 bg-white space-y-2"
            >
              <h3 className="text-xl font-semibold text-gray-800">{actividad.titulo}</h3>
              <p className="text-sm text-gray-600 whitespace-pre-line">{actividad.descripcion}</p>
              <p className="text-sm">
                <strong>Tipo:</strong> {actividad.tipo}
              </p>
              <p className="text-sm">
                <strong>Entrega:</strong> {actividad.fechaEntrega}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Docente:</strong> {actividad.clase?.docente || "-"}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Módulo:</strong> {actividad.clase?.modulo || "-"}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Grupo:</strong> {actividad.clase?.grupo || "-"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
