import { type Page, type Locator } from "@playwright/test";

/**
 * Page Object Model dla strony z karmami
 */
export class FoodsPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly foodCards: Locator;
  readonly favoriteButtons: Locator;

  constructor(page: Page) {
    this.page = page;

    this.searchInput = page.getByPlaceholder(/szukaj/i);
    this.foodCards = page.locator('[data-testid="food-card"]').or(page.locator(".food-card"));
    this.favoriteButtons = page.getByRole("button", { name: /ulubione|favorite/i });
  }

  async goto() {
    await this.page.goto("/foods");
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    // Czekamy na debounce
    await this.page.waitForTimeout(500);
  }

  async clickFirstFood() {
    await this.foodCards.first().click();
  }

  async addToFavorites() {
    // Klikamy przycisk dodaj do ulubionych (może być w modallu lub na karcie)
    await this.favoriteButtons.first().click();
  }

  async getFoodCount(): Promise<number> {
    return await this.foodCards.count();
  }
}

