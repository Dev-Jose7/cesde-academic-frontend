const enrollmentData = [
  { type: "Regular", count: 400 },
  { type: "Becas", count: 150 },
  { type: "Especial", count: 60 },
];

export default function EnrollmentTypes() {
  const total = enrollmentData.reduce((acc, item) => acc + item.count, 0);

  return (
    <div className="p-4 bg-white">
      <h2 className="text-sm font-semibold mb-3 text-gray-700 border-b border-gray-300 pb-2">
        Tipos de Matriculación
      </h2>
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="py-2 text-gray-500 font-medium">Tipo</th>
            <th className="py-2 text-gray-500 font-medium">Cantidad</th>
            <th className="py-2 text-gray-500 font-medium">%</th>
          </tr>
        </thead>
        <tbody>
          {enrollmentData.map(({ type, count }) => (
            <tr
              key={type}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <td className="py-2 text-gray-700">{type}</td>
              <td className="py-2 text-gray-700">{count}</td>
              <td className="py-2 text-gray-700">{((count / total) * 100).toFixed(1)}%</td>
            </tr>
          ))}
          <tr className="font-semibold border-t border-gray-400 bg-gray-100">
            <td className="py-2 text-gray-800">Total</td>
            <td className="py-2 text-gray-800">{total}</td>
            <td className="py-2 text-gray-800">100%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
