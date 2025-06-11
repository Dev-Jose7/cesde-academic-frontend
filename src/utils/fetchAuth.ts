
// Utilidad para resolver URL absoluta según el prefijo
export function resolveUrl(url: string): string {
  if (url.startsWith("/api")) {
    return "https://cesde-academic-app-production.up.railway.app" + url.replace("/api", "");
  } else if (url.startsWith("/analytics")) {
    return "https://cesde-academic-analytics-production.up.railway.app" + url.replace("/analytics", "");
  }
  return url;
}

export async function fetchAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  const fullUrl = resolveUrl(url);

  try {
    const withAuthHeader = {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };

    let response = await fetch(fullUrl, withAuthHeader);

    // Si el token expiró, intenta refrescarlo
    if (response.status === 401 && refreshToken) {
      const refreshResponse = await fetch(resolveUrl("/api/auth/refresh"), // ← Ahora también usa resolveUrl
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        }
      );

      if (!refreshResponse.ok) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("usuario")
        window.dispatchEvent(new Event("logout"));
        return Promise.reject(
          new Error("Sesión expirada. Redirigiendo al login.")
        );
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

      response = await fetch(fullUrl, retryOptions); // ← Reintenta con la URL ya resuelta
    }

    if (response.status === 403) {
      console.error("El usuario no está autorizado para consultar el recurso");
    }
    return response;

  } catch (error) {
    throw error;
  }
}
