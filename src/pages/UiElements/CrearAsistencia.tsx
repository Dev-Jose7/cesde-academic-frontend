import React, { useEffect, useState } from "react";
import { fetchAuth } from "../../utils/fetchAuth";
import Button from "../../components/ui/button/Button";
import { FiPlus } from "react-icons/fi";

interface Clase {
  id: number;
  modulo: string;
  grupo: string;
  docente: string;
}

interface Estudiante {
  id: number;
  nombre: string; 
}

interface Props {
  onNuevaAsistencia: (asistencia: any) => void;
}

const CrearAsistencia: React.FC<Props> = ({ onNuevaAsistencia }) => {
  const [clases, setClases] = useState<Clase[]>([]);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    claseId: "",
    estudianteId: "",
    fecha: new Date().toISOString().split("T")[0],
    estado: "ASISTIO",
  });

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const resEstudiantes = await fetchAuth("/api/estudiante/lista");
        const resClases = await fetchAuth("/api/clase/lista");

        const dataEstudiantes = await resEstudiantes.json();
        const dataClases = await resClases.json();

        setEstudiantes(dataEstudiantes);
        setClases(dataClases);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchDatos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);

    const claseSeleccionada = clases.find((c) => c.id === parseInt(form.claseId));
    const estudianteSeleccionado = estudiantes.find((e) => e.id === parseInt(form.estudianteId));

    if (!claseSeleccionada || !estudianteSeleccionado) {
      console.error("Clase o estudiante no seleccionados correctamente");
      setLoading(false);
      return;
    }

    const asistencia = {
      id: 0,
      clase: {
        grupo: claseSeleccionada.grupo,
        docente: claseSeleccionada.docente,
        modulo: claseSeleccionada.modulo,
      },
      estudiante: estudianteSeleccionado.nombre, 
      fecha: form.fecha,
      estado: form.estado,
      creado: new Date().toISOString(),
      actualizado: new Date().toISOString(),
    };

    try {
      const res = await fetchAuth("/api/asistencia/crear", {
        method: "POST",
        body: JSON.stringify(asistencia),
      });

      if (!res.ok) throw new Error("Error al crear la asistencia");

      const nuevaAsistencia = await res.json();
      onNuevaAsistencia(nuevaAsistencia);

      // Reset del formulario
      setForm({
        claseId: "",
        estudianteId: "",
        fecha: new Date().toISOString().split("T")[0],
        estado: "ASISTIO",
      });
    } catch (err) {
      console.error("Error al crear asistencia:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow mb-6 space-y-4 border">
      <h2 className="text-lg font-semibold text-gray-800">Crear asistencia</h2>

      <div className="grid md:grid-cols-3 gap-4">
        <select
          name="claseId"
          value={form.claseId}
          onChange={handleChange}
          className="border p-2 rounded-md"
          required
        >
          <option value="">Seleccionar clase</option>
          {clases.map((c) => (
            <option key={c.id} value={c.id}>
              {c.modulo} - Grupo {c.grupo}
            </option>
          ))}
        </select>

        <select
          name="estudianteId"
          value={form.estudianteId}
          onChange={handleChange}
          className="border p-2 rounded-md"
          required
        >
          <option value="">Seleccionar estudiante</option>
          {estudiantes.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>

        <select
          name="estado"
          value={form.estado}
          onChange={handleChange}
          className="border p-2 rounded-md"
        >
          <option value="ASISTIO">ASISTIO</option>
          <option value="JUSTIFICADO">JUSTIFICADO</option>
          <option value="INASISTENCIA">INASISTENCIA</option>
        </select>
      </div>

      <input
        type="date"
        name="fecha"
        value={form.fecha}
        onChange={handleChange}
        required
        className="border p-2 rounded-md w-full"
      />

        <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-[#ed2e91] hover:bg-[#d01b7f] text-white rounded-md font-semibold flex items-center gap-2 transition duration-200"
            >
            <FiPlus />
            Registrar Asistencia
        </button>
    </div>
  );
};

export default CrearAsistencia;


