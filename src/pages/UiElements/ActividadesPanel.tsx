import { useEffect, useState } from 'react';
import { fetchAuth } from '../../utils/fetchAuth';
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import { FiPlusCircle, FiTrash2, FiUploadCloud } from 'react-icons/fi';
import { FaTasks } from 'react-icons/fa';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

const ActividadesPanel = () => {
  const [usuario, setUsuario] = useState<any>(null);
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [nuevaActividad, setNuevaActividad] = useState({
    titulo: '',
    descripcion: '',
    tipo: '',
    fechaEntrega: '',
  });
  const [fechaEntregaDate, setFechaEntregaDate] = useState<Date | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (usuario) obtenerActividades();
  }, [usuario]);

  useEffect(() => {
    if (nuevaActividad.fechaEntrega) {
      setFechaEntregaDate(new Date(nuevaActividad.fechaEntrega));
    } else {
      setFechaEntregaDate(null);
    }
  }, [nuevaActividad.fechaEntrega]);

  const obtenerActividades = async () => {
    try {
      const res = await fetchAuth('/api/actividad/lista');
      if (res.ok) {
        const data: Actividad[] = await res.json();
        const filtradas =
          usuario.tipo === 'DOCENTE'
            ? data.filter((a) => a.clase.docente === usuario.nombre)
            : data;
        setActividades(filtradas);
      } else {
        console.error('Error al obtener actividades, status:', res.status);
      }
    } catch (err) {
      console.error('Error al obtener actividades', err);
    }
  };

  const crearActividad = async () => {
    if (!nuevaActividad.titulo.trim()) return alert('El título es obligatorio');
    if (!nuevaActividad.tipo.trim()) return alert('El tipo es obligatorio');

    const actividadParaAPI = {
      titulo: nuevaActividad.titulo.trim(),
      descripcion: nuevaActividad.descripcion.trim(),
      tipo: nuevaActividad.tipo.trim(),
      fechaEntrega:
        nuevaActividad.fechaEntrega || new Date().toISOString().split('T')[0],
    };

    try {
      const res = await fetchAuth('/api/actividad/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actividadParaAPI),
      });

      if (!res.ok) {
        const error = await res.text();
        alert(`Error al crear actividad: ${res.status} - ${error}`);
        return;
      }

      setNuevaActividad({ titulo: '', descripcion: '', tipo: '', fechaEntrega: '' });
      setFechaEntregaDate(null);
      obtenerActividades();
    } catch (err) {
      console.error('Error al crear actividad', err);
      alert('Error al crear actividad');
    }
  };

  const eliminarActividad = async (id: number) => {
    try {
      const res = await fetchAuth(`/api/actividad/remover/${id}`, { method: 'DELETE' });
      if (res.ok) obtenerActividades();
      else alert('No se pudo eliminar la actividad');
    } catch (err) {
      console.error('Error al eliminar actividad', err);
      alert('Error al eliminar actividad');
    }
  };

  const handleDateChange = (date: Date | null) => {
    setFechaEntregaDate(date);
    setNuevaActividad({
      ...nuevaActividad,
      fechaEntrega: date ? date.toISOString().split('T')[0] : '',
    });
  };

  return (
    <>
      <PageMeta title="Actividades" description="Gestión de actividades académicas" />
      <PageBreadcrumb pageTitle="Actividades" />

      {usuario?.tipo === 'DOCENTE' && (
        <div className="mb-10 p-6 bg-white rounded-xl shadow border border-gray-200">
          <div className="flex items-center mb-6 gap-2">
            <FiPlusCircle className="text-pink-600 text-2xl" />
            <h2 className="text-lg font-semibold text-gray-700">Crear nueva actividad</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border border-gray-300 p-3 rounded-lg text-sm"
              placeholder="Título"
              value={nuevaActividad.titulo}
              onChange={(e) => setNuevaActividad({ ...nuevaActividad, titulo: e.target.value })}
            />
            <input
              className="border border-gray-300 p-3 rounded-lg text-sm"
              placeholder="Descripción"
              value={nuevaActividad.descripcion}
              onChange={(e) => setNuevaActividad({ ...nuevaActividad, descripcion: e.target.value })}
            />
            <input
              className="border border-gray-300 p-3 rounded-lg text-sm"
              placeholder="Tipo"
              value={nuevaActividad.tipo}
              onChange={(e) => setNuevaActividad({ ...nuevaActividad, tipo: e.target.value })}
            />
            <ReactDatePicker
              selected={fechaEntregaDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              className="border border-gray-300 p-3 rounded-lg text-sm w-full"
              placeholderText="Selecciona la fecha de entrega"
              isClearable
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
          </div>
          <button
            className="mt-6 px-6 py-2 bg-pink-600 text-white text-sm rounded-lg hover:bg-pink-700 transition"
            onClick={crearActividad}
          >
            <FiPlusCircle className="inline-block mr-2" /> Crear Actividad
          </button>
        </div>
      )}

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
              {usuario?.tipo === 'DOCENTE' ? (
                <button
                  className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                  onClick={() => eliminarActividad(actividad.id)}
                >
                  <FiTrash2 /> Eliminar
                </button>
              ) : (
                <button
                  className="flex items-center gap-2 px-3 py-1 bg-gray-300 text-gray-600 text-xs rounded cursor-not-allowed"
                  disabled
                >
                  <FiUploadCloud /> Subir
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ActividadesPanel;







