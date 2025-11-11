import { type Page, type Locator } from "@playwright/test";

/**
 * Page Object Model dla strony rejestracji
 */
export class RegisterPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByLabel(/^hasło|^password/i).first();
    this.confirmPasswordInput = page.getByLabel(/potwierdź|confirm/i);
    this.submitButton = page.locator('form').getByRole("button", { name: /zarejestruj|register/i });
    this.errorMessage = page.getByRole("alert");
  }

  async goto() {
    await this.page.goto("/register");
  }

  async register(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.submitButton.click();
  }

  async getErrorText(): Promise<string | null> {
    if (await this.errorMessage.isVisible()) {
      return await this.errorMessage.textContent();
    }
    return null;
  }
}

