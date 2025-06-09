import { useEffect, useState } from "react";
import "./Calificaciones.css";
import { fetchAuth } from "../../../utils/fetchAuth";

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
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const usuario = localStorage.getItem("usuario");
      if (!usuario) {
        alert("No hay información de usuario. Inicia sesión.");
        window.location.href = "/login";
        return;
      }

      try {
        const user = JSON.parse(usuario);
        const response = await fetchAuth(`/api/calificacion/estudiante/${user.id}`);

        if (!response.ok) {
          if (response.status === 401) {
            alert("Tu sesión ha expirado o el token es inválido. Por favor vuelve a iniciar sesión.");
            window.location.href = "/login";
            return;
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setCalificaciones(data);
      } catch (err: any) {
        console.error("Error cargando calificaciones:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
  if (nota >= 4) return "bg-pink";   
  if (nota >= 3) return "bg-gray-medium";
  return "bg-gray-light";
}






