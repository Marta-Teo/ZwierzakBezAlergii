# Specyfikacja Techniczna Modułu Autentykacji
## ZwierzakBezAlergii - System Rejestracji, Logowania i Odzyskiwania Hasła

**Wersja:** 1.0  
**Data:** 2025-01-02  
**Autor:** AI Development Team  
**Status:** Draft - Do zatwierdzenia

---

## Spis treści

1. [Wprowadzenie](#1-wprowadzenie)
2. [Architektura Interfejsu Użytkownika](#2-architektura-interfejsu-użytkownika)
3. [Logika Backendowa](#3-logika-backendowa)
4. [System Autentykacji](#4-system-autentykacji)
5. [Bezpieczeństwo](#5-bezpieczeństwo)
6. [Diagramy i Przepływy](#6-diagramy-i-przepływy)
7. [Checklist Implementacji](#7-checklist-implementacji)

---

## 1. Wprowadzenie

### 1.1. Cel dokumentu

Dokument określa szczegółową architekturę techniczną modułu autentykacji dla aplikacji ZwierzakBezAlergii, obejmującą:
- Rejestrację nowych użytkowników (email + hasło)
- Logowanie istniejących użytkowników
- Wylogowanie
- Odzyskiwanie hasła (reset przez email)
- Zarządzanie sesją użytkownika
- Ochronę chronionych zasobów

**Dokumenty referencyjne:**
- `prd.md` (sekcje 6-7) - Wymagania biznesowe modułu autentykacji
- `faza_pierwsza_autentykacja.md` - Szczegółowy plan Fazy 1
- `tech_stack.md` - Stack technologiczny projektu

**Uwaga:** Sekcje 1-5 w `prd.md` zawierają przestarzałe informacje o stacku (Next.js + FastAPI). Aktualny stack to Astro + Supabase, zgodnie z niniejszym dokumentem.

### 1.2. Zakres funkcjonalny

**W zakresie MVP (Faza 1):**
- ✅ Rejestracja z email + hasło (bez zewnętrznych providerów)
- ✅ Logowanie z persystencją sesji
- ✅ Wylogowanie
- ✅ Reset hasła przez email
- ✅ Walidacja danych wejściowych (client + server)
- ✅ Zabezpieczenie chronionych stron (middleware)
- ✅ UI feedback (błędy, loading states, sukces)
- ✅ Responsive design (mobile-first)

**Poza zakresem MVP:**
- ❌ Logowanie przez Google/GitHub/Facebook
- ❌ Uwierzytelnianie dwuskładnikowe (2FA)
- ❌ Sesje na wielu urządzeniach (session management)
- ❌ Polityka wygasania sesji

**Polityka weryfikacji email:**
- ✅ **Domyślnie WYŁĄCZONA** - instant onboarding (użytkownik może od razu korzystać z konta)
- 🔧 Opcjonalnie można włączyć w konfiguracji Supabase (zalecane dla przyszłych etapów)

### 1.3. Stack technologiczny

**Frontend:**
- Astro 5 (SSR mode: `output: "server"`)
- React 19 (komponenty interaktywne)
- TypeScript 5
- Tailwind CSS 4
- Shadcn/ui (komponenty UI)

**Backend:**
- Supabase Auth (autentykacja)
- Supabase PostgreSQL (baza danych)
- Supabase JavaScript Client (`@supabase/supabase-js`)
- Astro API Routes (endpoints)

**Hosting:**
- Node.js standalone adapter
- DigitalOcean (Docker)

### 1.4. Założenia projektowe

1. **Aplikacja działa w trybie SSR** - wszystkie strony renderowane są server-side
2. **Minimalizacja JavaScript** - React tylko tam, gdzie niezbędny (formularze, dropdown)
3. **Graceful degradation** - użytkownik może przeglądać bez logowania
4. **Security-first** - RLS policies, HTTPS, CSRF protection
5. **UX-first** - jasne komunikaty, loading states, walidacja inline
6. **Accessibility** - WCAG 2.1 Level AA compliance

---

## 2. Architektura Interfejsu Użytkownika

### 2.1. Struktura stron i komponentów

#### 2.1.1. Nowe strony Astro (SSR)

**A. `/src/pages/login.astro`**

**Cel:** Strona logowania dla istniejących użytkowników.

**Odpowiedzialność:**
- Renderowanie layoutu strony (SSR)
- Sprawdzenie, czy użytkownik jest już zalogowany (redirect do `/foods`)
- Obsługa query param `?redirect` (powrót do poprzedniej strony)
- Embedowanie komponentu React `<LoginForm>`

**Struktura:**
```typescript
---
import Layout from '../layouts/Layout.astro';
import { LoginForm } from '../components/auth/LoginForm';

// Sprawdzenie sesji - jeśli zalogowany, redirect
const session = await Astro.locals.supabase.auth.getSession();
if (session.data.session) {
  return Astro.redirect('/foods');
}

// Pobranie redirect URL z query params
const redirectTo = Astro.url.searchParams.get('redirect') || '/foods';
---

<Layout title="Zaloguj się - ZwierzakBezAlergii">
  <div class="min-h-screen flex items-center justify-center bg-muted/30 px-4">
    <LoginForm client:load redirectTo={redirectTo} />
  </div>
</Layout>
```

**Warunki renderowania:**
- Jeśli użytkownik zalogowany → redirect do `/foods`
- Jeśli niezalogowany → renderuj formularz

---

**B. `/src/pages/register.astro`**

**Cel:** Strona rejestracji nowych użytkowników.

**Odpowiedzialność:**
- Renderowanie layoutu strony (SSR)
- Sprawdzenie, czy użytkownik jest już zalogowany (redirect)
- Embedowanie komponentu React `<RegisterForm>`

**Struktura:**
```typescript
---
import Layout from '../layouts/Layout.astro';
import { RegisterForm } from '../components/auth/RegisterForm';

// Sprawdzenie sesji
const session = await Astro.locals.supabase.auth.getSession();
if (session.data.session) {
  return Astro.redirect('/foods');
}

const redirectTo = Astro.url.searchParams.get('redirect') || '/foods';
---

<Layout title="Zarejestruj się - ZwierzakBezAlergii">
  <div class="min-h-screen flex items-center justify-center bg-muted/30 px-4">
    <RegisterForm client:load redirectTo={redirectTo} />
  </div>
</Layout>
```

---

**C. `/src/pages/reset-password.astro`**

**Cel:** Strona żądania resetu hasła (wysłanie linku na email).

**Odpowiedzialność:**
- Renderowanie layoutu strony (SSR)
- Embedowanie komponentu React `<ResetPasswordForm>`

**Struktura:**
```typescript
---
import Layout from '../layouts/Layout.astro';
import { ResetPasswordForm } from '../components/auth/ResetPasswordForm';
---

<Layout title="Resetuj hasło - ZwierzakBezAlergii">
  <div class="min-h-screen flex items-center justify-center bg-muted/30 px-4">
    <ResetPasswordForm client:load />
  </div>
</Layout>
```

**Uwaga:** Supabase Auth wysyła email z linkiem do zmiany hasła. Użytkownik zostanie przekierowany do callback URL (konfiguracja w Supabase Dashboard).

---

**D. `/src/pages/update-password.astro`**

**Cel:** Strona ustawiania nowego hasła (po kliknięciu linku z emaila).

**Odpowiedzialność:**
- Renderowanie layoutu strony (SSR)
- Weryfikacja tokenu z URL (Supabase obsługuje automatycznie)
- Embedowanie komponentu React `<UpdatePasswordForm>`

**Struktura:**
```typescript
---
import Layout from '../layouts/Layout.astro';
import { UpdatePasswordForm } from '../components/auth/UpdatePasswordForm';

// Token jest w URL hash (#access_token=...) - Supabase JS SDK go obsługuje
---

<Layout title="Ustaw nowe hasło - ZwierzakBezAlergii">
  <div class="min-h-screen flex items-center justify-center bg-muted/30 px-4">
    <UpdatePasswordForm client:load />
  </div>
</Layout>
```

---

#### 2.1.2. Modyfikacje istniejących stron

**A. `/src/layouts/Layout.astro`**

**Cel:** Dodanie nawigacji z przyciskami autentykacji.

**Zmiany:**
- Dodanie komponentu `<Header>` z przyciskami auth
- Sprawdzenie sesji użytkownika (SSR)
- Przekazanie stanu zalogowania do komponentu React

**Nowa struktura:**
```typescript
---
import "../styles/global.css";
import { Header } from "../components/layout/Header";

interface Props {
  title?: string;
  description?: string;
}

const { 
  title = "ZwierzakBezAlergii - Karmy dla psów z alergiami",
  description = "..."
} = Astro.props;

// Pobranie sesji użytkownika (SSR)
const { data: { session } } = await Astro.locals.supabase.auth.getSession();
const user = session?.user ?? null;

// Pobranie user_metadata z tabeli public.users (jeśli potrzebne)
let userRole = 'user';
if (user) {
  const { data: userData } = await Astro.locals.supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  userRole = userData?.role || 'user';
}
---

<!doctype html>
<html lang="pl">
  <head>
    <!-- Pozostaje bez zmian -->
  </head>
  <body>
    <Header client:load user={user} userRole={userRole} />
    <slot />
  </body>
</html>
```

**Uwagi:**
- Header jest komponentem React (interaktywny dropdown)
- User object jest serializowany i przekazany jako prop
- SSR sprawdza sesję przy każdym renderowaniu strony

---

**B. `/src/pages/foods.astro`**

**Cel:** Dodanie baneru zachęcającego do rejestracji (dla niezalogowanych).

**Zmiany:**
- Sprawdzenie sesji (SSR)
- Przekazanie stanu zalogowania do `<FoodsPage>`
- Baner wyświetlany warunkowo

**Modyfikacja:**
```typescript
---
import Layout from '../layouts/Layout.astro';
import { FoodsPage } from '../components/FoodsPage';

// Sprawdzenie sesji
const { data: { session } } = await Astro.locals.supabase.auth.getSession();
const isLoggedIn = !!session;
---

<Layout title="Karmy dla psów - ZwierzakBezAlergii">
  <FoodsPage client:load isLoggedIn={isLoggedIn} />
</Layout>
```

**W komponencie `<FoodsPage>`:**
- Dodanie warunkowego baneru dla `!isLoggedIn`
- Baner można zamknąć (stan w localStorage)

---

**C. `/src/pages/asystent.astro`**

**Cel:** Dodanie promptu zachęcającego do rejestracji (po 2-3 wiadomościach).

**Zmiany:**
- Przekazanie stanu zalogowania do `<PetFoodAssistant>`
- Prompt wyświetlany warunkowo

**Modyfikacja:**
```typescript
---
import Layout from '../layouts/Layout.astro';
import { PetFoodAssistant } from '../components/PetFoodAssistant';

const { data: { session } } = await Astro.locals.supabase.auth.getSession();
const isLoggedIn = !!session;
---

<Layout title="Asystent AI - ZwierzakBezAlergii">
  <main class="container mx-auto px-4 py-8">
    <PetFoodAssistant client:load isLoggedIn={isLoggedIn} />
  </main>
</Layout>
```

---

#### 2.1.3. Nowe komponenty React

**A. `/src/components/auth/LoginForm.tsx`**

**Cel:** Formularz logowania (email + hasło).

**Odpowiedzialność:**
- Walidacja danych wejściowych (client-side)
- Obsługa submit (wywołanie Supabase Auth)
- Wyświetlanie błędów i loading state
- Przekierowanie po sukcesie

**Interfejs:**
```typescript
interface LoginFormProps {
  redirectTo?: string; // URL do przekierowania po zalogowaniu
}

export function LoginForm({ redirectTo = '/foods' }: LoginFormProps) {
  // ...
}
```

**Stan komponentu:**
```typescript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

**Walidacja (client-side):**
- Email: format email (regex + HTML5 validation)
- Hasło: min. 8 znaków
- Oba pola wymagane

**Obsługa submit:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setIsLoading(true);

  try {
    // Walidacja
    if (!email || !password) {
      throw new Error('Wszystkie pola są wymagane');
    }
    if (password.length < 8) {
      throw new Error('Hasło musi mieć min. 8 znaków');
    }

    // Wywołanie Supabase Auth
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    // Sukces - przekierowanie (full page reload dla SSR)
    window.location.href = redirectTo;
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};
```

**Struktura UI:**
```tsx
<div className="w-full max-w-md mx-auto bg-card rounded-lg shadow-lg p-8">
  {/* Logo/Heading */}
  <h1 className="text-3xl font-bold text-center mb-6">Zaloguj się</h1>
  
  {/* Error Alert */}
  {error && (
    <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded text-destructive">
      {error}
    </div>
  )}
  
  {/* Form */}
  <form onSubmit={handleSubmit} className="space-y-4">
    {/* Email Input */}
    <div>
      <label htmlFor="email" className="block text-sm font-medium mb-1">
        Email
      </label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
        placeholder="twoj@email.pl"
        disabled={isLoading}
      />
    </div>
    
    {/* Password Input */}
    <div>
      <label htmlFor="password" className="block text-sm font-medium mb-1">
        Hasło
      </label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
        placeholder="••••••••"
        disabled={isLoading}
      />
    </div>
    
    {/* Forgot Password Link */}
    <div className="text-right">
      <a href="/reset-password" className="text-sm text-primary hover:underline">
        Zapomniałeś hasła?
      </a>
    </div>
    
    {/* Submit Button */}
    <Button type="submit" disabled={isLoading} className="w-full">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Logowanie...
        </>
      ) : (
        'Zaloguj się'
      )}
    </Button>
  </form>
  
  {/* Register Link */}
  <div className="mt-6 text-center text-sm">
    Nie masz konta?{' '}
    <a href="/register" className="text-primary hover:underline font-medium">
      Zarejestruj się
    </a>
  </div>
</div>
```

**Komunikaty błędów (mapowanie Supabase → user-friendly):**
```typescript
const getErrorMessage = (error: any): string => {
  const code = error.code || error.message;
  
  const errorMessages: Record<string, string> = {
    'invalid_credentials': 'Nieprawidłowy email lub hasło',
    'email_not_confirmed': 'Email nie został zweryfikowany. Sprawdź swoją skrzynkę pocztową.',
    'user_not_found': 'Nie znaleziono użytkownika z tym emailem',
    'too_many_requests': 'Zbyt wiele prób logowania. Spróbuj ponownie za chwilę.',
  };
  
  return errorMessages[code] || 'Wystąpił błąd podczas logowania. Spróbuj ponownie.';
};
```

---

**B. `/src/components/auth/RegisterForm.tsx`**

**Cel:** Formularz rejestracji (email + hasło + potwierdzenie hasła).

**Odpowiedzialność:**
- Walidacja danych wejściowych (client-side)
- Sprawdzenie siły hasła
- Sprawdzenie zgodności haseł
- Obsługa submit (wywołanie Supabase Auth + utworzenie rekordu w public.users)
- Wyświetlanie błędów i loading state

**Interfejs:**
```typescript
interface RegisterFormProps {
  redirectTo?: string;
}
```

**Stan komponentu:**
```typescript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState(false);
```

**Walidacja (client-side):**
- Email: format email
- Hasło: min. 8 znaków, zawiera literę i cyfrę (regex)
- Potwierdzenie hasła: identyczne z hasłem
- Wszystkie pola wymagane

**Wskaźnik siły hasła:**
```typescript
const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (password.length < 8) return 'weak';
  if (password.length < 12) return 'medium';
  if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
    return 'strong';
  }
  return 'medium';
};
```

**Obsługa submit:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setIsLoading(true);

  try {
    // Walidacja
    if (!email || !password || !confirmPassword) {
      throw new Error('Wszystkie pola są wymagane');
    }
    if (password.length < 8) {
      throw new Error('Hasło musi mieć min. 8 znaków');
    }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      throw new Error('Hasło musi zawierać literę i cyfrę');
    }
    if (password !== confirmPassword) {
      throw new Error('Hasła nie są identyczne');
    }

    // Rejestracja w Supabase Auth
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // Sukces - utworzenie rekordu w public.users odbywa się automatycznie przez trigger
    // lub trzeba wywołać endpoint API
    
    setSuccess(true);
    
    // Opcjonalnie: Jeśli email verification jest wyłączona, od razu zaloguj
    if (data.session) {
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 2000);
    }
  } catch (err) {
    setError(getErrorMessage(err));
  } finally {
    setIsLoading(false);
  }
};
```

**Struktura UI:**
```tsx
{success ? (
  <div className="text-center">
    <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
    <h2 className="text-2xl font-bold mb-2">Rejestracja udana!</h2>
    <p className="text-muted-foreground mb-4">
      {data.session 
        ? 'Za chwilę zostaniesz przekierowany...' 
        : 'Sprawdź swoją skrzynkę pocztową i zweryfikuj email.'}
    </p>
  </div>
) : (
  <form onSubmit={handleSubmit}>
    {/* Similar structure to LoginForm */}
    
    {/* Password Strength Indicator */}
    {password && (
      <div className="mt-2">
        <div className="flex gap-1">
          <div className={`h-1 flex-1 rounded ${strength === 'weak' ? 'bg-red-500' : 'bg-gray-200'}`} />
          <div className={`h-1 flex-1 rounded ${strength === 'medium' ? 'bg-yellow-500' : strength === 'strong' ? 'bg-green-500' : 'bg-gray-200'}`} />
          <div className={`h-1 flex-1 rounded ${strength === 'strong' ? 'bg-green-500' : 'bg-gray-200'}`} />
        </div>
        <p className="text-xs mt-1 text-muted-foreground">
          Siła hasła: {strength === 'weak' && 'Słabe'}
          {strength === 'medium' && 'Średnie'}
          {strength === 'strong' && 'Silne'}
        </p>
      </div>
    )}
  </form>
)}
```

---

**C. `/src/components/auth/ResetPasswordForm.tsx`**

**Cel:** Formularz żądania resetu hasła (wysłanie linku na email).

**Odpowiedzialność:**
- Walidacja email
- Obsługa submit (wywołanie Supabase Auth)
- Wyświetlanie sukcesu/błędów

**Stan komponentu:**
```typescript
const [email, setEmail] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState(false);
```

**Obsługa submit:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setIsLoading(true);

  try {
    if (!email) throw new Error('Email jest wymagany');

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (resetError) throw resetError;

    setSuccess(true);
  } catch (err) {
    setError(getErrorMessage(err));
  } finally {
    setIsLoading(false);
  }
};
```

**Struktura UI:**
```tsx
{success ? (
  <div className="text-center">
    <Mail className="mx-auto h-12 w-12 text-primary mb-4" />
    <h2 className="text-2xl font-bold mb-2">Sprawdź swoją skrzynkę</h2>
    <p className="text-muted-foreground mb-4">
      Wysłaliśmy link do resetowania hasła na adres <strong>{email}</strong>.
    </p>
    <p className="text-sm text-muted-foreground">
      Nie otrzymałeś emaila? Sprawdź folder spam lub{' '}
      <button onClick={() => setSuccess(false)} className="text-primary hover:underline">
        wyślij ponownie
      </button>
    </p>
  </div>
) : (
  <form onSubmit={handleSubmit}>
    {/* Email input + Submit */}
  </form>
)}
```

---

**D. `/src/components/auth/UpdatePasswordForm.tsx`**

**Cel:** Formularz ustawiania nowego hasła (po kliknięciu linku z emaila).

**Odpowiedzialność:**
- Walidacja nowego hasła
- Obsługa submit (wywołanie Supabase Auth)
- Wyświetlanie sukcesu/błędów

**Stan komponentu:**
```typescript
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState(false);
```

**Obsługa submit:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setIsLoading(true);

  try {
    if (!password || !confirmPassword) throw new Error('Wszystkie pola są wymagane');
    if (password.length < 8) throw new Error('Hasło musi mieć min. 8 znaków');
    if (password !== confirmPassword) throw new Error('Hasła nie są identyczne');

    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) throw updateError;

    setSuccess(true);
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  } catch (err) {
    setError(getErrorMessage(err));
  } finally {
    setIsLoading(false);
  }
};
```

---

**E. `/src/components/layout/Header.tsx`**

**Cel:** Nagłówek aplikacji z nawigacją i przyciskami autentykacji.

**Odpowiedzialność:**
- Wyświetlanie logo i nawigacji
- Wyświetlanie przycisków "Zaloguj się" / "Zarejestruj się" (niezalogowany)
- Wyświetlanie dropdown menu z avatarem (zalogowany)
- Obsługa wylogowania

**Interfejs:**
```typescript
interface HeaderProps {
  user: {
    id: string;
    email: string;
    user_metadata?: Record<string, any>;
  } | null;
  userRole?: 'user' | 'admin';
}
```

**Stan komponentu:**
```typescript
const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const [isLoggingOut, setIsLoggingOut] = useState(false);
```

**Obsługa wylogowania:**
```typescript
const handleLogout = async () => {
  setIsLoggingOut(true);
  try {
    await supabase.auth.signOut();
    window.location.href = '/';
  } catch (err) {
    console.error('Logout error:', err);
    setIsLoggingOut(false);
  }
};
```

**Struktura UI:**
```tsx
<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="container mx-auto flex h-16 items-center justify-between px-4">
    {/* Logo */}
    <a href="/" className="flex items-center space-x-2">
      <span className="text-2xl">🐕</span>
      <span className="font-bold text-xl">ZwierzakBezAlergii</span>
    </a>
    
    {/* Navigation */}
    <nav className="hidden md:flex items-center space-x-6">
      <a href="/foods" className="text-foreground/80 hover:text-foreground">
        Karmy
      </a>
      <a href="/articles" className="text-foreground/80 hover:text-foreground">
        Artykuły
      </a>
      <a href="/asystent" className="text-foreground/80 hover:text-foreground">
        Asystent AI
      </a>
    </nav>
    
    {/* Auth Buttons */}
    <div className="flex items-center gap-3">
      {user ? (
        <UserMenu user={user} userRole={userRole} onLogout={handleLogout} isLoading={isLoggingOut} />
      ) : (
        <>
          <a href="/login">
            <Button variant="ghost">Zaloguj się</Button>
          </a>
          <a href="/register">
            <Button>Zarejestruj się</Button>
          </a>
        </>
      )}
    </div>
  </div>
</header>
```

---

**F. `/src/components/layout/UserMenu.tsx`**

**Cel:** Dropdown menu dla zalogowanego użytkownika.

**Odpowiedzialność:**
- Wyświetlanie avatara (inicjały z email)
- Dropdown z linkami: Moje psy, Ulubione, Historia
- Przycisk wylogowania

**Interfejs:**
```typescript
interface UserMenuProps {
  user: {
    email: string;
  };
  userRole?: 'user' | 'admin';
  onLogout: () => void;
  isLoading: boolean;
}
```

**Struktura UI (używając Shadcn DropdownMenu):**
```tsx
<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
      <Avatar>
        <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
      </Avatar>
    </Button>
  </DropdownMenuTrigger>
  
  <DropdownMenuContent className="w-56" align="end">
    <DropdownMenuLabel>
      <div className="flex flex-col space-y-1">
        <p className="text-sm font-medium">Moje konto</p>
        <p className="text-xs text-muted-foreground">{user.email}</p>
      </div>
    </DropdownMenuLabel>
    
    <DropdownMenuSeparator />
    
    <DropdownMenuItem asChild>
      <a href="/dogs" className="cursor-pointer">
        <Dog className="mr-2 h-4 w-4" />
        Moje psy
      </a>
    </DropdownMenuItem>
    
    <DropdownMenuItem asChild>
      <a href="/favorites" className="cursor-pointer">
        <Star className="mr-2 h-4 w-4" />
        Ulubione karmy
      </a>
    </DropdownMenuItem>
    
    <DropdownMenuItem asChild>
      <a href="/history" className="cursor-pointer">
        <History className="mr-2 h-4 w-4" />
        Historia
      </a>
    </DropdownMenuItem>
    
    <DropdownMenuSeparator />
    
    <DropdownMenuItem onClick={onLogout} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Wylogowywanie...
        </>
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          Wyloguj
        </>
      )}
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

**G. `/src/components/ui/WelcomeModal.tsx`**

**Cel:** Modal powitalny dla niezalogowanych użytkowników (pierwsza wizyta).

**Odpowiedzialność:**
- Wyświetlanie się raz na sesję (localStorage flag)
- Zachęcanie do rejestracji
- Możliwość zamknięcia i dalszego przeglądania

**Interfejs:**
```typescript
interface WelcomeModalProps {
  // Brak props - zarządza stanem wewnętrznie
}
```

**Logika wyświetlania:**
```typescript
useEffect(() => {
  const hasSeenModal = localStorage.getItem('welcome_modal_seen');
  if (!hasSeenModal) {
    setIsOpen(true);
  }
}, []);

const handleClose = () => {
  localStorage.setItem('welcome_modal_seen', 'true');
  setIsOpen(false);
};
```

**Struktura UI (używając Shadcn Dialog):**
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="sm:max-w-lg">
    <DialogHeader>
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Dog className="h-8 w-8 text-primary" />
      </div>
      <DialogTitle className="text-center text-2xl">
        Witaj w ZwierzakBezAlergii! 🐕
      </DialogTitle>
      <DialogDescription className="text-center text-base">
        Stwórz profil swojego psa i automatycznie filtruj karmy bezpieczne dla niego!
      </DialogDescription>
    </DialogHeader>
    
    <div className="mt-4 space-y-3">
      <a href="/register" className="block">
        <Button className="w-full" size="lg">
          Stwórz konto
        </Button>
      </a>
      <Button variant="outline" className="w-full" onClick={handleClose}>
        Przeglądaj bez konta
      </Button>
    </div>
  </DialogContent>
</Dialog>
```

---

**H. `/src/components/ui/AuthPromptBanner.tsx`**

**Cel:** Baner zachęcający do rejestracji w widoku karm (dla niezalogowanych).

**Odpowiedzialność:**
- Wyświetlanie baneru pod SearchBar
- Możliwość zamknięcia (stan w localStorage)
- Link do rejestracji

**Interfejs:**
```typescript
interface AuthPromptBannerProps {
  // Brak props
}
```

**Logika:**
```typescript
const [isVisible, setIsVisible] = useState(true);

useEffect(() => {
  const isClosed = localStorage.getItem('auth_banner_closed');
  if (isClosed) setIsVisible(false);
}, []);

const handleClose = () => {
  localStorage.setItem('auth_banner_closed', 'true');
  setIsVisible(false);
};
```

**Struktura UI:**
```tsx
{isVisible && (
  <div className="relative mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
    <button
      onClick={handleClose}
      className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
    >
      <X className="h-4 w-4" />
    </button>
    
    <div className="flex items-center gap-3">
      <Lightbulb className="h-6 w-6 text-primary flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium">
          Masz psa z alergią na kurczaka? Zaloguj się i automatycznie ukryj karmy z tym alergenem!
        </p>
      </div>
      <a href="/register">
        <Button size="sm">Stwórz profil psa</Button>
      </a>
    </div>
  </div>
)}
```

---

### 2.2. Podział odpowiedzialności Astro vs React

**Astro (SSR) - odpowiada za:**
1. ✅ Renderowanie struktury strony (HTML, layout)
2. ✅ Sprawdzanie sesji użytkownika (server-side)
3. ✅ Przekierowania (redirect dla zalogowanych na `/login`)
4. ✅ Przekazywanie danych do komponentów React (user, redirectTo)
5. ✅ SEO (meta tags, title, description)

**React (Client-side) - odpowiada za:**
1. ✅ Interaktywność (formularze, dropdown, modal)
2. ✅ Walidacja danych wejściowych (inline validation)
3. ✅ Obsługa stanów (loading, error, success)
4. ✅ Komunikacja z Supabase Auth (signIn, signUp, signOut)
5. ✅ UI feedback (toast notifications, error messages)

**Zasady integracji:**
- Astro renderuje "shell" strony i embeduje komponenty React z `client:load`
- React komponenty komunikują się z Supabase przez JavaScript SDK
- Po sukcesie akcji (login, register) - full page reload (`window.location.href`) dla odświeżenia SSR
- Supabase session jest przechowywana w cookies (automatycznie przez SDK)

---

### 2.3. Walidacja i komunikaty błędów

#### 2.3.1. Walidacja client-side (React)

**Formularz logowania:**
```typescript
const validate = (email: string, password: string): string | null => {
  if (!email) return 'Email jest wymagany';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Nieprawidłowy format email';
  if (!password) return 'Hasło jest wymagane';
  if (password.length < 8) return 'Hasło musi mieć min. 8 znaków';
  return null;
};
```

**Formularz rejestracji:**
```typescript
const validate = (email: string, password: string, confirmPassword: string): string | null => {
  if (!email) return 'Email jest wymagany';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Nieprawidłowy format email';
  if (!password) return 'Hasło jest wymagane';
  if (password.length < 8) return 'Hasło musi mieć min. 8 znaków';
  if (!/[A-Za-z]/.test(password)) return 'Hasło musi zawierać literę';
  if (!/[0-9]/.test(password)) return 'Hasło musi zawierać cyfrę';
  if (!confirmPassword) return 'Potwierdzenie hasła jest wymagane';
  if (password !== confirmPassword) return 'Hasła nie są identyczne';
  return null;
};
```

#### 2.3.2. Komunikaty błędów Supabase Auth

**Mapowanie kodów błędów na user-friendly messages:**
```typescript
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  // Login errors
  'invalid_credentials': 'Nieprawidłowy email lub hasło',
  'email_not_confirmed': 'Email nie został zweryfikowany. Sprawdź swoją skrzynkę pocztową.',
  'user_not_found': 'Nie znaleziono użytkownika z tym emailem',
  'invalid_grant': 'Nieprawidłowy email lub hasło',
  
  // Register errors
  'user_already_exists': 'Użytkownik z tym emailem już istnieje',
  'email_exists': 'Użytkownik z tym emailem już istnieje',
  'weak_password': 'Hasło jest zbyt słabe. Użyj minimum 8 znaków, litery i cyfry.',
  
  // Rate limiting
  'too_many_requests': 'Zbyt wiele prób. Spróbuj ponownie za chwilę.',
  'over_email_send_rate_limit': 'Zbyt wiele wysłanych emaili. Spróbuj ponownie za chwilę.',
  
  // Reset password errors
  'invalid_recovery_token': 'Link resetujący hasło wygasł lub jest nieprawidłowy',
  'same_password': 'Nowe hasło nie może być takie samo jak poprzednie',
  
  // Generic
  'network_error': 'Błąd połączenia. Sprawdź połączenie z internetem.',
  'server_error': 'Błąd serwera. Spróbuj ponownie później.',
};

export const getAuthErrorMessage = (error: any): string => {
  const code = error?.code || error?.message || 'unknown';
  return AUTH_ERROR_MESSAGES[code] || 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.';
};
```

#### 2.3.3. Toast notifications

**Wykorzystanie biblioteki sonner:**
```typescript
import { toast } from 'sonner';

// Success
toast.success('Zalogowano pomyślnie!');

// Error
toast.error('Wystąpił błąd podczas logowania');

// Loading (auto-dismiss po sukcesie)
const toastId = toast.loading('Logowanie...');
// Po sukcesie:
toast.success('Zalogowano pomyślnie!', { id: toastId });
// Po błędzie:
toast.error('Błąd logowania', { id: toastId });
```

---

### 2.4. Obsługa najważniejszych scenariuszy

#### Scenariusz 1: Pierwszy użytkownik (nowy)

**Flow:**
1. Użytkownik odwiedza stronę główną `/`
2. Widzi modal powitalny "Witaj w ZwierzakBezAlergii! 🐕"
3. Klika "Stwórz konto" → redirect `/register`
4. Wypełnia formularz rejestracji
5. Po sukcesie:
   - Jeśli email verification WŁĄCZONA: Widzi komunikat "Sprawdź swoją skrzynkę pocztową"
   - Jeśli email verification WYŁĄCZONA: Automatyczne zalogowanie + redirect `/foods`
6. Widzi baner: "Stwórz profil psa i automatycznie filtruj karmy!"

**Uwagi:**
- Modal można zamknąć i przeglądać bez rejestracji
- Stan modalu zapisany w localStorage (nie pojawi się ponownie w tej sesji)

---

#### Scenariusz 2: Powracający użytkownik (zalogowany)

**Flow:**
1. Użytkownik odwiedza `/login`
2. Astro sprawdza sesję (SSR) → użytkownik już zalogowany
3. Automatyczny redirect do `/foods`
4. Widzi nagłówek z dropdown menu (avatar + email)
5. Może przejść do: Moje psy, Ulubione karmy, Historia

**Uwagi:**
- Sesja jest persystowana w cookies
- Nie ma potrzeby ponownego logowania po zamknięciu przeglądarki

---

#### Scenariusz 3: Zapomnienie hasła

**Flow:**
1. Użytkownik na stronie `/login` klika "Zapomniałeś hasła?"
2. Redirect do `/reset-password`
3. Wprowadza email i klika "Wyślij link"
4. Widzi komunikat sukcesu: "Sprawdź swoją skrzynkę"
5. Otrzymuje email z linkiem (Supabase Auth)
6. Klika link → redirect do `/update-password`
7. Wprowadza nowe hasło (2x)
8. Widzi komunikat sukcesu: "Hasło zostało zmienione"
9. Automatyczny redirect do `/login` po 2s
10. Loguje się nowym hasłem

**Uwagi:**
- Link resetujący wygasa po 1 godzinie (konfiguracja Supabase)
- Można wysłać ponownie (rate limit: 1 email / 60s)

---

#### Scenariusz 4: Próba dostępu do chronionej strony (niezalogowany)

**Flow:**
1. Użytkownik odwiedza `/dogs` (chroniona strona)
2. Middleware sprawdza sesję → brak sesji
3. Automatyczny redirect do `/login?redirect=/dogs`
4. Użytkownik loguje się
5. Po sukcesie → redirect do `/dogs` (oryginalna strona)

**Uwagi:**
- Query param `?redirect` pozwala wrócić do strony, którą użytkownik chciał odwiedzić
- Dotyczy stron: `/dogs`, `/favorites`, `/history`, `/dogs/new`, `/dogs/:id/edit`

---

#### Scenariusz 5: Wylogowanie

**Flow:**
1. Użytkownik klika dropdown menu (avatar w prawym górnym rogu)
2. Klika "Wyloguj"
3. Pojawia się spinner "Wylogowywanie..."
4. Supabase Auth wylogowuje użytkownika (usuwa sesję z cookies)
5. Redirect do `/` (strona główna)
6. Widzi przyciski "Zaloguj się" / "Zarejestruj się"

**Uwagi:**
- Wylogowanie jest natychmiastowe (brak potwierdzenia)
- Sesja jest usuwana po stronie klienta i serwera

---

## 3. Logika Backendowa

### 3.1. Struktura endpointów API

Moduł autentykacji **nie wymaga** dedykowanych API endpoints, ponieważ wykorzystuje **Supabase Auth API** (wbudowane w Supabase).

**Supabase Auth API (używane przez JavaScript SDK):**

```
POST /auth/v1/signup                 # Rejestracja nowego użytkownika
POST /auth/v1/token?grant_type=password  # Logowanie (email + hasło)
POST /auth/v1/logout                 # Wylogowanie
POST /auth/v1/recover                # Reset hasła (wysłanie emaila)
POST /auth/v1/user                   # Aktualizacja profilu (np. nowe hasło)
GET  /auth/v1/user                   # Pobranie danych zalogowanego użytkownika
```

**Uwagi:**
- Wszystkie endpointy są obsługiwane przez Supabase
- Komunikacja odbywa się przez `@supabase/supabase-js` (JavaScript SDK)
- Automatyczna obsługa cookies (sesja)
- Rate limiting wbudowany w Supabase

---

### 3.2. Schemat bazy danych

**Tabela `public.users`** - rozszerzenie danych użytkownika (dodatkowe informacje poza auth.users)

**Status:** ✅ Tabela już istnieje (migracja `20251012173600_initial_schema.sql`)  
**Wymagane zmiany:** Dodanie triggera dla automatycznego tworzenia rekordów przy rejestracji

**Aktualna struktura (z migracji):**
```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS już włączone z następującymi policies:
-- - authenticated i anon mogą czytać wszystkie profile (SELECT)
-- - authenticated mogą tworzyć tylko swój profil (INSERT)
-- - authenticated mogą aktualizować tylko swój profil (UPDATE)
```

**Kolumny:**
- `id` (UUID) - PRIMARY KEY, relacja 1:1 z `auth.users`
- `role` (VARCHAR) - rola użytkownika: 'user' (domyślna) lub 'admin'
- `created_at` (TIMESTAMPTZ) - data utworzenia rekordu
- `updated_at` (TIMESTAMPTZ) - data ostatniej aktualizacji (auto-update przez trigger)

**Relacje:**
- `public.users.id` → `auth.users.id` (1:1, CASCADE DELETE)
- `public.dog_profiles.user_id` → `public.users.id` (1:N, przyszła implementacja)
- `public.favorite_foods.user_id` → `public.users.id` (1:N, przyszła implementacja)

**Uwagi implementacyjne:**
- Tabela istnieje, ale **brak triggera** do automatycznego tworzenia rekordów przy rejestracji
- Trzeba dodać trigger `handle_new_user()` (zobacz sekcja 3.4)
- Alternatywnie: użytkownicy mogą ręcznie tworzyć rekord przy pierwszym logowaniu (komponent React)
- RLS policies są już zdefiniowane i wystarczające dla MVP

---

### 3.3. Middleware Astro

**Cel:** Sprawdzanie sesji użytkownika przy każdym reque ście i udostępnienie `supabase` client przez `context.locals`.

**Plik:** `/src/middleware/index.ts`

**Aktualna implementacja (do rozszerzenia):**
```typescript
import { defineMiddleware } from "astro:middleware";
import { supabaseClient } from "../db/supabase.client.ts";

export const onRequest = defineMiddleware(async (context, next) => {
  // Udostępnienie Supabase client
  context.locals.supabase = supabaseClient;
  
  // Sprawdzenie sesji (opcjonalne - dla chronionych stron)
  const { data: { session } } = await supabaseClient.auth.getSession();
  context.locals.session = session;
  context.locals.user = session?.user ?? null;
  
  // Ochrona chronionych stron
  const protectedRoutes = ['/dogs', '/favorites', '/history'];
  const isProtectedRoute = protectedRoutes.some(route => 
    context.url.pathname.startsWith(route)
  );
  
  if (isProtectedRoute && !session) {
    // Redirect do login z return URL
    const redirectUrl = `/login?redirect=${encodeURIComponent(context.url.pathname)}`;
    return context.redirect(redirectUrl);
  }
  
  return next();
});
```

**Typowanie context.locals:**
```typescript
// src/env.d.ts
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    supabase: import('./db/supabase.client').SupabaseClient;
    session: import('@supabase/supabase-js').Session | null;
    user: import('@supabase/supabase-js').User | null;
  }
}
```

---

### 3.4. Obsługa rejestracji użytkownika

**Flow rejestracji:**
1. Użytkownik wypełnia formularz `/register`
2. React komponent `<RegisterForm>` wywołuje `supabase.auth.signUp()`
3. Supabase Auth:
   - Tworzy rekord w `auth.users` (wbudowana tabela)
   - Wysyła email weryfikacyjny (jeśli włączone)
   - Zwraca sesję (jeśli email verification wyłączona)
4. **Trigger PostgreSQL** automatycznie tworzy rekord w `public.users`:

**Trigger do utworzenia:**
```sql
-- Automatyczne utworzenie rekordu w public.users po rejestracji
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, role, created_at, updated_at)
  VALUES (NEW.id, 'user', NOW(), NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger uruchamiany po INSERT w auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**Alternatywnie (bez triggera):**
Można utworzyć endpoint API `/api/auth/register`, który:
1. Wywołuje `supabase.auth.signUp()`
2. Ręcznie tworzy rekord w `public.users`

**Zalecenie:** Użyć triggera PostgreSQL (czystsze, automatyczne).

---

### 3.5. Walidacja danych wejściowych

**Walidacja client-side (React):**
- Sprawdzenie formatów (email, hasło min. 8 znaków)
- Sprawdzenie zgodności haseł
- Inline feedback (real-time)

**Walidacja server-side (Supabase Auth):**
- Supabase automatycznie waliduje:
  - Format email (RFC 5322)
  - Unikalność email
  - Długość hasła (min. 6 znaków - konfiguracja)
- Zwraca błędy z kodami (np. `email_exists`, `weak_password`)

**Brak potrzeby dodatkowej walidacji server-side** - Supabase Auth obsługuje wszystko.

---

### 3.6. Obsługa wyjątków

**Błędy Supabase Auth:**
```typescript
try {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    // Supabase zwraca obiekt error z kodem
    console.error('Auth error:', error.code, error.message);
    throw error;
  }
  
  // Sukces
  console.log('User logged in:', data.user);
} catch (err) {
  // Obsługa błędów w komponencie React
  setError(getAuthErrorMessage(err));
}
```

**Błędy sieciowe:**
```typescript
try {
  // ...
} catch (err) {
  if (err.message?.includes('network') || !navigator.onLine) {
    setError('Brak połączenia z internetem. Sprawdź połączenie i spróbuj ponownie.');
  } else {
    setError(getAuthErrorMessage(err));
  }
}
```

---

### 3.7. Aktualizacja renderowania SSR

**Strony z dynamicznym contentem (zależne od sesji):**

**Przed:**
```astro
---
import Layout from '../layouts/Layout.astro';
---
<Layout>
  <h1>Karmy dla psów</h1>
</Layout>
```

**Po:**
```astro
---
import Layout from '../layouts/Layout.astro';

// Sprawdzenie sesji (SSR)
const { data: { session } } = await Astro.locals.supabase.auth.getSession();
const user = session?.user ?? null;
---
<Layout>
  {user ? (
    <h1>Witaj, {user.email}!</h1>
  ) : (
    <h1>Karmy dla psów</h1>
  )}
</Layout>
```

**Uwagi:**
- Każda strona, która potrzebuje znać stan zalogowania, musi wywołać `getSession()`
- `Layout.astro` już to robi globalnie (dla Header)
- Inne strony mogą wykorzystać `Astro.locals.user` (ustawione w middleware)

---

## 4. System Autentykacji

### 4.1. Wykorzystanie Supabase Auth

**Architektura Supabase Auth:**
1. **auth.users** (wbudowana tabela PostgreSQL) - dane użytkowników zarządzane przez Supabase
2. **public.users** (nasza tabela) - rozszerzenie danych użytkownika (role, preferencje)
3. **Cookies** - przechowywanie sesji (automatyczne przez SDK)
4. **JWT Tokens** - access_token + refresh_token
5. **Email Provider** - wysyłanie emaili (rejestracja, reset hasła)

**Diagram relacji:**
```
┌─────────────────┐
│   Supabase Auth │
│   (auth.users)  │
└────────┬────────┘
         │ 1:1
         ▼
┌─────────────────┐
│  public.users   │
│  (role, etc.)   │
└─────────────────┘
```

---

### 4.2. Konfiguracja Supabase Auth

**Wymagane ustawienia w Supabase Dashboard:**

1. **Email Provider**:
   - Włącz Email Auth
   - Skonfiguruj SMTP (np. SendGrid, Mailgun) lub użyj wbudowanego Supabase SMTP (limit: 3 emaile/godz. na dev)
   - Szablony emaili:
     - Confirmation (rejestracja) - **NIE używany** (email verification wyłączona)
     - Recovery (reset hasła) - **WYMAGANY** (funkcjonalność "Zapomniałeś hasła?")

2. **Site URL**:
   - Development: `http://localhost:3000`
   - Production: `https://zwierzakbezalergii.pl`

3. **Redirect URLs** (dozwolone callback URLs):
   - `http://localhost:3000/update-password`
   - `https://zwierzakbezalergii.pl/update-password`
   - `http://localhost:3000/auth/callback` (opcjonalnie)

4. **Password Requirements**:
   - Minimum length: 8 znaków
   - Opcjonalnie: wymuszenie silnego hasła (litera + cyfra + znak specjalny)

5. **Email Verification**:
   - **Zalecane dla MVP: WYŁĄCZONA** (instant onboarding)
   - Można włączyć później (opcja: "Enable email confirmations")

6. **Rate Limiting**:
   - Max login attempts: 10 / 5 minut (domyślnie)
   - Max email sends: 1 / 60 sekund (domyślnie)

---

### 4.3. Przepływ autentykacji (sekwencja)

**Logowanie:**
```
[Client React] → supabase.auth.signInWithPassword(email, password)
       ↓
[Supabase Auth API] → Sprawdza auth.users
       ↓
[PostgreSQL] → Zwraca user + session
       ↓
[Supabase SDK] → Zapisuje session w cookies
       ↓
[Client React] → window.location.href = '/foods' (full reload)
       ↓
[Astro SSR] → Odczytuje session z cookies → renderuje Header z user
```

**Rejestracja:**
```
[Client React] → supabase.auth.signUp(email, password)
       ↓
[Supabase Auth API] → Tworzy rekord w auth.users
       ↓
[PostgreSQL Trigger] → Tworzy rekord w public.users (role='user')
       ↓
[Supabase Auth] → Wysyła email weryfikacyjny (jeśli włączone)
       ↓
[Supabase SDK] → Zwraca session (jeśli email verification wyłączona)
       ↓
[Client React] → Redirect lub komunikat sukcesu
```

**Reset hasła:**
```
[Client React] → supabase.auth.resetPasswordForEmail(email, { redirectTo })
       ↓
[Supabase Auth API] → Generuje recovery token
       ↓
[Email Provider] → Wysyła email z linkiem
       ↓
[User] → Klika link → Redirect do /update-password#access_token=...
       ↓
[Supabase SDK] → Auto-logowanie przez token w URL
       ↓
[Client React] → supabase.auth.updateUser({ password: newPassword })
       ↓
[Supabase Auth API] → Aktualizuje hasło w auth.users
```

---

### 4.4. Zarządzanie sesją

**Przechowywanie sesji:**
- Supabase SDK automatycznie zapisuje sesję w **cookies** (httpOnly, secure)
- Cookies: `sb-<project-ref>-auth-token`
- Zawartość: JWT access_token + refresh_token

**Odświeżanie sesji:**
- Access token wygasa po 1 godzinie (domyślnie)
- Supabase SDK automatycznie odświeża token używając refresh_token
- Nie wymaga akcji po stronie programisty

**Sprawdzanie sesji (SSR):**
```typescript
// W każdej stronie Astro
const { data: { session } } = await Astro.locals.supabase.auth.getSession();
const user = session?.user ?? null;

// Lub użyj danych z middleware
const user = Astro.locals.user;
```

**Sprawdzanie sesji (client-side):**
```typescript
// W React componentach
const { data: { session } } = await supabase.auth.getSession();
const user = session?.user ?? null;

// Lub nasłuchuj zmian sesji
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session?.user);
});
```

---

### 4.5. Integracja z Astro Middleware

**Cel middleware:**
1. Udostępnienie `supabase` client przez `context.locals`
2. Sprawdzenie sesji przy każdym requeście
3. Ochrona chronionych stron (redirect do `/login`)
4. Przekazanie `user` do stron Astro

**Implementacja:**
```typescript
// src/middleware/index.ts
import { defineMiddleware } from "astro:middleware";
import { supabaseClient } from "../db/supabase.client.ts";

export const onRequest = defineMiddleware(async (context, next) => {
  // 1. Udostępnienie Supabase client
  context.locals.supabase = supabaseClient;
  
  // 2. Sprawdzenie sesji
  const { data: { session } } = await supabaseClient.auth.getSession();
  context.locals.session = session;
  context.locals.user = session?.user ?? null;
  
  // 3. Ochrona chronionych stron
  const protectedRoutes = ['/dogs', '/favorites', '/history'];
  const isProtectedRoute = protectedRoutes.some(route => 
    context.url.pathname.startsWith(route)
  );
  
  if (isProtectedRoute && !session) {
    const returnUrl = encodeURIComponent(context.url.pathname + context.url.search);
    return context.redirect(`/login?redirect=${returnUrl}`);
  }
  
  // 4. Przekazanie kontroli do strony
  return next();
});
```

**Typowanie:**
```typescript
// src/env.d.ts
declare namespace App {
  interface Locals {
    supabase: import('./db/supabase.client').SupabaseClient;
    session: import('@supabase/supabase-js').Session | null;
    user: import('@supabase/supabase-js').User | null;
  }
}
```

---

## 5. Bezpieczeństwo

### 5.1. HTTPS i Secure Cookies

**Wymagania:**
- **Production:** HTTPS wymagane (certyfikat SSL/TLS)
- **Development:** HTTP dozwolone (localhost)

**Supabase Cookies:**
- `httpOnly: true` - JavaScript nie ma dostępu (ochrona przed XSS)
- `secure: true` - tylko HTTPS (production)
- `sameSite: lax` - ochrona przed CSRF

---

### 5.2. CSRF Protection

**Ochrona:**
- Supabase SDK automatycznie dodaje `X-CSRF-Token` do requestów
- Cookies `sameSite: lax` zapobiegają atakom CSRF
- Brak potrzeby dodatkowej konfiguracji

---

### 5.3. XSS Prevention

**Ochrona:**
- React automatycznie escapuje dane w JSX (ochrona przed XSS)
- Astro automatycznie escapuje dane w szablonach
- **Nigdy nie używaj** `dangerouslySetInnerHTML` dla danych użytkownika
- **Nigdy nie używaj** `set:html` w Astro dla danych użytkownika

---

### 5.4. SQL Injection Prevention

**Ochrona:**
- Supabase używa **prepared statements** (parametryzowane queries)
- RLS Policies (Row Level Security) ograniczają dostęp do danych
- Brak bezpośrednich zapytań SQL z aplikacji frontendowej

---

### 5.5. Rate Limiting

**Ochrona:**
- Supabase Auth ma wbudowany rate limiting:
  - Login: 10 prób / 5 minut
  - Reset hasła: 1 email / 60 sekund
  - Rejestracja: 5 prób / godzinę (IP address)
- Automatyczne blokowanie po przekroczeniu limitów

---

### 5.6. Password Security

**Ochrona:**
- Hasła są hashowane przez **bcrypt** (Supabase Auth)
- Min. 8 znaków (konfiguracja)
- Opcjonalnie: wymuszenie silnych haseł (litera + cyfra)
- Hasła **nigdy** nie są wysyłane plain-text
- Hasła **nigdy** nie są logowane

**Zalecenia dla użytkownika:**
- Wskaźnik siły hasła w formularzu rejestracji
- Komunikat: "Użyj min. 12 znaków, wielkie/małe litery, cyfry i znaki specjalne"

---

### 5.7. Session Security

**Ochrona:**
- Access token wygasa po 1 godzinie
- Refresh token wygasa po 30 dniach (domyślnie)
- Auto-odświeżanie tokenu przez SDK
- Wylogowanie usuwa sesję z cookies i Supabase

**Zalecenia:**
- Opcjonalnie: implementacja "Remember me" (dłuższy refresh token)
- Opcjonalnie: automatyczne wylogowanie po 24h bezczynności

---

### 5.8. Email Security

**Ochrona:**
- Linki resetujące hasło wygasają po 1 godzinie
- Każdy link jest jednorazowy (nie można użyć ponownie)
- Rate limiting na wysyłanie emaili (1/60s)

---

## 6. Diagramy i Przepływy

### 6.1. Diagram architektury autentykacji

```
┌──────────────────────────────────────────────────────────────┐
│                      BROWSER (Client)                         │
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  Astro Pages │    │ React Forms  │    │ Supabase SDK │  │
│  │  (SSR)       │◄──►│ (Login/Reg)  │◄──►│ (@supabase/  │  │
│  │              │    │              │    │  supabase-js)│  │
│  └──────────────┘    └──────────────┘    └──────┬───────┘  │
│         ▲                                        │           │
│         │                                        │ HTTPS     │
│         │ Session Check                          │           │
│         │ (Cookies)                              ▼           │
└─────────┼────────────────────────────────────────┼──────────┘
          │                                        │
          │                                        │
┌─────────┼────────────────────────────────────────┼──────────┐
│         │            ASTRO SSR (Node.js)         │           │
│         │                                        │           │
│  ┌──────▼───────┐    ┌──────────────┐    ┌──────▼───────┐  │
│  │  Middleware  │◄──►│   Layout     │    │  Supabase    │  │
│  │  (Session    │    │   (Header)   │    │  Client      │  │
│  │   Check)     │    │              │    │              │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                                        │           │
└─────────┼────────────────────────────────────────┼──────────┘
          │                                        │
          │                          HTTPS + Auth Header
          │                                        │
┌─────────▼────────────────────────────────────────▼──────────┐
│                      SUPABASE                                │
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │ Supabase Auth│◄──►│  PostgreSQL  │    │Email Provider│  │
│  │   (API)      │    │  (Database)  │    │  (SMTP)      │  │
│  │              │    │              │    │              │  │
│  └──────────────┘    └──────┬───────┘    └──────────────┘  │
│                             │                               │
│                    ┌────────▼────────┐                      │
│                    │   auth.users    │                      │
│                    │  public.users   │                      │
│                    └─────────────────┘                      │
└──────────────────────────────────────────────────────────────┘
```

---

### 6.2. Sekwencja rejestracji użytkownika

```
User           React Form       Supabase SDK      Supabase Auth     PostgreSQL      Email
 │                 │                  │                  │              │             │
 │  Fill form      │                  │                  │              │             │
 ├────────────────►│                  │                  │              │             │
 │                 │                  │                  │              │             │
 │  Submit         │                  │                  │              │             │
 ├────────────────►│  signUp()        │                  │              │             │
 │                 ├─────────────────►│  POST /signup    │              │             │
 │                 │                  ├─────────────────►│              │             │
 │                 │                  │                  │  INSERT      │             │
 │                 │                  │                  ├──────────────►             │
 │                 │                  │                  │  auth.users  │             │
 │                 │                  │                  │              │             │
 │                 │                  │                  │◄─────────────┤             │
 │                 │                  │                  │              │             │
 │                 │                  │                  │  TRIGGER     │             │
 │                 │                  │                  ├──────────────►             │
 │                 │                  │                  │  INSERT      │             │
 │                 │                  │                  │  public.users│             │
 │                 │                  │                  │              │             │
 │                 │                  │                  ├──────────────┼────────────►│
 │                 │                  │                  │  Send email  │    Email    │
 │                 │                  │◄─────────────────┤              │             │
 │                 │◄─────────────────┤  { session }     │              │             │
 │◄────────────────┤  Success!        │                  │              │             │
 │  Redirect       │                  │                  │              │             │
 │  /foods         │                  │                  │              │             │
 └─────────────────┴──────────────────┴──────────────────┴──────────────┴─────────────┘
```

---

### 6.3. Sekwencja logowania użytkownika

```
User           React Form       Supabase SDK      Supabase Auth     PostgreSQL
 │                 │                  │                  │              │
 │  Enter email    │                  │                  │              │
 │  & password     │                  │                  │              │
 ├────────────────►│                  │                  │              │
 │                 │                  │                  │              │
 │  Submit         │                  │                  │              │
 ├────────────────►│  signInWith      │                  │              │
 │                 │  Password()      │                  │              │
 │                 ├─────────────────►│  POST /token     │              │
 │                 │                  ├─────────────────►│              │
 │                 │                  │                  │  SELECT      │
 │                 │                  │                  ├──────────────►
 │                 │                  │                  │  auth.users  │
 │                 │                  │                  │  (verify)    │
 │                 │                  │                  │◄─────────────┤
 │                 │                  │◄─────────────────┤              │
 │                 │◄─────────────────┤  { session,      │              │
 │                 │  Set cookies     │    user }        │              │
 │◄────────────────┤  Success!        │                  │              │
 │  window.        │                  │                  │              │
 │  location       │                  │                  │              │
 │  .href='/foods' │                  │                  │              │
 └─────────────────┴──────────────────┴──────────────────┴──────────────┘
```

---

## 7. Checklist Implementacji

### 7.1. Konfiguracja Supabase

- [ ] Włącz Email Auth w Supabase Dashboard
- [ ] Skonfiguruj Email Provider (SMTP - np. SendGrid, Mailgun)
- [ ] Dodaj Site URL (localhost + production)
- [ ] Dodaj Redirect URLs (`/update-password`)
- [ ] Ustaw Password Requirements (min. 8 znaków)
- [ ] Skonfiguruj Email Template dla **Recovery** (reset hasła) - wymagany
- [ ] **Wyłącz email verification** dla instant onboarding (zalecane dla MVP)
- [ ] Zweryfikuj Rate Limiting settings

### 7.2. Baza danych

- [x] Tabela `public.users` już istnieje (migracja `20251012173600_initial_schema.sql`)
- [x] RLS policies dla tabeli `public.users` już zaimplementowane
- [ ] **Utworzyć migrację** z triggerem `handle_new_user()` dla auto-insert do `public.users` (sekcja 3.4)
- [ ] Zweryfikować, że typowanie `SupabaseClient` istnieje w `src/db/supabase.client.ts`
- [ ] Dodać `Session` i `User` do `App.Locals` w `src/env.d.ts`

### 7.3. Middleware

- [ ] Rozszerzyć middleware o sprawdzanie sesji
- [ ] Dodać ochronę chronionych stron (redirect do `/login?redirect=...`)
- [ ] Udostępnić `user` przez `context.locals`

### 7.4. Strony Astro (SSR)

- [ ] Utworzyć `/src/pages/login.astro`
- [ ] Utworzyć `/src/pages/register.astro`
- [ ] Utworzyć `/src/pages/reset-password.astro`
- [ ] Utworzyć `/src/pages/update-password.astro`
- [ ] Modyfikować `/src/layouts/Layout.astro` (dodać Header)
- [ ] Modyfikować `/src/pages/foods.astro` (przekazać `isLoggedIn`)
- [ ] Modyfikować `/src/pages/asystent.astro` (przekazać `isLoggedIn`)

### 7.5. Komponenty React

- [ ] Utworzyć `/src/components/auth/LoginForm.tsx`
- [ ] Utworzyć `/src/components/auth/RegisterForm.tsx`
- [ ] Utworzyć `/src/components/auth/ResetPasswordForm.tsx`
- [ ] Utworzyć `/src/components/auth/UpdatePasswordForm.tsx`
- [ ] Utworzyć `/src/components/layout/Header.tsx`
- [ ] Utworzyć `/src/components/layout/UserMenu.tsx`
- [ ] Utworzyć `/src/components/ui/WelcomeModal.tsx` (opcjonalnie)
- [ ] Utworzyć `/src/components/ui/AuthPromptBanner.tsx`

### 7.6. Utilities i Helpers

- [ ] Utworzyć `/src/lib/auth/errorMessages.ts` (mapowanie błędów)
- [ ] Utworzyć `/src/lib/auth/validation.ts` (funkcje walidacji)
- [ ] Dodać bibliotekę `sonner` dla toast notifications (opcjonalnie)

### 7.7. Styling

- [ ] Dodać komponenty Shadcn/ui:
  - [ ] Button
  - [ ] Input
  - [ ] Label
  - [ ] Dialog
  - [ ] DropdownMenu
  - [ ] Avatar
  - [ ] Alert
- [ ] Dostosować kolory i theme w `tailwind.config`

### 7.8. Testy

- [ ] Testy E2E (Playwright/Cypress):
  - [ ] Rejestracja nowego użytkownika
  - [ ] Logowanie istniejącego użytkownika
  - [ ] Wylogowanie
  - [ ] Reset hasła (flow email → update password)
  - [ ] Ochrona chronionych stron (redirect do login)
- [ ] Testy jednostkowe:
  - [ ] Walidacja formularzy
  - [ ] Mapowanie błędów (getAuthErrorMessage)
  - [ ] Helper functions (getInitials)

### 7.9. Dokumentacja

- [ ] Zaktualizować README.md (instrukcja konfiguracji Supabase Auth)
- [ ] Dodać dokumentację dla developerów (`docs/auth-setup.md`)
- [ ] Dodać dokumentację dla użytkowników (FAQ o rejestracji, logowaniu)

### 7.10. Deployment

- [ ] Ustawić zmienne środowiskowe w production:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
- [ ] Skonfigurować Site URL w Supabase Dashboard (production URL)
- [ ] Skonfigurować SMTP dla production (np. SendGrid, Mailgun)
- [ ] Zweryfikować HTTPS na produkcji
- [ ] Przetestować flow rejestracji i logowania na produkcji

---

## 8. Podsumowanie

### 8.1. Zgodność z PRD

**Dokument jest w pełni zgodny z wymaganiami z `prd.md` (sekcje 6-7):**
- ✅ Wszystkie wymagania z sekcji 6 "Bezpieczny dostęp" są zaimplementowane
- ✅ Architektura wspiera cele z sekcji 7 "Kolekcja reguł"
- ✅ Stack technologiczny zgodny z `tech_stack.md` i aktualną implementacją (Astro + Supabase)
- ⚠️ Sekcje 1-5 w `prd.md` zawierają przestarzałe informacje (Next.js + FastAPI) - wymagają aktualizacji

### 8.2. Kluczowe decyzje architektoniczne

1. **Supabase Auth jako jedyne źródło prawdy** - brak własnej implementacji auth
2. **SSR dla sprawdzania sesji** - middleware + Astro SSR
3. **React tylko dla interaktywności** - formularze, dropdown, modal
4. **Graceful degradation** - użytkownik może przeglądać bez logowania
5. **Security-first** - HTTPS, RLS policies, rate limiting, secure cookies
6. **Email verification wyłączona** - instant onboarding dla lepszego UX

### 8.3. Zalety rozwiązania

- ✅ **Szybka implementacja** - Supabase Auth obsługuje całą logikę
- ✅ **Bezpieczeństwo** - battle-tested solution, automatyczne rate limiting
- ✅ **Skalowalność** - Supabase skaluje automatycznie
- ✅ **Łatwa maintenance** - brak własnego backendu auth
- ✅ **Dobra UX** - inline validation, loading states, jasne komunikaty

### 8.4. Potencjalne rozszerzenia (poza MVP)

- 🔮 OAuth providers (Google, GitHub, Facebook)
- 🔮 Two-Factor Authentication (2FA)
- 🔮 Session management (wiele urządzeń, wylogowanie ze wszystkich)
- 🔮 Email verification jako obowiązkowe
- 🔮 Polityka wygasania sesji (auto-logout po X dni bezczynności)
- 🔮 Zaawansowane analytics (logowanie eventów auth)

---

**Koniec specyfikacji technicznej modułu autentykacji ZwierzakBezAlergii v1.0**

