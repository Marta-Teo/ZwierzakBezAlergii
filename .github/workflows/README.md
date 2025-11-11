# GitHub Actions Workflows

## Konfiguracja CI/CD dla testów

### Szybki start

1. **Zmień nazwę pliku:**
   ```bash
   mv test.yml.example test.yml
   ```

2. **Dodaj sekrety w GitHub** (jeśli potrzebne):
   - Przejdź do Settings → Secrets and variables → Actions
   - Dodaj zmienne:
     - `SUPABASE_URL`
     - `SUPABASE_ANON_KEY`
     - inne zmienne środowiskowe potrzebne do testów

3. **Commit i push:**
   ```bash
   git add .github/workflows/test.yml
   git commit -m "Add CI/CD workflow for tests"
   git push
   ```

4. **Sprawdź zakładkę Actions** w repozytorium GitHub

### Co robi workflow?

Workflow `test.yml` uruchamia się automatycznie przy:
- Każdym push na branchu `main`, `master` lub `develop`
- Każdym pull requeście do tych branchy

### Jobs w workflow

#### 1. `test-unit` - Testy jednostkowe
- Instaluje zależności
- Uruchamia testy Vitest
- Generuje raport coverage
- (Opcjonalnie) Upload coverage do Codecov

#### 2. `test-e2e` - Testy E2E
- Instaluje zależności
- Instaluje przeglądarkę Chromium
- Uruchamia testy Playwright
- Upload raportów i traces w przypadku błędów

#### 3. `lint` - Linting
- Sprawdza kod pod kątem błędów ESLint

#### 4. `build` - Build projektu
- Sprawdza czy projekt się buduje poprawnie

### Konfiguracja

#### Zmienne środowiskowe

W pliku `test.yml` możesz dodać zmienne środowiskowe:

```yaml
env:
  PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
  PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
  NODE_ENV: test
```

#### Branch protection rules

Zalecane ustawienia w GitHub:
1. Settings → Branches → Add rule
2. Branch name pattern: `main` (lub `master`)
3. Zaznacz:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
4. Wybierz checks:
   - ✅ test-unit
   - ✅ test-e2e
   - ✅ lint
   - ✅ build

### Opcjonalne integracje

#### Codecov (coverage reports)

1. Zarejestruj się na [codecov.io](https://codecov.io)
2. Dodaj repozytorium
3. Dodaj badge do README:
   ```markdown
   [![codecov](https://codecov.io/gh/USERNAME/REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/USERNAME/REPO)
   ```

#### Playwright Report Hosting

Raporty Playwright są automatycznie uploadowane jako artifacts.
Możesz je pobrać z zakładki Actions → Konkretny run → Artifacts.

Opcjonalnie możesz hostować raporty używając:
- [Playwright Report Action](https://github.com/marketplace/actions/publish-playwright-report)
- GitHub Pages
- Netlify/Vercel

### Debugowanie

#### Sprawdź logi

Przejdź do Actions → wybierz run → wybierz job → zobacz logi

#### Uruchom lokalnie

GitHub Actions można uruchamiać lokalnie używając [act](https://github.com/nektos/act):

```bash
# Instalacja act
choco install act  # Windows
brew install act   # macOS

# Uruchom workflow
act -j test-unit
act -j test-e2e
```

### Przykłady użycia

#### Testuj tylko na określonych plikach

```yaml
on:
  push:
    paths:
      - 'src/**'
      - 'test/**'
      - 'e2e/**'
```

#### Parallelize tests

```yaml
test-unit:
  strategy:
    matrix:
      node-version: [18, 20]
  steps:
    # ... your steps
```

#### Cache dependencies

```yaml
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### Przydatne linki

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright CI Guide](https://playwright.dev/docs/ci)
- [Vitest CI Guide](https://vitest.dev/guide/cli.html#ci)

