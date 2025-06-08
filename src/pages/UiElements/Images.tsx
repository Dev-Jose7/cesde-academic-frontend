import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { BookOpen, Trash2, PlusCircle, X, Edit2 } from "lucide-react"; // Añadí Edit2
import { fetchAuth } from "../../utils/fetchAuth";

type TipoModulo = "MATERIA" | "CURSO" | "CATEDRA" | "SEMINARIO";

interface Modulo {
  id: number;
  nombre: string;
  tipo: TipoModulo;
  creado?: string;
  actualizado?: string;
}

const initialForm: Omit<Modulo, "id"> = {
  nombre: "",
  tipo: "MATERIA",
};

export default function Modulos() {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoModulo, setNuevoModulo] = useState(initialForm);
  const [editandoModuloId, setEditandoModuloId] = useState<number | null>(null); // para saber si estamos editando

  useEffect(() => {
    obtenerModulos();
  }, []);

  const obtenerModulos = async () => {
    setCargando(true);
    try {
      const res = await fetchAuth("/api/modulo/lista");
      const data = await res.json();
      if (Array.isArray(data)) setModulos(data);
    } catch (err) {
      console.error("Error al obtener módulos:", err);
    } finally {
      setCargando(false);
    }
  };

  const eliminarModulo = async (id: number) => {
    try {
      await fetchAuth(`/api/modulo/remover/${id}`, {
        method: "DELETE",
      });
      setModulos((prev) => prev.filter((mod) => mod.id !== id));
    } catch (err) {
      console.error("Error al eliminar módulo:", err);
    }
  };

  const crearModulo = async () => {
    try {
      const res = await fetchAuth("/api/modulo/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoModulo),
      });

      if (!res.ok) throw new Error("Error al crear módulo");

      const creado = await res.json();
      setModulos((prev) => [creado, ...prev]);
      setNuevoModulo(initialForm);
      setMostrarModal(false);
    } catch (err) {
      console.error("Error al crear módulo:", err);
    }
  };

  const editarModulo = async () => {
    if (editandoModuloId === null) return;

    try {
      const res = await fetchAuth(`/api/modulo/editar/${editandoModuloId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoModulo),
      });

      if (!res.ok) throw new Error("Error al editar módulo");

      const actualizado = await res.json();

      setModulos((prev) =>
        prev.map((mod) => (mod.id === editandoModuloId ? actualizado : mod))
      );

      setNuevoModulo(initialForm);
      setEditandoModuloId(null);
      setMostrarModal(false);
    } catch (err) {
      console.error("Error al editar módulo:", err);
    }
  };

  const abrirModalEditar = (modulo: Modulo) => {
    setNuevoModulo({ nombre: modulo.nombre, tipo: modulo.tipo });
    setEditandoModuloId(modulo.id);
    setMostrarModal(true);
  };

  return (
    <>
      <PageMeta title="Módulos | CesdeAcademic" description="Listado de módulos del programa académico" />
      <PageBreadcrumb pageTitle="Módulos" />

      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Lista de módulos">
          <div className="mb-6">
            <button
              onClick={() => {
                setMostrarModal(true);
                setEditandoModuloId(null);
                setNuevoModulo(initialForm);
              }}
              className="flex items-center gap-2 text-white px-4 py-2 rounded-xl shadow-sm"
              style={{ backgroundColor: "#ed2e91" }}
            >
              <PlusCircle className="w-5 h-5" />
              Crear módulo
            </button>
          </div>

          {cargando ? (
            <p className="text-center text-gray-500">Cargando módulos...</p>
          ) : modulos.length === 0 ? (
            <p className="text-center text-gray-500">No se encontraron módulos.</p>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {modulos.map((modulo) => (
                  <div
                  key={modulo.id}
                  className="relative bg-white rounded-2xl shadow-md p-6 border hover:shadow-lg transition-all duration-300"
                >
                  {/* Contenedor para botones eliminar y editar */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => abrirModalEditar(modulo)}
                    className="text-white rounded-full p-1"
                    style={{ backgroundColor: "#3b82f6" }}
                    title="Editar módulo"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
              
                  <button
                    onClick={() => eliminarModulo(modulo.id)}
                    className="text-white rounded-full p-1"
                    style={{ backgroundColor: "#ff5176" }}
                    title="Eliminar módulo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              
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

      {/* Modal de creación / edición */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
            <button
              onClick={() => {
                setMostrarModal(false);
                setEditandoModuloId(null);
                setNuevoModulo(initialForm);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-4 text-[#ed2e91]">
              {editandoModuloId ? "Editar módulo" : "Crear nuevo módulo"}
            </h2>

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
              onChange={(e) =>
                setNuevoModulo({ ...nuevoModulo, tipo: e.target.value as TipoModulo })
              }
              className="w-full border rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-[#ed2e91]"
            >
              <option value="MATERIA">MATERIA</option>
              <option value="CURSO">CURSO</option>
              <option value="CATEDRA">CÁTEDRA</option>
              <option value="SEMINARIO">SEMINARIO</option>
            </select>

            <button
              onClick={editandoModuloId ? editarModulo : crearModulo}
              className="w-full text-white px-4 py-2 rounded-xl"
              style={{ backgroundColor: "#ff5176" }}
            >
              {editandoModuloId ? "Guardar cambios" : "Crear módulo"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
