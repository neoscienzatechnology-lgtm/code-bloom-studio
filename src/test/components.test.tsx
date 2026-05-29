import { vi, describe, it, expect, beforeEach } from "vitest";
import { act, render, renderHook, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useLessonEditor } from "@/hooks/useLessonEditor";

const mockUseAuth = vi.mocked(useAuth);

function fakeAuth(overrides: Partial<ReturnType<typeof useAuth>> = {}) {
  return {
    session: null,
    user: null,
    loading: false,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
    ...overrides,
  } as ReturnType<typeof useAuth>;
}

describe("ProtectedRoute", () => {
  beforeEach(() => mockUseAuth.mockReset());

  it("shows the loading spinner while auth is resolving", () => {
    mockUseAuth.mockReturnValue(fakeAuth({ loading: true }));
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>protected content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.queryByText("protected content")).toBeNull();
    expect(document.querySelector(".animate-spin")).not.toBeNull();
  });

  it("redirects unauthenticated users to /cadastro", () => {
    mockUseAuth.mockReturnValue(fakeAuth());
    render(
      <MemoryRouter initialEntries={["/perfil"]}>
        <Routes>
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <div>perfil</div>
              </ProtectedRoute>
            }
          />
          <Route path="/cadastro" element={<div>cadastro page</div>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.queryByText("perfil")).toBeNull();
    expect(screen.getByText("cadastro page")).toBeTruthy();
  });

  it("renders children when the user is signed in", () => {
    mockUseAuth.mockReturnValue(
      fakeAuth({ user: { id: "u1" } as ReturnType<typeof useAuth>["user"] }),
    );
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>protected content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText("protected content")).toBeTruthy();
  });
});

describe("useLessonEditor reducer", () => {
  it("starts with safe defaults", () => {
    const { result } = renderHook(() => useLessonEditor());
    expect(result.current.state).toEqual({
      running: false,
      isCorrect: null,
      output: null,
      reflectiveQ: null,
      hintIndex: -1,
      showXP: false,
      codeSaved: true,
      paceMode: null,
      bonusActive: false,
    });
  });

  it("patch merges only the fields provided", () => {
    const { result } = renderHook(() => useLessonEditor());
    act(() => result.current.patch({ running: true, output: "saída" }));
    expect(result.current.state.running).toBe(true);
    expect(result.current.state.output).toBe("saída");
    expect(result.current.state.codeSaved).toBe(true);
    expect(result.current.state.paceMode).toBeNull();
  });

  it("reset returns to the initial state", () => {
    const { result } = renderHook(() => useLessonEditor());
    act(() =>
      result.current.patch({ running: true, isCorrect: true, output: "x", showXP: true }),
    );
    act(() => result.current.reset());
    expect(result.current.state).toMatchObject({
      running: false,
      isCorrect: null,
      output: null,
      showXP: false,
    });
  });

  it("advanceHint clamps to the provided maximum", () => {
    const { result } = renderHook(() => useLessonEditor());
    act(() => result.current.advanceHint(2));
    expect(result.current.state.hintIndex).toBe(0);
    act(() => result.current.advanceHint(2));
    act(() => result.current.advanceHint(2));
    act(() => result.current.advanceHint(2));
    expect(result.current.state.hintIndex).toBe(2);
  });
});
