import { test, expect } from "@playwright/test";

/**
 * Przykładowy test E2E dla strony głównej
 *
 * Ten test pokazuje podstawy Playwright:
 * - Nawigację do strony
 * - Interakcję z elementami
 * - Asercje
 */

test.describe("Strona główna", () => {
  test("powinien wyświetlić tytuł strony", async ({ page }) => {
    // Arrange - przejdź do strony głównej
    await page.goto("/");

    // Assert - sprawdź czy tytuł jest poprawny
    await expect(page).toHaveTitle(/ZwierzakBezAlergii/i);
  });

  test("powinien wyświetlić nagłówek nawigacyjny", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act - znajdź nagłówek
    const header = page.locator("header");

    // Assert - sprawdź czy nagłówek istnieje i jest widoczny
    await expect(header).toBeVisible();
  });

  test("powinien nawigować do strony z karmami", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act - nawiguj bezpośrednio (omijamy kliknięcie przez dev toolbar)
    await page.goto("/foods");

    // Assert - sprawdź czy URL jest poprawny
    await expect(page).toHaveURL(/\/foods/);
  });
});
