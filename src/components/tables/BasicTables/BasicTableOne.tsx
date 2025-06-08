import { useEffect, useState } from "react";
import "./Calificaciones.css";

interface Calificacion {
  id: number;
  actividad: string;
  estudiante: string;
  fecha: string;
  nota: number;
  creado: string;
  actualizado: string;
}

export default function BasicTableOne() {
  const [usuario, setUsuario] = useState<any>(null);
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuarioLocal = localStorage.getItem("usuario");
    const token = localStorage.getItem("accessToken");

    if (usuarioLocal && token) {
      try {
        const user = JSON.parse(usuarioLocal);
        setUsuario(user);

        fetch("api/calificacion/lista", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        })
          .then(async (res) => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then((data) => {
            setCalificaciones(data);
            setLoading(false);
          })
          .catch((err) => {
            console.error("Error al obtener calificaciones:", err);
            setLoading(false);
          });
      } catch (err) {
        console.error("Error al parsear usuario:", err);
        setLoading(false);
      }
    } else {
      console.warn("No hay usuario o token almacenado");
      setLoading(false);
    }
  }, []);

  return (
    <div className="container">
      <h2 className="title">Calificaciones Académicas</h2>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Actividad</th>
                <th>Estudiante</th>
                <th>Fecha</th>
                <th>Nota</th>
              </tr>
            </thead>
            <tbody>
              {calificaciones.map((item) => (
                <tr key={item.id}>
                  <td>{item.actividad}</td>
                  <td>{item.estudiante}</td>
                  <td>{item.fecha}</td>
                  <td>
                    <span className={`nota-badge ${getNotaColor(item.nota)}`}>
                      {item.nota.toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function getNotaColor(nota: number): string {
  if (nota >= 4) return "bg-success";
  if (nota >= 3) return "bg-warning";
  return "bg-danger";
}
