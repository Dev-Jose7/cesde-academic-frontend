const UpcomingClasses = () => {
  const classes = [
    { subject: "Matemáticas", time: "10:00 AM", room: "Aula 302" },
    { subject: "Física", time: "2:00 PM", room: "Aula 108" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow p-4 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Próximas clases</h3>
      <ul className="divide-y divide-gray-100">
        {classes.map((cls, index) => (
          <li key={index} className="py-2 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-700">{cls.subject}</p>
              <p className="text-sm text-gray-500">{cls.room}</p>
            </div>
            <span className="text-sm text-gray-600">{cls.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingClasses;

