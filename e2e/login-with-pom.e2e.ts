import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/login.page";

/**
 * Przykład testów E2E używających Page Object Model
 *
 * Ten wzorzec jest szczególnie przydatny gdy:
 * - Masz wiele testów dla tej samej strony
 * - Struktura strony się zmienia (aktualizujesz tylko POM)
 * - Chcesz reużywać logikę między testami
 */

test.describe("Login z Page Object Model", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("powinien wyświetlić formularz logowania", async () => {
    // Dzięki POM test jest bardzo czytelny
    expect(await loginPage.isFormVisible()).toBeTruthy();
  });

  // Skip - wymaga prawdziwego użytkownika w bazie
  test.skip("powinien zalogować użytkownika poprawnie", async ({ page }) => {
    // Cała logika logowania jest w jednej metodzie
    await loginPage.login("test@example.com", "password123");

    // Sprawdź czy przekierowano
    await expect(page).toHaveURL(/\/dashboard|\/foods/);
  });

  // Skip - wymaga skonfigurowanej walidacji błędów
  test.skip("powinien wyświetlić błąd przy błędnych danych", async () => {
    await loginPage.login("wrong@email.com", "wrongpassword");

    // Sprawdź czy jest komunikat o błędzie
    const errorText = await loginPage.getErrorText();
    expect(errorText).toBeTruthy();
    expect(errorText).toMatch(/błąd|error|invalid|nieprawidłowy/i);
  });

  test("powinien walidować puste pola", async () => {
    // Kliknij submit bez wypełniania pól
    await loginPage.submit();

    // Przeglądarki HTML5 validation lub nasza własna walidacja
    const isStillOnLoginPage = await loginPage.isFormVisible();
    expect(isStillOnLoginPage).toBeTruthy();
  });

  test("powinien umożliwić wypełnienie formularza krok po kroku", async () => {
    // Możemy też używać pojedynczych metod
    await loginPage.emailInput.fill("test@example.com");
    await expect(loginPage.emailInput).toHaveValue("test@example.com");

    await loginPage.passwordInput.fill("password123");
    await expect(loginPage.passwordInput).toHaveValue("password123");

    await loginPage.submitButton.click();
  });
});

/**
 * Zalety Page Object Model:
 *
 * 1. DRY (Don't Repeat Yourself) - selektory w jednym miejscu
 * 2. Łatwość utrzymania - zmiana w UI = zmiana w jednym pliku
 * 3. Czytelność - testy czytają się jak naturalne zdania
 * 4. Reużywalność - te same metody w wielu testach
 * 5. Testowanie jednostkowe - możesz testować sam POM
 */
