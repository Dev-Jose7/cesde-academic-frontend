import React, { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Alert from "../../components/ui/alert/Alert";
import PageMeta from "../../components/common/PageMeta";

// Datos quemados para pruebas
const datosQuemados = [
  {
    id: 1,
    clase: {
      grupo: "P1-S2025-1-1",
      docente: "Luz Mary Contreras Meza",
      modulo: "Lógica de Programación",
    },
    estudiante: "Abel Antonio Rivera Hurtado",
    fecha: "2025-05-16",
    estado: "ASISTIO",
  },
  {
    id: 2,
    clase: {
      grupo: "P1-S2025-1-1",
      docente: "Luz Mary Contreras Meza",
      modulo: "Lógica de Programación",
    },
    estudiante: "Yaneth Becerra Sierra",
    fecha: "2025-05-21",
    estado: "INASISTENCIA",
  },
  {
    id: 3,
    clase: {
      grupo: "P1-S2025-1-1",
      docente: "Luz Mary Contreras Meza",
      modulo: "Lógica de Programación",
    },
    estudiante: "Armando Edwin Salazar",
    fecha: "2025-05-18",
    estado: "INASISTENCIA",
  },
  {
    id: 4,
    clase: {
      grupo: "P1-S2025-1-1",
      docente: "Luz Mary Contreras Meza",
      modulo: "Lógica de Programación",
    },
    estudiante: "Arturo Carlos Ortega Rincón",
    fecha: "2025-05-17",
    estado: "ASISTIO",
  },
  {
    id: 5,
    clase: {
      grupo: "P1-S2025-1-1",
      docente: "Luz Mary Contreras Meza",
      modulo: "Lógica de Programación",
    },
    estudiante: "Elkin Hoyos Vega",
    fecha: "2025-05-17",
    estado: "INASISTENCIA",
  },
];

export default function Asistencias() {
  const [usuario, setUsuario] = useState(null);
  const [asistencias, setAsistencias] = useState([]);

  // Leer usuario desde localStorage
  useEffect(() => {
    const usuarioString = localStorage.getItem("usuario");
    if (usuarioString) {
      const user = JSON.parse(usuarioString);
      setUsuario(user);

      // Filtrar datos según tipo
      let filtrado = [];
      if (user.tipo === "DOCENTE") {
        filtrado = datosQuemados.filter(
          (item) =>
            item?.clase?.docente?.toLowerCase() === user?.nombre?.toLowerCase()
        );
      } else {
        filtrado = datosQuemados.filter(
          (item) =>
            item?.estudiante?.toLowerCase() === user?.nombre?.toLowerCase()
        );
      }
      setAsistencias(filtrado);
    }
  }, []);

  // Agrupar asistencias por clase
  const asistenciasAgrupadas = () => {
    const grupos = {};
    asistencias.forEach((item) => {
      const clave = `${item?.clase?.modulo ?? "Sin módulo"} - ${
        item?.clase?.grupo ?? "Sin grupo"
      }`;
      if (!grupos[clave]) grupos[clave] = [];
      grupos[clave].push(item);
    });
    return grupos;
  };

  return (
    <>
      <PageMeta title="Asistencias" description="Control de asistencias" />
      <PageBreadcrumb pageTitle="Asistencias" />

      <div className="space-y-6">
        {!usuario && (
          <ComponentCard title="Sin sesión">
            <Alert
              variant="warning"
              title="Sin usuario"
              message="Por favor inicia sesión para ver las asistencias."
            />
          </ComponentCard>
        )}

        {usuario?.tipo === "DOCENTE" && (
          <ComponentCard title="Asistencias por clase (Docente)">
            {Object.entries(asistenciasAgrupadas()).map(
              ([nombreClase, items]) => (
                <div
                  key={nombreClase}
                  className="border p-4 rounded-lg bg-green-50 mb-4"
                >
                  <h4 className="font-semibold mb-2">{nombreClase}</h4>
                  <ul className="space-y-2">
                    {items.map((asi) => (
                      <li
                        key={asi.id}
                        className="flex justify-between items-center border-b py-1"
                      >
                        <span>
                          {asi?.estudiante ?? "Estudiante"} - Fecha:{" "}
                          {asi?.fecha ?? "N/D"} - Estado:{" "}
                          {asi?.estado ?? "N/D"}
                        </span>
                        <span>
                          {asi?.estado === "INASISTENCIA" ? (
                            <button className="text-green-600 underline">
                              Agregar Asistencia
                            </button>
                          ) : (
                            <button className="text-red-600 underline">
                              Eliminar Asistencia
                            </button>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </ComponentCard>
        )}

        {usuario?.tipo === "ESTUDIANTE" && (
          <ComponentCard title="Tu historial de asistencia">
            {asistencias.length === 0 && (
              <p>No se encontraron registros de asistencia.</p>
            )}
            {asistencias.map((asi) => (
              <Alert
                key={asi.id}
                variant="info"
                title={`Clase: ${asi?.clase?.modulo ?? "N/D"} - Grupo: ${
                  asi?.clase?.grupo ?? "N/D"
                }`}
                message={`Fecha: ${asi?.fecha ?? "N/D"} - Estado: ${
                  asi?.estado ?? "N/D"
                }`}
              />
            ))}
          </ComponentCard>
        )}
      </div>
    </>
  );
}






