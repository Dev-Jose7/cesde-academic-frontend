import { ClipboardList, Upload, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickActions  = () => {
  const actions = [
    { label: "Subir notas", icon: <Upload size={18} color="#fff" />, path: "/dashboard/calificaciones" },
    { label: "Nueva actividad", icon: <ClipboardList size={18} color="#fff" />, path: "/dashboard/actividades" },
    { label: "Reportes", icon: <Send size={18} color="#fff" />, path: "/dashboard/reportes" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Acciones rápidas</h3>
      <ul className="space-y-3">
        {actions.map((action, i) => (
          <li key={i}>
            <Link
              to={action.path}
              className="flex items-center space-x-3 p-2 rounded-lg transition"
              style={{ backgroundColor: '#ff5176' }}
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full">
                {action.icon}
              </div>
              <span className="text-sm text-white">{action.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuickActions;



