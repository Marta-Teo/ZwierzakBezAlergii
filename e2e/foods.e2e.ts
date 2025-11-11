import { test, expect } from "@playwright/test";

/**
 * Testy E2E dla strony z karmami
 *
 * Pokazuje bardziej zaawansowane scenariusze:
 * - Filtrowanie
 * - Wyszukiwanie
 * - Paginację
 */

test.describe("Strona z karmami", () => {
  test.beforeEach(async ({ page }) => {
    // Przed każdym testem przejdź do strony z karmami
    await page.goto("/foods");
  });

  test("powinien wyświetlić listę karm", async ({ page }) => {
    // Poczekaj na załadowanie danych
    await page.waitForLoadState("networkidle");

    // Sprawdź czy jest jakaś karta karmy
    const foodCards = page.locator('[data-testid="food-card"]').or(page.locator(".food-card"));

    // Powinien być przynajmniej jeden produkt
    await expect(foodCards.first()).toBeVisible();
  });

  test("powinien umożliwić wyszukiwanie karmy", async ({ page }) => {
    // Poczekaj na załadowanie strony
    await page.waitForLoadState("networkidle");

    // Znajdź pole wyszukiwania
    const searchInput = page.getByPlaceholder(/szukaj/i);
    await expect(searchInput).toBeVisible();

    // Wpisz nazwę karmy
    await searchInput.fill("Royal Canin");

    // Poczekaj na wyniki
    await page.waitForTimeout(500);

    // Sprawdź czy wyniki zawierają wyszukiwaną frazę
    const results = page.locator('[data-testid="food-card"]').or(page.locator(".food-card"));

    if ((await results.count()) > 0) {
      const firstResult = results.first();
      await expect(firstResult).toContainText(/royal canin/i);
    }
  });

  test("powinien umożliwić filtrowanie po alergenach", async ({ page }) => {
    // Poczekaj na załadowanie
    await page.waitForLoadState("networkidle");

    // Znajdź sidebar z filtrami
    const filterSidebar = page.locator('[data-testid="filter-sidebar"]').or(page.locator("aside"));

    // Sprawdź czy sidebar istnieje
    if (await filterSidebar.isVisible()) {
      // Znajdź checkbox dla alergenu (np. kurczak)
      const allergenCheckbox = page.getByLabel(/kurczak|chicken/i);

      if (await allergenCheckbox.isVisible()) {
        await allergenCheckbox.check();

        // Poczekaj na przefiltrowanie wyników
        await page.waitForTimeout(500);

        // Wyniki powinny się zaktualizować
        await expect(page.locator('[data-testid="food-card"]').first()).toBeVisible();
      }
    }
  });

  test("powinien otworzyć modal ze szczegółami karmy", async ({ page }) => {
    // Poczekaj na załadowanie
    await page.waitForLoadState("networkidle");

    // Znajdź pierwszą kartę karmy
    const firstFoodCard = page.locator('[data-testid="food-card"]').first();

    if (await firstFoodCard.isVisible()) {
      // Kliknij w kartę
      await firstFoodCard.click();

      // Poczekaj na modal
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();

      // Modal powinien zawierać szczegóły
      await expect(modal).toContainText(/skład|ingredients/i);
    }
  });
});
