import { useEffect, useState } from "react";
import { fetchAuth } from "../../utils/fetchAuth";
import { FaUsers } from "react-icons/fa";
import { hideLoader, showLoader } from "../../components/common/Loader";
import CrearGrupo from "./CrearGrupo";

type Grupo = {
  id: number;
  codigo: string;
  programa: string;
  semestre: string;
  estado: string;
};

export default function GruposList() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [programaFiltro, setProgramaFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");

  // 👇 Esta función se puede usar en el useEffect y como callback
  const loadGrupos = () => {
    showLoader("Cargando grupos...");
    fetchAuth("/api/grupo/lista")
      .then(res => res.json())
      .then(data => setGrupos(data))
      .catch(error => console.error("Error al cargar grupos:", error))
      .finally(() => hideLoader());
  };

  useEffect(() => {
    loadGrupos();
  }, []);

  const programasUnicos = Array.from(new Set(grupos.map(g => g.programa)));
  const estadosUnicos = Array.from(new Set(grupos.map(g => g.estado)));

  const gruposFiltrados = grupos.filter(g =>
    (programaFiltro ? g.programa === programaFiltro : true) &&
    (estadoFiltro ? g.estado === estadoFiltro : true)
  );

  return (
    <div className="p-6 space-y-6">
      {/* ✅ Pasamos loadGrupos como callback */}
      <CrearGrupo onGrupoCreado={loadGrupos} />

      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-[#ed2e91]">
        <FaUsers className="text-[#ff5176]" />
        Listado de Grupos
      </h2>

      {/* Filtros */}
      <div className="mb-4 flex gap-4 flex-wrap">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Filtrar por programa
          </label>
          <select
            className="px-4 py-2 border rounded-lg text-sm"
            value={programaFiltro}
            onChange={e => setProgramaFiltro(e.target.value)}
          >
            <option value="">Todos los programas</option>
            {programasUnicos.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Filtrar por estado
          </label>
          <select
            className="px-4 py-2 border rounded-lg text-sm"
            value={estadoFiltro}
            onChange={e => setEstadoFiltro(e.target.value)}
          >
            <option value="">Todos los estados</option>
            {estadosUnicos.map(e => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full bg-white text-sm text-gray-800">
          <thead className="bg-gray-800 text-white">
            <tr>
              {["ID", "Código", "Programa", "Semestre", "Estado"].map(col => (
                <th key={col} className="text-left px-4 py-3">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gruposFiltrados.map(grupo => (
              <tr key={grupo.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{grupo.id}</td>
                <td className="px-4 py-2">{grupo.codigo}</td>
                <td className="px-4 py-2">{grupo.programa}</td>
                <td className="px-4 py-2">{grupo.semestre}</td>
                <td className="px-4 py-2">{grupo.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
