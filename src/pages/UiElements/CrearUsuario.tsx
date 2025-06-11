import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa";

interface CrearUsuarioProps {
  onCrear: (usuario: {
    nombre: string;
    cedula: string;
    correo: string;
    contrasena: string;
    tipo: string;
  }) => void;
}

const CrearUsuario: React.FC<CrearUsuarioProps> = ({ onCrear }) => {
  const [form, setForm] = useState({
    nombre: "",
    cedula: "",
    correo: "",
    contrasena: "",
    tipo: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nombre || !form.cedula || !form.correo || !form.contrasena || !form.tipo) {
      alert("Por favor completa todos los campos.");
      return;
    }

    onCrear(form);
  };

  return (
    <div className="w-full px-8 py-6 bg-white rounded-2xl shadow-lg space-y-6 md:col-span-2">
      <h2 className="text-2xl font-bold text-[#ed2e91] flex items-center gap-2">
        <FaUserPlus className="text-[#ff5176]" />
        Crear Usuario
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium">Nombre Completo</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej: Laura Torres Vanegas"
            className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff7c5e]"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium">Cédula</label>
          <input
            type="text"
            name="cedula"
            value={form.cedula}
            onChange={handleChange}
            placeholder="Ej: 1034543213"
            className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff7c5e]"
          />
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="text-sm font-medium">Correo Electrónico</label>
          <input
            type="email"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            placeholder="Ej: correo@ejemplo.com"
            className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff7c5e]"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium">Contraseña</label>
          <input
            type="password"
            name="contrasena"
            value={form.contrasena}
            onChange={handleChange}
            placeholder="••••••••"
            className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff7c5e]"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium">Tipo de Usuario</label>
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff7c5e]"
          >
            <option value="">Seleccione una opción</option>
            <option value="ESTUDIANTE">Estudiante</option>
            <option value="DOCENTE">Docente</option>
            <option value="ADMINISTRATIVO">Administrativo</option>
            <option value="DIRECTIVO">Directivo</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-[#ed2e91] text-white py-2 px-4 rounded-md hover:bg-[#ff5176] transition"
          >
            Crear Usuario
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearUsuario;
