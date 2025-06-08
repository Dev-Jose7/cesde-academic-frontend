const StudentProgressSummary = () => {
  return (
    <div className="bg-[#f8f9fa] rounded-2xl shadow p-4 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Resumen de progreso estudiantil</h3>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-gray-900">85%</p>
          <p className="text-sm text-gray-500">Notas aprobadas</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">12</p>
          <p className="text-sm text-gray-500">Estudiantes en riesgo</p>
        </div>
      </div>
    </div>
  );
};

export default StudentProgressSummary;

