import { defineConfig, devices } from "@playwright/test";

/**
 * Konfiguracja Playwright dla testów E2E
 * Używamy tylko Chromium/Desktop Chrome zgodnie z wytycznymi
 */
export default defineConfig({
  // Katalog z testami E2E
  testDir: "./e2e",

  // Pełna ścieżka do plików testowych
  testMatch: "**/*.e2e.{ts,tsx}",

  // Maksymalny czas trwania testu
  timeout: 30 * 1000,

  // Expect timeout
  expect: {
    timeout: 5000,
  },

  // Uruchom testy równolegle
  fullyParallel: true,

  // Nie przerywaj na pierwszym błędzie w CI
  forbidOnly: !!process.env.CI,

  // Retry tylko w CI
  retries: process.env.CI ? 2 : 0,

  // Liczba workerów
  workers: process.env.CI ? 1 : undefined,

  // Reporter
  reporter: [["html", { outputFolder: "playwright-report" }], ["list"]],

  // Współdzielone ustawienia dla wszystkich projektów
  use: {
    // URL bazowy dla testów
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:4321",

    // Zbieraj trace podczas pierwszego retry
    trace: "on-first-retry",

    // Screenshot przy błędzie
    screenshot: "only-on-failure",

    // Video przy błędzie
    video: "retain-on-failure",
  },

  // Konfiguracja projektów - używamy tylko Chromium
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Dodatkowe ustawienia
        viewport: { width: 1280, height: 720 },
      },
    },
  ],

  // Automatyczne uruchomienie serwera deweloperskiego
  webServer: {
    command: "npm run dev",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
