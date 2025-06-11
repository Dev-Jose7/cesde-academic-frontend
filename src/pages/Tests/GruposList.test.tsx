import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import GruposList from "../UiElements/GrupoList";
import * as fetchAuthModule from "../../utils/fetchAuth";

// Mockeamos el módulo
vi.mock("../../utils/fetchAuth", () => ({
  fetchAuth: vi.fn(),
}));

// Forzamos el tipo de fetchAuth como vi.fn()
const mockedFetchAuth = fetchAuthModule.fetchAuth as unknown as ReturnType<typeof vi.fn>;

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

    await waitFor(() => {
      expect(screen.queryByText("GRP101")).not.toBeNull();
    });
  });
});


