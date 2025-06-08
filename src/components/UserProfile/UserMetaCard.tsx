import React, { useEffect, useState } from "react";
import './UserMetaCard.css';

type UsuarioLocal = {
  nombre: string;
  tipo?: string;
};

const UserMetaCard = () => {
  const [usuario, setUsuario] = useState<UsuarioLocal | null>(null);

  useEffect(() => {
    // Suponiendo que en localStorage guardas el usuario como JSON stringificado
    const usuarioStr = localStorage.getItem("usuario");
    if (usuarioStr) {
      setUsuario(JSON.parse(usuarioStr));
    }
  }, []);

  if (!usuario) return null; // o puedes mostrar un loader / placeholder

  return (
    <div className="user-card">
      <div className="user-avatar">{usuario.nombre.charAt(0)}</div>
      <div className="user-info">
        <h2 className="user-name">{usuario.nombre}</h2>
        <p className="user-role">{usuario.tipo || "Usuario"}</p>
      </div>
    </div>
  );
};

export default UserMetaCard;
