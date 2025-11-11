import { type Page, type Locator } from "@playwright/test";

/**
 * Page Object Model dla strony z psami użytkownika
 */
export class DogsPage {
  readonly page: Page;
  readonly addDogButton: Locator;
  readonly dogNameInput: Locator;
  readonly dogWeightInput: Locator;
  readonly dogBirthDateInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.addDogButton = page.getByRole("link", { name: /dodaj psa|add dog/i });
    this.dogNameInput = page.getByLabel(/imię|name/i);
    this.dogWeightInput = page.getByLabel(/waga|weight/i);
    this.dogBirthDateInput = page.getByLabel(/data urodzenia|birth.*date/i);
    this.submitButton = page.locator('form').getByRole("button", { name: /zapisz|save|dodaj/i });
  }

  async goto() {
    await this.page.goto("/dogs");
  }

  async clickAddDog() {
    await this.addDogButton.click();
  }

  async addDog(name: string, weight: number, birthDate: string) {
    await this.dogNameInput.fill(name);
    await this.dogWeightInput.fill(weight.toString());
    await this.dogBirthDateInput.fill(birthDate);
    await this.submitButton.click();
  }

  async hasDog(name: string): Promise<boolean> {
    return await this.page.getByText(name).isVisible();
  }
}

