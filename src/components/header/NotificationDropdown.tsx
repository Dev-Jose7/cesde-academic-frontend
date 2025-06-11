import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { fetchAuth } from "../../utils/fetchAuth";
import { hideLoader, showLoader } from "../common/Loader";

interface Anuncio {
  id: number;
  titulo: string;
  mensaje: string;
  fecha: string;
  clase: {
    grupo: string;
    docente: string;
    modulo: string;
  };
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioString = localStorage.getItem("usuario");
    if (usuarioString) {
      try {
        const usuario = JSON.parse(usuarioString);
        obtenerAnuncios(usuario);
      } catch (error) {
        console.error("Error al parsear usuario:", error);
      }
    }
  }, []);

  const obtenerAnuncios = async (usuario: any) => {
    try {
      showLoader("Cargando...")
      const res = await fetchAuth("api/anuncio/lista");
      const data: Anuncio[] = await res.json();

      if (usuario.tipo === "estudiante") {
        const grupoEstudiante = usuario.grupo || "";
        const filtrados = data.filter(
          (anuncio) => anuncio.clase?.grupo === grupoEstudiante
        );
        setAnuncios(filtrados);
      } else {
        setAnuncios(data);
      }
    } catch (error) {
      console.error("Error al obtener anuncios:", error);
    } finally {
      hideLoader();
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setNotifying(false);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleRedirect = () => {
    closeDropdown();
    navigate("/dashboard/anuncios");
  };

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={toggleDropdown}
      >
        <span
          className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 ${
            !notifying ? "hidden" : "flex"
          }`}
        >
          <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
        </span>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405C18.79 14.79 18 13.42 18 12V9a6 6 0 10-12 0v3c0 1.42-.79 2.79-1.595 3.595L3 17h5m4 0v1a3 3 0 11-6 0v-1h6z"
          />
        </svg>
      </button>

      <Dropdown isOpen={isOpen} onClose={closeDropdown}>
        <div className="w-[320px] max-h-[400px] overflow-y-auto rounded-xl shadow-lg bg-white p-2 space-y-2">
          {anuncios.length === 0 ? (
            <DropdownItem>
              <span className="text-sm text-gray-500">Sin notificaciones</span>
            </DropdownItem>
          ) : (
            anuncios.slice(0, 5).map((anuncio) => (
              <DropdownItem
                key={anuncio.id}
                onClick={handleRedirect}
                className="cursor-pointer hover:bg-gray-100 rounded-md p-2 transition"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-sm text-gray-800 leading-tight">
                    {anuncio.titulo}
                  </p>
                  <p className="text-xs text-gray-600 leading-snug">
                    {anuncio.mensaje}
                  </p>
                  <p className="text-[10px] text-gray-400 italic">
                    {anuncio.clase?.modulo} - {anuncio.clase?.grupo}
                  </p>
                </div>
              </DropdownItem>
            ))
          )}
        </div>
      </Dropdown>
    </div>
  );
}






