import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaLaptop,
  FaPaintBrush,
  FaBook,
  FaSyringe,
  FaTree,
} from "react-icons/fa";
import { GiChefToque } from "react-icons/gi";

// Interfaz de tipo para las categorías
interface Categoria {
  id: number;
  nombre: string;
  creado: string;
  actualizado: string;
}

// Datos de respaldo (fallback)
const datosQuemados: Categoria[] = [
  { id: 1, nombre: "Nuevas Tecnologías", creado: "2025-05-15T06:37:58.589164", actualizado: "2025-05-15T06:37:58.589088" },
  { id: 2, nombre: "Industrias Creativas", creado: "2025-05-15T06:39:00.446127", actualizado: "2025-05-15T06:39:00.446099" },
  { id: 3, nombre: "Gastronomía y Turismo", creado: "2025-05-15T06:39:11.917763", actualizado: "2025-05-15T06:39:11.917729" },
  { id: 4, nombre: "Desarrollo Empresarial", creado: "2025-05-15T06:39:26.464642", actualizado: "2025-05-15T06:39:26.46462" },
  { id: 5, nombre: "Salud y Cuidado", creado: "2025-05-15T06:39:42.618659", actualizado: "2025-05-15T06:39:42.61863" },
  { id: 6, nombre: "Agro", creado: "2025-05-15T06:39:52.289414", actualizado: "2025-05-15T06:39:52.289388" },
];

// Íconos por categoría
const Iconos: Record<string, React.ReactNode> = {
  "Nuevas Tecnologías": <FaLaptop size={20} color="white" />,
  "Industrias Creativas": <FaPaintBrush size={20} color="white" />,
  "Gastronomía y Turismo": <GiChefToque size={20} color="white" />,
  "Desarrollo Empresarial": <FaBook size={20} color="white" />,
  "Salud y Cuidado": <FaSyringe size={20} color="white" />,
  "Agro": <FaTree size={20} color="white" />,
};

export default function CategoriesPanel() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategorias = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Categoria[]>("/api/categoria/lista");
        if (Array.isArray(response.data)) {
          setCategorias(response.data);
        }
      } catch (error) {
        console.warn("Error al obtener categorías, se usan datos por defecto.");
        setCategorias(datosQuemados);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  const handleCrear = () => {
    alert("Funcionalidad para crear categoría aún no implementada.");
  };

  const handleEditar = (id: number) => {
    alert(`Editar categoría con ID ${id} aún no implementado.`);
  };

  const handleEliminar = (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta categoría?")) {
      setCategorias(prev => prev.filter(cat => cat.id !== id));
      // Aquí podrías agregar DELETE a la API si ya lo tienes
      // await axios.delete(`/api/categoria/remover/${id}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Categorías</h2>
        <button
          onClick={handleCrear}
          className="px-5 py-2 rounded-md text-white text-sm font-medium"
          style={{ backgroundColor: "#ff5176" }}
        >
          Crear Categoría
        </button>
      </div>

      {loading && (
        <p className="text-center text-sm text-gray-500 mb-4">
          Actualizando datos desde el servidor...
        </p>
      )}

      <table className="w-full text-left text-gray-700 text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-4"></th>
            <th className="py-3 px-4">Nombre</th>
            <th className="py-3 px-4">Creado</th>
            <th className="py-3 px-4">Actualizado</th>
            <th className="py-3 px-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((cat) => (
            <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4">
                <div
                  className="flex justify-center items-center rounded-full"
                  style={{ backgroundColor: "#ff5176", width: 36, height: 36 }}
                  title={cat.nombre}
                >
                  {Iconos[cat.nombre] || null}
                </div>
              </td>
              <td className="py-3 px-4 font-medium">{cat.nombre}</td>
              <td className="py-3 px-4">{new Date(cat.creado).toLocaleDateString()}</td>
              <td className="py-3 px-4">{new Date(cat.actualizado).toLocaleDateString()}</td>
              <td className="py-3 px-4 space-x-3">
                <button
                  onClick={() => handleEditar(cat.id)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(cat.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {categorias.length === 0 && !loading && (
            <tr>
              <td colSpan={5} className="text-center py-6 text-gray-500">
                No hay categorías disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

