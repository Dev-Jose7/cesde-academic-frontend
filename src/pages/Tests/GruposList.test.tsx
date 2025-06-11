import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import GruposList from "../UiElements/GrupoList";
import * as fetchAuthModule from "../../utils/fetchAuth";

// Mock del módulo
vi.mock("../../utils/fetchAuth");

// Acceder al mock correctamente
const mockedFetchAuth = fetchAuthModule.fetchAuth as unknown as jest.Mock;

describe("GruposList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza los grupos en la tabla", async () => {
    mockedFetchAuth.mockResolvedValueOnce({
      json: async () => [
        {
          id: 1,
          codigo: "GRP101",
          programa: "Ingeniería",
          semestre: "1",
          estado: "Activo",
        },
      ],
    });

    render(<GruposList />);

    // Esperar a que aparezca el grupo
    await waitFor(() => {
      expect(screen.getByText("GRP101")).toBeInTheDocument();
    });
  });
});
