import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const gradeData = [
  { course: "Matemáticas", average: 4.2 },
  { course: "Física", average: 3.8 },
  { course: "Química", average: 4.5 },
  { course: "Historia", average: 4.0 },
];

export default function AverageGrades() {
  return (
    <div className="p-4 bg-white">
      <h2 className="text-base font-semibold mb-4 text-gray-700 border-b border-gray-300 pb-2">
        Promedios Académicos
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={gradeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <XAxis 
            dataKey="course" 
            tick={{ fill: '#6b7280', fontSize: 12 }} // gray-500 + más pequeño
            axisLine={{ stroke: '#d1d5db' }} // gray-300
            tickLine={false}
          />
          <YAxis 
            domain={[0, 5]} 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={false}
            ticks={[0,1,2,3,4,5]}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'white', borderColor: '#d1d5db', borderRadius: 6, fontSize: 12 }} 
            itemStyle={{ color: '#ed2e91', fontWeight: '600' }}
          />
          <Line 
            type="monotone" 
            dataKey="average" 
            stroke="#ed2e91" 
            strokeWidth={3} 
            dot={{ stroke: '#ed2e91', strokeWidth: 2, r: 4, fill: 'white' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

