import { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import './custom.css';

type Usuario = {
  id: number;
  cedula: string;
  nombre: string;
  tipo: string;
  creado?: string;
  actualizado?: string;
};

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();

  const [usuario, setUsuario] = useState<Usuario>({
    id: 0,
    cedula: "",
    nombre: "",
    tipo: "",
    creado: "",
    actualizado: "",
  });

  useEffect(() => {
    const usuarioStr = localStorage.getItem("usuario");
    if (usuarioStr) {
      try {
        const userObj = JSON.parse(usuarioStr);
        setUsuario(userObj);
      } catch (error) {
        console.warn("Error parsing usuario from localStorage", error);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    localStorage.setItem("usuario", JSON.stringify(usuario));
    closeModal();
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl bg-white shadow-lg dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-xl font-bold text-[--primary-color] lg:mb-6">Información Personal</h4>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6 2xl:gap-x-24">
            <p className="text-sm font-medium text-gray-800">Cédula: {usuario.cedula}</p>
            <p className="text-sm font-medium text-gray-800">Nombre: {usuario.nombre}</p>
            <p className="text-sm font-medium text-gray-800">Tipo: {usuario.tipo}</p>
          </div>
        </div>

        <button
          onClick={openModal}
          className="btn-outline px-5 py-3 rounded-full transition duration-200"
        >
          ✎ Editar
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="w-full max-w-[700px] rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-10">
          <h4 className="text-2xl font-semibold text-[--primary-color] mb-2">Editar información personal</h4>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto">
              {/* No editamos el ID ni fechas */}
              <input
                type="text"
                id="cedula"
                name="cedula"
                placeholder="Cédula"
                value={usuario.cedula}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />

              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Nombre completo"
                value={usuario.nombre}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />

              <input
                type="text"
                id="tipo"
                name="tipo"
                placeholder="Tipo de usuario"
                value={usuario.tipo}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />
            </div>

            <div className="flex flex-col-reverse items-stretch gap-3 mt-6 lg:flex-row lg:justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="btn-outline px-4 py-2 rounded-md border border-gray-300"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="btn-primary px-4 py-2 rounded-md bg-[--primary-color] text-white"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}







