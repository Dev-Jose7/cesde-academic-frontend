
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import VistaAdministrativo from "../Dashboard/VistaAdministrativo";

// Mock de los componentes hijos
vi.mock("../../components/ecommerce/StatisticsChart", () => ({
  default: () => <div>StatisticsChart</div>,
}));
vi.mock("../../components/ecommerce/RecentOrders", () => ({
  default: () => <div>RecentOrders</div>,
}));
vi.mock("../../components/ecommerce/StudentStats", () => ({
  default: () => <div>StudentStats</div>,
}));
vi.mock("../../components/ecommerce/EnrollmentTypes", () => ({
  default: () => <div>EnrollmentTypes</div>,
}));
vi.mock("../../components/ecommerce/CourseTypes", () => ({
  default: () => <div>CourseTypes</div>,
}));
vi.mock("../../components/ecommerce/TeacherInfo", () => ({
  default: () => <div>TeacherInfo</div>,
}));
vi.mock("../../components/ecommerce/AverageGrades", () => ({
  default: () => <div>AverageGrades</div>,
}));
vi.mock("../../components/ecommerce/Notifications", () => ({
  default: () => <div>Notifications</div>,
}));

describe("VistaAdministrativo", () => {
  it("renderiza todos los componentes hijos esperados", () => {
    render(<VistaAdministrativo />);

    expect(screen.queryByText("StatisticsChart")).not.toBeNull();
    expect(screen.queryByText("Notifications")).not.toBeNull();
    expect(screen.queryByText("StudentStats")).not.toBeNull();
    expect(screen.queryByText("EnrollmentTypes")).not.toBeNull();
    expect(screen.queryByText("AverageGrades")).not.toBeNull();
    expect(screen.queryByText("CourseTypes")).not.toBeNull();
    expect(screen.queryByText("TeacherInfo")).not.toBeNull();
    expect(screen.queryByText("RecentOrders")).not.toBeNull();
    expect(
      screen.queryByText("Vista para administrativos - control y seguimiento")
    ).not.toBeNull();
  });
});
