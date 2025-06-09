// src/pages/estudiante/ActividadesPanelEstudent.tsx
import { useEffect, useState } from 'react';
import { fetchAuth } from '../../utils/fetchAuth';
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import { FiUploadCloud } from 'react-icons/fi';
import { FaTasks } from 'react-icons/fa';

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

const ActividadesPanelEstudent = () => {
  const [usuario, setUsuario] = useState<any>(null);
  const [actividades, setActividades] = useState<Actividad[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (usuario?.tipo === 'ESTUDIANTE') {
      obtenerActividades();
    }
  }, [usuario]);

  const obtenerActividades = async () => {
    try {
      const res = await fetchAuth('/api/actividad/lista');
      if (res.ok) {
        const data: Actividad[] = await res.json();
        setActividades(data);
      } else {
        console.error('Error al obtener actividades, status:', res.status);
      }
    } catch (err) {
      console.error('Error al obtener actividades', err);
    }
  };

  return (
    <>
      <PageMeta title="Actividades" description="Actividades asignadas para estudiantes" />
      <PageBreadcrumb pageTitle="Actividades" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actividades.map((actividad) => (
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
              Clase: {actividad.clase?.grupo} - {actividad.clase?.modulo} - {actividad.clase?.docente}
            </p>
            <p className="text-xs text-gray-500">
              Fecha Entrega: {actividad.fechaEntrega || 'No definida'}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                className="flex items-center gap-2 px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 transition"
                onClick={() => alert('Funcionalidad de subida aún no implementada')}
              >
                <FiUploadCloud /> Subir Actividad
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ActividadesPanelEstudent;








