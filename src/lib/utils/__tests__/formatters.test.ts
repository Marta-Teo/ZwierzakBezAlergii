import { describe, it, expect } from "vitest";

/**
 * Przykład testu jednostkowego dla funkcji użytkowych
 *
 * Ten plik pokazuje jak testować czyste funkcje pomocnicze
 */

// Przykładowa funkcja do testowania
function formatPrice(price: number, currency = "PLN"): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency,
  }).format(price);
}

describe("formatters", () => {
  describe("formatPrice", () => {
    it("powinien sformatować cenę w PLN", () => {
      const result = formatPrice(100);
      expect(result).toContain("100,00");
      expect(result).toContain("zł");
    });

    it("powinien sformatować cenę z dwoma miejscami po przecinku", () => {
      const result = formatPrice(100.5);
      expect(result).toContain("100,50");
      expect(result).toContain("zł");
    });

    it("powinien obsłużyć 0", () => {
      const result = formatPrice(0);
      expect(result).toContain("0,00");
      expect(result).toContain("zł");
    });

    it("powinien obsłużyć negatywne wartości", () => {
      const result = formatPrice(-50);
      expect(result).toContain("50");
      expect(result).toContain("zł");
    });

    it("powinien obsłużyć różne waluty", () => {
      const result = formatPrice(100, "EUR");
      expect(result).toContain("100");
      expect(result).toContain("€");
    });
  });
});
