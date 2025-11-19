import { type Page, type Locator } from "@playwright/test";

/**
 * Page Object Model dla strony logowania
 *
 * Przykład jak organizować testy E2E w bardziej czytelny sposób.
 * Zamiast duplikować selektory w każdym teście, trzymamy je w jednym miejscu.
 */
export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Definiujemy selektory jako properties
    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByLabel(/hasło|password/i);
    // Bardziej precyzyjny selektor - przycisk submit wewnątrz formularza
    this.submitButton = page.locator("form").getByRole("button", { name: /zaloguj|login/i });
    this.errorMessage = page.getByRole("alert");
  }

  /**
   * Przejdź do strony logowania
   */
  async goto() {
    await this.page.goto("/login");
  }

  /**
   * Wypełnij formularz logowania
   */
  async fillLoginForm(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  /**
   * Kliknij przycisk logowania
   */
  async submit() {
    await this.submitButton.click();
  }

  /**
   * Zaloguj użytkownika (kombinacja metod powyżej)
   */
  async login(email: string, password: string) {
    await this.fillLoginForm(email, password);
    await this.submit();
  }

  /**
   * Pobierz tekst błędu
   */
  async getErrorText(): Promise<string | null> {
    if (await this.errorMessage.isVisible()) {
      return await this.errorMessage.textContent();
    }
    return null;
  }

  /**
   * Sprawdź czy formularz jest widoczny
   */
  async isFormVisible(): Promise<boolean> {
    return (await this.emailInput.isVisible()) && (await this.passwordInput.isVisible());
  }
}
