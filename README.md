# ZwierzakBezAlergii

## Table of Contents
1. [Description](#description)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Available Scripts](#available-scripts)
5. [Project Scope](#project-scope)
6. [Project Status](#project-status)
7. [License](#license)

## Description
ZwierzakBezAlergii (MVP) is a central database of dry dog foods available in Poland, allowing users to filter products by composition and allergens, and providing a compendium of knowledge about dog nutrition and allergies.

## Tech Stack
- **Frontend**: Astro 5, React 19, TypeScript 5, Tailwind CSS 4, Shadcn/ui
- **Backend**: Supabase (PostgreSQL, Authentication, SDK)
- **AI Integration**: Openrouter.ai
- **CI/CD**: GitHub Actions
- **Hosting**: Cloudflare Pages

## Getting Started
### Prerequisites
- Node.js v22.14.0 (as specified in `.nvmrc`)
- npm (bundled with Node.js)
- Supabase account and project
- Environment variables (create a `.env` file in project root):
  - `SUPABASE_URL=<your-supabase-url>`
  - `SUPABASE_ANON_KEY=<your-supabase-anon-key>`

### Local Setup
```bash
# Clone the repository
git clone https://github.com/Marta-Teo/ZwierzakBezAlergii.git
cd ZwierzakBezAlergii

# Switch to the correct Node.js version
nvm use

# Install dependencies
npm install

# Create .env file in root with your Supabase credentials
SUPABASE_URL=
SUPABASE_KEY=

# Start development server
npm run dev
```

## Available Scripts
```bash
# Development
npm run dev          # Start Astro development server
npm run build        # Build the application for production
npm run preview      # Preview the production build locally
npm run astro        # Run Astro CLI commands

# Code Quality
npm run lint         # Run ESLint to lint code
npm run lint:fix     # Run ESLint and automatically fix issues
npm run format       # Format code with Prettier

# Testing
npm run test         # Run unit tests (Vitest)
npm run test:watch   # Run unit tests in watch mode
npm run test:ui      # Open Vitest UI
npm run test:coverage # Generate code coverage report
npm run test:e2e     # Run E2E tests (Playwright)
npm run test:e2e:ui  # Open Playwright UI (interactive mode)
npm run test:e2e:debug # Debug E2E tests step-by-step

# Database
npm run db:export    # Export database to supabase/seed.sql (seed data)

# Backup & Restore (nowe!)
.\scripts\backup-database.ps1                      # Backup bazy (z użytkownikami)
.\scripts\restore-database.ps1                     # Przywróć backup
# Dostęp do bazy: http://localhost:54323 (Supabase Studio)

# Food updates
npm run food:update  # Update food composition with detailed ingredients
```

### Testing
See **[TESTING.md](TESTING.md)** for complete testing guide including:
- ⭐ **User Journey tests** - testy z perspektywy użytkownika
- Unit tests with Vitest
- E2E tests with Playwright
- Example tests and best practices
- CI/CD integration

**Wymaganie spełnione:** ✅ [WYMAGANIE-SPELNIONE.md](WYMAGANIE-SPELNIONE.md)

Quick start:
```bash
npm run test:watch              # Unit tests in watch mode
npm run test:e2e:ui             # E2E tests with interactive UI
npx playwright test user-journey.e2e.ts  # User journey tests
```

### Database Management
- **🆕 Lokalna vs Produkcyjna baza**: [docs/local-vs-production.md](docs/local-vs-production.md) - **Zacznij tutaj!**
- **Backup i przywracanie bazy**: [docs/backup-restore-guide.md](docs/backup-restore-guide.md)
- **Checklist wdrożenia**: [docs/deployment-checklist.md](docs/deployment-checklist.md)
- **Export database**: [docs/database-export.md](docs/database-export.md)
- **Update food compositions**: [docs/aktualizacja-skladow-karm.md](docs/aktualizacja-skladow-karm.md)

### Deployment
- **🚀 Cloudflare Pages - Pełny przewodnik**: [docs/cloudflare-deployment.md](docs/cloudflare-deployment.md)
- **⚡ Cloudflare Pages - Szybki checklist**: [docs/cloudflare-quick-checklist.md](docs/cloudflare-quick-checklist.md)

## API Endpoints

### Foods (Karmy) - CRUD
- `GET /api/foods` - Lista karm z filtrowaniem, wyszukiwaniem i paginacją
- `POST /api/foods` - Tworzenie nowej karmy
- `GET /api/foods/:id` - Szczegóły karmy ze składnikami i alergenami
- `PUT /api/foods/:id` - Aktualizacja karmy
- `DELETE /api/foods/:id` - Usunięcie karmy

### Brands (Marki) - CRUD
- `GET /api/brands` - Lista marek karm
- `POST /api/brands` - Tworzenie nowej marki
- `PUT /api/brands/:id` - Aktualizacja marki
- `DELETE /api/brands/:id` - Usunięcie marki (tylko jeśli nie ma karm)

### Static Resources (Read-only)
- `GET /api/size_types` - Lista rozmiarów granulatu
- `GET /api/age_categories` - Lista kategorii wieku psa
- `GET /api/ingredients` - Lista składników (z wyszukiwaniem i paginacją)
- `GET /api/allergens` - Lista alergenów (struktura hierarchiczna)

### Manual API Testing
Pliki `.http` do ręcznego testowania API:
- `test-brands.http` - Testy dla CRUD /api/brands
- `test-get-foods.http` - Testy dla GET /api/foods
- `test-post-foods.http` - Testy dla POST /api/foods
- `test-foods-id.http` - Testy dla GET/PUT/DELETE /api/foods/:id
- `test-readonly-endpoints.http` - Testy dla zasobów read-only

## Project Scope
### In-Scope (MVP)
- User registration & login (email/password) via Supabase Auth
- Role-based access control:
  - **user**: browse and filter products
  - **admin**: manage foods and articles
- Browse and filter dry dog foods by:
  - Brand
  - Kibble size
  - Dog age group (junior, adult, senior)
  - Ingredients and allergens
- Educational articles section on dog nutrition and allergies
- Filtering logic to exclude products containing selected allergens
- Comprehensive testing environment:
  - Unit tests with Vitest
  - E2E tests with Playwright
  - Test coverage reporting
- CI/CD pipeline using GitHub Actions
- Automated Supabase database backups

### Out-of-Scope
- Third-party store integrations or web scraping
- AI chatbots or recommendation engines
- Newsletters or email marketing
- User comments or ratings functionality
- Analytics dashboards or reports

## Project Status
This project is currently in active development as an MVP.

<!-- Add real CI badge URL once workflow is configured -->
![CI](https://img.shields.io/github/actions/workflow/status/<GitHubUsername>/ZwierzakBezAlergii/ci.yml?branch=master)

## License
This project is currently unlicensed. Please add a `LICENSE` file to specify the license of your choice.

##Final URL under which project will be visible and usable for users- www.zwierzakbezalergii.pl