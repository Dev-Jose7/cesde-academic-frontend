// src/utils/fetchAuth.ts
import { showLoader, hideLoader } from "../components/common/Loader";

export async function fetchAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  showLoader("Cargando...");

  try {
    const withAuthHeader = {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };

    let response = await fetch(url, withAuthHeader);

    if (response.status === 401 && refreshToken) {
      const refreshResponse = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshResponse.ok) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("usuario")
        window.dispatchEvent(new Event("logout"));
        hideLoader();
        return Promise.reject(new Error("Sesión expirada. Redirigiendo al login."));
      }

      const newTokens = await refreshResponse.json();
      localStorage.setItem("accessToken", newTokens.accessToken);
      localStorage.setItem("refreshToken", newTokens.refreshToken);

      const retryOptions = {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${newTokens.accessToken}`,
          "Content-Type": "application/json",
        },
      };

      response = await fetch(url, retryOptions);
    }

    if (response.status === 403) {
      console.error("El usuario no está autorizado para consultar el recurso");
    }

    hideLoader();
    return response;

  } catch (error) {
    hideLoader();
    throw error;
  }
}