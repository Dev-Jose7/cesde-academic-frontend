import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import { BookOpen, Trash2, PlusCircle, X } from "lucide-react";

export default function Images() {
  const [modulos, setModulos] = useState<{
    id: number;
    nombre: string;
    tipo: string;
    creado?: string;
    actualizado?: string;
  }[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoModulo, setNuevoModulo] = useState({ nombre: "", tipo: "MATERIA" });

  useEffect(() => {
    const obtenerModulos = async () => {
      try {
        const res = await fetch("https://cesde-academic-app-development.up.railway.app/modulo/lista");
        if (!res.ok) throw new Error("Error al cargar");
        const data = await res.json();
        setModulos(data);
      } catch (error) {
        console.error("Error al cargar módulos, usando datos locales", error);
        setModulos([
          {
            id: 1,
            nombre: "Lógica de Programación",
            tipo: "MATERIA",
            creado: "2025-05-16T07:06:02.953631",
            actualizado: "2025-05-16T07:06:02.953562",
          },
          {
            id: 2,
            nombre: "Introducción a la Programación",
            tipo: "MATERIA",
            creado: "2025-05-16T07:10:43.708874",
            actualizado: "2025-05-16T07:10:43.708843",
          },
        ]);
      } finally {
        setCargando(false);
      }
    };

    obtenerModulos();
  }, []);

  const eliminarModulo = (id: number) => {
    setModulos((prev) => prev.filter((mod) => mod.id !== id));
  };

  const handleCrearModulo = () => {
    const nuevo = {
      id: Math.floor(Math.random() * 10000),
      nombre: nuevoModulo.nombre,
      tipo: nuevoModulo.tipo,
      creado: new Date().toISOString(),
      actualizado: new Date().toISOString(),
    };
    setModulos((prev) => [nuevo, ...prev]);
    setNuevoModulo({ nombre: "", tipo: "MATERIA" });
    setMostrarModal(false);
  };

  return (
    <>
      <PageMeta title="Módulos | CesdeAcademic" description="Listado de módulos del programa académico" />
      <PageBreadcrumb pageTitle="Módulos" />

      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Lista de módulos">
          <div className="mb-6">
            <button
              onClick={() => setMostrarModal(true)}
              className="flex items-center gap-2 text-white px-4 py-2 rounded-xl shadow-sm"
              style={{ backgroundColor: "#ed2e91" }}
            >
              <PlusCircle className="w-5 h-5" />
              Crear módulo
            </button>
          </div>

          {cargando ? (
            <p className="text-center text-gray-500">Cargando módulos...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {modulos.map((modulo) => (
                <div
                  key={modulo.id}
                  className="relative bg-white rounded-2xl shadow-md p-6 border hover:shadow-lg transition-all duration-300"
                >
                  <button
                    onClick={() => eliminarModulo(modulo.id)}
                    className="absolute top-3 left-3 text-white rounded-full p-1"
                    style={{ backgroundColor: "#ff5176" }}
                    title="Eliminar módulo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-start gap-4">
                    <div
                      className="p-3 rounded-full"
                      style={{ backgroundColor: "#ff7c5e", color: "white" }}
                    >
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{modulo.nombre}</h3>
                      <p className="text-sm text-gray-500">{modulo.tipo}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ComponentCard>
      </div>

      {/* Modal de creación */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
            <button
              onClick={() => setMostrarModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-4 text-[#ed2e91]">Crear nuevo módulo</h2>

            <label className="block text-sm font-medium mb-1">Nombre del módulo</label>
            <input
              type="text"
              value={nuevoModulo.nombre}
              onChange={(e) => setNuevoModulo({ ...nuevoModulo, nombre: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#ed2e91]"
            />

            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select
              value={nuevoModulo.tipo}
              onChange={(e) => setNuevoModulo({ ...nuevoModulo, tipo: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-[#ed2e91]"
            >
              <option value="MATERIA">MATERIA</option>
              <option value="CURSO">CURSO</option>
            </select>

            <button
              onClick={handleCrearModulo}
              className="w-full text-white px-4 py-2 rounded-xl"
              style={{ backgroundColor: "#ff5176" }}
            >
              Crear módulo
            </button>
          </div>
        </div>
      )}
    </>
  );
}
