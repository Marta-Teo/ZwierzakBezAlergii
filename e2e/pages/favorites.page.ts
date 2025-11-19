import { type Page, type Locator } from "@playwright/test";

/**
 * Page Object Model dla strony z ulubionymi karmami
 */
export class FavoritesPage {
  readonly page: Page;
  readonly favoriteFoods: Locator;
  readonly emptyMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.favoriteFoods = page.locator('[data-testid="favorite-food"]').or(page.locator(".favorite-food"));
    this.emptyMessage = page.getByText(/nie masz.*ulubionych|no favorites/i);
  }

  async goto() {
    await this.page.goto("/favorites");
  }

  async getFavoriteCount(): Promise<number> {
    return await this.favoriteFoods.count();
  }

  async hasFavorites(): Promise<boolean> {
    const count = await this.getFavoriteCount();
    return count > 0;
  }

  async isEmpty(): Promise<boolean> {
    return await this.emptyMessage.isVisible();
  }
}
