import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, userEvent } from "../../../test/utils/test-utils";
import { Button } from "@/components/ui/button";

/**
 * Przykładowy test komponentu Button z shadcn/ui
 *
 * Ten plik pokazuje jak testować komponenty React:
 * - Renderowanie
 * - Interakcje użytkownika
 * - Props i warianty
 */

describe("Button (przykładowy test komponentu)", () => {
  it("powinien renderować tekst", () => {
    const { getByText } = renderWithProviders(<Button>Kliknij mnie</Button>);

    expect(getByText("Kliknij mnie")).toBeInTheDocument();
  });

  it("powinien wywołać onClick po kliknięciu", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    const { getByRole } = renderWithProviders(<Button onClick={handleClick}>Kliknij</Button>);

    await user.click(getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("powinien być disabled gdy prop disabled jest true", () => {
    const handleClick = vi.fn();

    const { getByRole } = renderWithProviders(
      <Button disabled onClick={handleClick}>
        Kliknij
      </Button>
    );

    const button = getByRole("button");
    expect(button).toBeDisabled();
  });

  it("powinien renderować różne warianty", () => {
    const { getByRole, rerender } = renderWithProviders(<Button variant="default">Default</Button>);

    expect(getByRole("button")).toBeInTheDocument();

    // Przetestuj inny wariant
    rerender(<Button variant="destructive">Destructive</Button>);
    expect(getByRole("button")).toBeInTheDocument();
  });

  it("powinien obsłużyć różne rozmiary", () => {
    const { getByRole, rerender } = renderWithProviders(<Button size="default">Normal</Button>);

    expect(getByRole("button")).toBeInTheDocument();

    rerender(<Button size="sm">Small</Button>);
    expect(getByRole("button")).toBeInTheDocument();

    rerender(<Button size="lg">Large</Button>);
    expect(getByRole("button")).toBeInTheDocument();
  });

  it("powinien renderować jako link gdy przekazano asChild", () => {
    const { container } = renderWithProviders(
      <Button asChild>
        <a href="/test">Link</a>
      </Button>
    );

    const link = container.querySelector("a");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
  });
});

/**
 * WSKAZÓWKI:
 *
 * 1. Używaj renderWithProviders zamiast render:
 *    - Automatycznie dodaje React Query Provider
 *    - Unika duplikacji kodu
 *
 * 2. Używaj userEvent zamiast fireEvent:
 *    - Bardziej realistyczne symulacje interakcji
 *    - Lepiej odwzorowuje rzeczywiste zachowanie użytkownika
 *
 * 3. Testuj zachowania, nie implementację:
 *    - ✅ "powinien wywołać onClick"
 *    - ❌ "powinien zmienić state.clicked na true"
 *
 * 4. Używaj getByRole gdy to możliwe:
 *    - Lepsze dla accessibility
 *    - Bardziej odporne na zmiany
 *
 * 5. Mockuj zewnętrzne zależności:
 *    - API calls
 *    - Timery
 *    - Browser APIs
 */
