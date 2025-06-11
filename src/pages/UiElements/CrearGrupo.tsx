import React, { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { fetchAuth } from "../../utils/fetchAuth";
import { showLoader, hideLoader } from "../../components/common/Loader";

const CrearGrupo = ({ onGrupoCreado }: { onGrupoCreado: () => void }) => {
  const [programas, setProgramas] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [formData, setFormData] = useState({
    programaId: "",
    semestreId: "",
    estado: "ACTIVO",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProgramas, resSemestres] = await Promise.all([
          fetchAuth("/api/programa/lista"),
          fetchAuth("/api/semestre/lista"),
        ]);
        setProgramas(await resProgramas.json());
        setSemestres(await resSemestres.json());
      } catch (err) {
        console.error("Error al cargar programas o semestres:", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      programaId: parseInt(formData.programaId),
      semestreId: parseInt(formData.semestreId),
      estado: formData.estado,
    };

    try {
      showLoader("Creando grupo...");
      const res = await fetchAuth("/api/grupo/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al crear grupo");

      // ✅ Llamar a la función que recarga los grupos
      onGrupoCreado();

      // Opcional: limpiar formulario
      setFormData({
        programaId: "",
        semestreId: "",
        estado: "ACTIVO",
      });
    } catch (err) {
      console.error(err);
      alert("Error al crear grupo");
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="w-full px-8 py-6 bg-white rounded-2xl shadow-lg mb-6">
      <h2 className="text-2xl font-bold text-[#ed2e91] flex items-center gap-2">
        <FaUsers className="text-[#ff5176]" />
        Crear Grupo
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium">Programa Académico</label>
          <select
            name="programaId"
            value={formData.programaId}
            onChange={handleChange}
            required
            className="mt-1 p-2 border rounded-md"
          >
            <option value="">Seleccione un programa</option>
            {programas.map((p: any) => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium">Semestre</label>
          <select
            name="semestreId"
            value={formData.semestreId}
            onChange={handleChange}
            required
            className="mt-1 p-2 border rounded-md"
          >
            <option value="">Seleccione un semestre</option>
            {semestres.map((s: any) => (
              <option key={s.id} value={s.id}>{s.nombre || `Semestre ${s.id}`}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="text-sm font-medium">Estado</label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md"
          >
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
            <option value="COMPLETO">Completo</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-[#ed2e91] text-white py-2 px-4 rounded-md hover:bg-[#ff5176] transition"
          >
            Crear Grupo
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearGrupo;
