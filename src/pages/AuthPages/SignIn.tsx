import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Usuario } from '../../context/UserContext';
import PageMeta from '../../components/common/PageMeta';
import logoCesde from '../../assets/images/logo-Cesde-2023.svg';
import logoCesde2 from '../../assets/images/logo-cesde-2.png';
import './Login.css';
type FormData = {
  cedula: string;
  contrasena: string;
};

// export type Usuario = {
//   id: number;
//   cedula: string;
//   nombre: string;
//   tipo: 'ESTUDIANTE' | 'DOCENTE' | 'DIRECTIVO' | 'ADMINISTRATIVO';
//   estado: string;
// };

type SignInProps = {
  onLogin: (usuario: Usuario) => void;
};

import { showLoader, hideLoader } from "../../components/common/Loader";
import { resolveUrl } from '../../utils/fetchAuth';



export default function SignIn({ onLogin }: SignInProps) {
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setMensaje(null);
    setError(null);
    showLoader("Iniciando sesión");
    let endpoint = resolveUrl('/api/auth/login') || ""

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setError('Cédula o contraseña incorrecta');
        return;
      }

      const loginData = await response.json();
      const { usuario, mensaje, accessToken, refreshToken } = loginData;

      setMensaje(mensaje);

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      const usuarioCompleto: Usuario = {
        id: usuario.id,
        cedula: usuario.cedula,
        nombre: usuario.nombre,
        tipo: usuario.tipo,
        estado: usuario.status,
      };

      onLogin(usuarioCompleto);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error en el login:', error);
      setError('Hubo un error al iniciar sesión. Intenta de nuevo.');
    } finally {
      hideLoader();
    }
  };

  return (
    <>
      <PageMeta
        title="Inicio de sesión | Cesde Academic"
        description="Accede a la plataforma Cesde Academic con tu cédula y contraseña"
      />

      <div className="login-wrapper">
        <div className="login-left">
          <img src={logoCesde2} alt="Logo CESDE" className="login-left-logo" />
          <h2 className="login-left-title">Bienvenido a Cesde Academic</h2>
          <p className="login-left-text">
            La plataforma donde desarrollas tu potencial, accedes a contenido exclusivo y gestionas tu proceso académico de manera dinámica. Conoce notas, actividades, horarios y programaciones.
          </p>
        </div>

        <div className="login-right">
          <div className="login-card">
            <div className="text-center mb-4">
              <img src={logoCesde} alt="Logo CESDE" className="login-logo" />
              <h4 className="login-title">Iniciar sesión</h4>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Mensajes */}
              {mensaje && <div className="alert alert-success text-center">{mensaje}</div>}
              {error && <div className="alert alert-danger text-center">{error}</div>}

              <div className="form-group">
                <label htmlFor="cedula">Cédula</label>
                <input
                  type="text"
                  id="cedula"
                  className="form-control"
                  {...register('cedula', { required: 'Este campo es obligatorio' })}
                />
                {errors.cedula && <p className="error">{errors.cedula.message}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="contrasena">Contraseña</label>
                <input
                  type="password"
                  id="contrasena"
                  className="form-control"
                  {...register('contrasena', { required: 'Este campo es obligatorio' })}
                />
                {errors.contrasena && <p className="error">{errors.contrasena.message}</p>}
              </div>

              <div className="flex items-center form-check mb-3">
                <input type="checkbox" className="form-check-input mr-2" id="check1" />
                <label className="form-check-label" htmlFor="check1">Recordarme</label>
              </div>

              <button type="submit" className="btn login-button mb-3">Ingresar</button>

              <div className="text-center mb-3">
                <p className="forgot-password text-muted">¿Olvidaste tu contraseña?</p>
              </div>

              <button className="btn btn-microsoft" type="button">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                  alt="Microsoft Logo"
                  className="microsoft-logo"
                />
                <span>Iniciar con Microsoft</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          showLoader("Probando loader...");
          setTimeout(() => hideLoader(), 2000);
        }}
      >
        Ver loader
      </button>
    </>
  );
}
