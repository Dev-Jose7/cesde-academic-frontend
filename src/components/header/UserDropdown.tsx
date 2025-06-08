import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useUser } from "../../context/UserContext"; // Asegúrate que la ruta es correcta
import { fetchAuth } from "../../utils/fetchAuth";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ nombre: string; tipo: string } | null>(null);
  const { setUsuario } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const usuarioString = localStorage.getItem("usuario");
      if (usuarioString) {
        try {
          // Intentar parsear como JSON
          setUser(JSON.parse(usuarioString));
        } catch {
          // Si no es JSON, asumir que es solo un nombre string plano
          setUser({ nombre: usuarioString, tipo: "desconocido" });
        }
      }
    } catch (error) {
      console.error("Error parsing usuario from localStorage:", error);
      setUser(null);
    }
  }, []);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  async function handleLogout() {

    try {
      await fetchAuth("/api/auth/logout", {method: "POST"});
      // Limpiar siempre
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("usuario");
      setUsuario(null);
      navigate("/signin");
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
  }

  // Sacar la inicial del nombre (primer caracter)
  const initial = user?.nombre ? user.nombre.charAt(0).toUpperCase() : "U";

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11 bg-[#ED2E91] flex items-center justify-center text-white font-bold">
          {initial}
        </span>
        <span className="block mr-1 font-medium text-theme-sm">{user?.nombre || "Usuario"}</span>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/dashboard/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Editar perfil
            </DropdownItem>
          </li>
        </ul>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          {/* Aquí podrías incluir un ícono de logout */}
          Cerrar sesión
        </button>
      </Dropdown>
    </div>
  );
}
