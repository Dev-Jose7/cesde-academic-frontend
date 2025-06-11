
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Enero", Activos: 120, Desercion: 15, Nuevos: 30 },
  { name: "Febrero", Activos: 130, Desercion: 10, Nuevos: 40 },
  { name: "Marzo", Activos: 125, Desercion: 20, Nuevos: 25 },
  { name: "Abril", Activos: 140, Desercion: 18, Nuevos: 35 },
];

export default function StudentStats() {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center">
        <span className="ml-1">Estadísticas Estudiantes</span>
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barCategoryGap={16}>
          <XAxis dataKey="name" stroke="#9ca3af" /> 
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              borderColor: "#ed2e91",
              fontSize: "14px",
              color: "#374151",
            }}
          />
          <Bar dataKey="Activos" fill="#ed2e91" radius={[8, 8, 0, 0]} />
          <Bar dataKey="Desercion" fill="#ff5176" radius={[8, 8, 0, 0]} />
          <Bar dataKey="Nuevos" fill="#ff7c5e" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
