const NotificationsCard = () => {
  const notifications = [
    "Entrega de notas antes del 10 de junio.",
    "Reunión de área el miércoles a las 3:00 PM.",
    "Nuevo formato de planeación disponible.",
  ];

  return (
    <div className="bg-white rounded-2xl shadow p-4 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Notificaciones</h3>
      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
        {notifications.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsCard;


