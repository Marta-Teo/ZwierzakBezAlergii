# Plan Implementacji Widoku "Moje Psy" (/dogs)

## 1. Przegląd

### 1.1. Cel
Implementacja widoku zarządzania profilami psów dla zalogowanych użytkowników, który umożliwia:
- Przeglądanie listy psów użytkownika
- Tworzenie nowych profili psów z alergenami
- Edycję istniejących profili
- Usuwanie profili
- Szybkie filtrowanie karm na podstawie profilu psa

### 1.2. Zgodność z dokumentacją
- **PRD**: Zgodne z sekcjami 6 i 7 (personalizacja dla zalogowanych użytkowników)
- **Tech Stack**: Astro 5 + React 19 + TypeScript 5 + Tailwind 4 + Shadcn/ui + Supabase
- **US-002**: Implementacja wszystkich kryteriów akceptacji z faza_pierwsza_autentykacja.md

### 1.3. Routing
```
/dogs                    → Lista psów (protected)
/dogs/new                → Formularz dodawania nowego psa (protected)
/dogs/[id]/edit          → Formularz edycji psa (protected)
/foods?dogId={id}        → Automatyczne filtrowanie na podstawie profilu
```

---

## 2. Architektura Bazy Danych

### 2.1. Migracja SQL
**Plik**: `supabase/migrations/20251102180000_add_dog_profiles.sql`

```sql
-- ============================================================================
-- TABELA: dog_profiles
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.dog_profiles (
  id serial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL CHECK (char_length(name) <= 50 AND char_length(name) > 0),
  size_type_id int REFERENCES public.size_types(id) ON DELETE SET NULL,
  age_category_id int REFERENCES public.age_categories(id) ON DELETE SET NULL,
  notes text CHECK (char_length(notes) <= 500),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.dog_profiles IS 'User dog profiles for personalized food filtering';
COMMENT ON COLUMN public.dog_profiles.name IS 'Dog name (required, 1-50 chars, only letters/spaces/hyphens)';
COMMENT ON COLUMN public.dog_profiles.notes IS 'Optional notes from owner (max 500 chars)';

-- ============================================================================
-- TABELA: dog_allergens (Many-to-Many)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.dog_allergens (
  dog_id int NOT NULL REFERENCES public.dog_profiles(id) ON DELETE CASCADE,
  allergen_id int NOT NULL REFERENCES public.allergens(id) ON DELETE CASCADE,
  PRIMARY KEY (dog_id, allergen_id)
);

COMMENT ON TABLE public.dog_allergens IS 'Many-to-many relationship between dogs and their allergens';

-- ============================================================================
-- INDEKSY
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_dog_profiles_user_id ON public.dog_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_dog_allergens_dog_id ON public.dog_allergens(dog_id);
CREATE INDEX IF NOT EXISTS idx_dog_allergens_allergen_id ON public.dog_allergens(allergen_id);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE public.dog_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dog_allergens ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view only their own dog profiles
CREATE POLICY "Users can view own dog profiles"
  ON public.dog_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own dog profiles
CREATE POLICY "Users can insert own dog profiles"
  ON public.dog_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update only their own dog profiles
CREATE POLICY "Users can update own dog profiles"
  ON public.dog_profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete only their own dog profiles
CREATE POLICY "Users can delete own dog profiles"
  ON public.dog_profiles
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Users can view allergens for their own dogs
CREATE POLICY "Users can view allergens for own dogs"
  ON public.dog_allergens
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.dog_profiles
      WHERE id = dog_allergens.dog_id AND user_id = auth.uid()
    )
  );

-- Policy: Users can insert allergens for their own dogs
CREATE POLICY "Users can insert allergens for own dogs"
  ON public.dog_allergens
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.dog_profiles
      WHERE id = dog_allergens.dog_id AND user_id = auth.uid()
    )
  );

-- Policy: Users can delete allergens for their own dogs
CREATE POLICY "Users can delete allergens for own dogs"
  ON public.dog_allergens
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.dog_profiles
      WHERE id = dog_allergens.dog_id AND user_id = auth.uid()
    )
  );

-- ============================================================================
-- TRIGGER: auto_update_updated_at
-- ============================================================================

-- Function to auto-update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on dog_profiles
CREATE TRIGGER update_dog_profiles_updated_at
  BEFORE UPDATE ON public.dog_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
```

### 2.2. TypeScript Types
**Plik**: `src/types.ts` (dodać do istniejącego pliku)

```typescript
// ============================================================================
// DOG PROFILES
// ============================================================================

/**
 * Dog Profile Entity (from database)
 */
export interface DogProfile {
  id: number;
  user_id: string;
  name: string;
  size_type_id: number | null;
  age_category_id: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Dog Profile with Relations (for display)
 */
export interface DogProfileWithRelations extends DogProfile {
  size_type: SizeType | null;
  age_category: AgeCategory | null;
  allergens: Allergen[];
}

/**
 * Dog Allergen Join Table
 */
export interface DogAllergen {
  dog_id: number;
  allergen_id: number;
}

/**
 * DTO: Create Dog Profile
 */
export interface CreateDogProfileDTO {
  name: string;
  size_type_id?: number | null;
  age_category_id?: number | null;
  allergen_ids: number[]; // Array of allergen IDs
  notes?: string | null;
}

/**
 * DTO: Update Dog Profile
 */
export interface UpdateDogProfileDTO {
  id: number;
  name: string;
  size_type_id?: number | null;
  age_category_id?: number | null;
  allergen_ids: number[]; // Array of allergen IDs
  notes?: string | null;
}

/**
 * DTO: Dog Profile Summary (for list view)
 */
export interface DogProfileSummaryDTO {
  id: number;
  name: string;
  size_type_label: string | null;
  age_category_label: string | null;
  allergen_count: number;
  allergen_names: string[]; // First 3 allergen names for preview
  created_at: string;
}
```

---

## 3. Architektura UI

### 3.1. Struktura Komponentów

```
src/
├── pages/
│   ├── dogs.astro                      # Lista psów (SSR)
│   ├── dogs/
│   │   ├── new.astro                   # Formularz dodawania (SSR)
│   │   └── [id]/
│   │       └── edit.astro              # Formularz edycji (SSR)
│
├── components/
│   ├── dogs/
│   │   ├── DogsPage.tsx                # Główny komponent listy (React)
│   │   ├── DogCard.tsx                 # Karta pojedynczego psa (React)
│   │   ├── DogForm.tsx                 # Formularz dodawania/edycji (React)
│   │   ├── DeleteDogModal.tsx          # Modal potwierdzenia usunięcia (React)
│   │   └── EmptyDogs.tsx               # Empty state (React)
│   │
│   └── ui/
│       ├── card.tsx                    # Shadcn Card (istniejący)
│       ├── dialog.tsx                  # Shadcn Dialog (nowy)
│       ├── textarea.tsx                # Shadcn Textarea (nowy)
│       ├── checkbox.tsx                # Shadcn Checkbox (nowy)
│       └── select.tsx                  # Shadcn Select (nowy)
│
├── lib/
│   └── services/
│       └── dogProfileService.ts        # Service do obsługi CRUD psów
```

### 3.2. Styl Wizualny

#### Zgodność z istniejącym designem:
- **Container**: `container mx-auto px-4 py-8` (jak w foods.astro)
- **Cards**: Shadcn/ui Card component z `shadow-md hover:shadow-lg transition`
- **Buttons**: 
  - Primary: `variant="default"` (niebieski)
  - Destructive: `variant="destructive"` (czerwony, dla usuwania)
  - Outline: `variant="outline"` (przycisk "Anuluj")
- **Empty State**: Centrowany tekst z ikoną 🐕 i CTA button
- **Responsive**: Mobile-first (grid cols-1 md:cols-2 lg:cols-3)

---

## 4. Implementacja Stron (Astro SSR)

### 4.1. Lista Psów: `/dogs`
**Plik**: `src/pages/dogs.astro`

```astro
---
import Layout from '../layouts/Layout.astro';
import { DogsPage } from '../components/dogs/DogsPage';

// Route protection - middleware już sprawdza sesję
const user = Astro.locals.user;
if (!user) {
  return Astro.redirect('/login?redirect=/dogs');
}

// Pobranie profili psów użytkownika (SSR)
const { data: dogProfiles, error } = await Astro.locals.supabase
  .from('dog_profiles')
  .select(`
    *,
    size_type:size_types(id, label),
    age_category:age_categories(id, label),
    dog_allergens(allergen:allergens(id, name, name_pl))
  `)
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });

if (error) {
  console.error('Error fetching dog profiles:', error);
}

// Transform data do DTO
const dogs = dogProfiles?.map(dog => ({
  id: dog.id,
  name: dog.name,
  size_type_label: dog.size_type?.label || null,
  age_category_label: dog.age_category?.label || null,
  allergen_count: dog.dog_allergens?.length || 0,
  allergen_names: dog.dog_allergens?.slice(0, 3).map((da: any) => da.allergen.name_pl) || [],
  created_at: dog.created_at,
})) || [];
---

<Layout title="Moje psy - ZwierzakBezAlergii">
  <DogsPage client:load dogs={dogs} />
</Layout>
```

### 4.2. Dodawanie Psa: `/dogs/new`
**Plik**: `src/pages/dogs/new.astro`

```astro
---
import Layout from '../../layouts/Layout.astro';
import { DogForm } from '../../components/dogs/DogForm';

// Route protection
const user = Astro.locals.user;
if (!user) {
  return Astro.redirect('/login?redirect=/dogs/new');
}

// Pobranie opcji do selectów (SSR)
const [
  { data: sizeTypes },
  { data: ageCategories },
  { data: allergens }
] = await Promise.all([
  Astro.locals.supabase.from('size_types').select('*').order('id'),
  Astro.locals.supabase.from('age_categories').select('*').order('id'),
  Astro.locals.supabase.from('allergens').select('*').order('name_pl')
]);
---

<Layout title="Dodaj psa - ZwierzakBezAlergii">
  <main class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Dodaj profil psa</h1>
      <DogForm 
        client:load 
        mode="create"
        sizeTypes={sizeTypes || []}
        ageCategories={ageCategories || []}
        allergens={allergens || []}
      />
    </div>
  </main>
</Layout>
```

### 4.3. Edycja Psa: `/dogs/[id]/edit`
**Plik**: `src/pages/dogs/[id]/edit.astro`

```astro
---
import Layout from '../../../layouts/Layout.astro';
import { DogForm } from '../../../components/dogs/DogForm';

// Route protection
const user = Astro.locals.user;
if (!user) {
  return Astro.redirect('/login?redirect=' + Astro.url.pathname);
}

const { id } = Astro.params;

// Pobranie profilu psa + opcje do selectów (SSR)
const [
  { data: dogProfile, error: dogError },
  { data: sizeTypes },
  { data: ageCategories },
  { data: allergens }
] = await Promise.all([
  Astro.locals.supabase
    .from('dog_profiles')
    .select(`
      *,
      dog_allergens(allergen_id)
    `)
    .eq('id', id)
    .eq('user_id', user.id) // Security: tylko własne profile
    .single(),
  Astro.locals.supabase.from('size_types').select('*').order('id'),
  Astro.locals.supabase.from('age_categories').select('*').order('id'),
  Astro.locals.supabase.from('allergens').select('*').order('name_pl')
]);

// 404 jeśli pies nie istnieje lub nie należy do użytkownika
if (dogError || !dogProfile) {
  return Astro.redirect('/dogs');
}

// Transform allergens do array of IDs
const allergenIds = dogProfile.dog_allergens?.map((da: any) => da.allergen_id) || [];

const initialData = {
  id: dogProfile.id,
  name: dogProfile.name,
  size_type_id: dogProfile.size_type_id,
  age_category_id: dogProfile.age_category_id,
  allergen_ids: allergenIds,
  notes: dogProfile.notes,
};
---

<Layout title={`Edytuj ${dogProfile.name} - ZwierzakBezAlergii`}>
  <main class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Edytuj profil: {dogProfile.name}</h1>
      <DogForm 
        client:load 
        mode="edit"
        initialData={initialData}
        sizeTypes={sizeTypes || []}
        ageCategories={ageCategories || []}
        allergens={allergens || []}
      />
    </div>
  </main>
</Layout>
```

---

## 5. Komponenty React

### 5.1. DogsPage (Lista)
**Plik**: `src/components/dogs/DogsPage.tsx`

**Odpowiedzialność**:
- Wyświetlanie grid z kartami psów
- Empty state jeśli brak psów
- Przycisk "Dodaj psa" na górze

**Props**:
```typescript
interface DogsPageProps {
  dogs: DogProfileSummaryDTO[];
}
```

**Layout**:
```tsx
<main className="container mx-auto px-4 py-8">
  {/* Header z przyciskiem dodawania */}
  <div className="flex justify-between items-center mb-8">
    <h1 className="text-3xl font-bold">Moje psy</h1>
    <Button asChild>
      <a href="/dogs/new">
        <Plus className="mr-2 h-4 w-4" />
        Dodaj psa
      </a>
    </Button>
  </div>

  {/* Grid z psami lub Empty State */}
  {dogs.length === 0 ? (
    <EmptyDogs />
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dogs.map(dog => (
        <DogCard key={dog.id} dog={dog} />
      ))}
    </div>
  )}
</main>
```

### 5.2. DogCard
**Plik**: `src/components/dogs/DogCard.tsx`

**Odpowiedzialność**:
- Wyświetlanie pojedynczego psa (Card)
- Ikony dla rozmiaru i wieku
- Badge z liczbą alergenów
- Przyciski akcji (Filtruj, Edytuj, Usuń)

**Props**:
```typescript
interface DogCardProps {
  dog: DogProfileSummaryDTO;
}
```

**Layout**:
```tsx
<Card className="hover:shadow-lg transition">
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle className="text-xl flex items-center gap-2">
        🐕 {dog.name}
      </CardTitle>
      {/* Delete Button (top-right corner) */}
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  </CardHeader>

  <CardContent className="space-y-4">
    {/* Size & Age Info */}
    <div className="flex gap-4 text-sm text-muted-foreground">
      {dog.size_type_label && (
        <span className="flex items-center gap-1">
          <Dog className="h-4 w-4" />
          {dog.size_type_label}
        </span>
      )}
      {dog.age_category_label && (
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {dog.age_category_label}
        </span>
      )}
    </div>

    {/* Allergens Badge */}
    {dog.allergen_count > 0 && (
      <div>
        <Badge variant="secondary">
          {dog.allergen_count} {dog.allergen_count === 1 ? 'alergen' : 'alergeny'}
        </Badge>
        <p className="text-xs text-muted-foreground mt-1">
          {dog.allergen_names.join(', ')}
          {dog.allergen_count > 3 && ` +${dog.allergen_count - 3}`}
        </p>
      </div>
    )}
  </CardContent>

  <CardFooter className="flex gap-2">
    {/* Filter Foods Button */}
    <Button asChild className="flex-1">
      <a href={`/foods?dogId=${dog.id}`}>
        <Filter className="mr-2 h-4 w-4" />
        Filtruj karmy
      </a>
    </Button>

    {/* Edit Button */}
    <Button variant="outline" asChild>
      <a href={`/dogs/${dog.id}/edit`}>
        <Edit className="h-4 w-4" />
      </a>
    </Button>
  </CardFooter>
</Card>
```

### 5.3. DogForm
**Plik**: `src/components/dogs/DogForm.tsx`

**Odpowiedzialność**:
- Formularz tworzenia/edycji profilu
- Walidacja klient-side
- Komunikacja z Supabase (client-side mutation)
- Error handling i loading states

**Props**:
```typescript
interface DogFormProps {
  mode: 'create' | 'edit';
  initialData?: UpdateDogProfileDTO;
  sizeTypes: SizeType[];
  ageCategories: AgeCategory[];
  allergens: Allergen[];
}
```

**Pola formularza**:
1. **Imię psa** (Input, required)
   - Label: "Imię psa"
   - Placeholder: "np. Burek"
   - Max length: 50
   - Validation: Tylko litery, spacje, myślniki

2. **Rozmiar** (Select, optional)
   - Label: "Rozmiar psa"
   - Options: z `sizeTypes` ( Mały, Średni, Duży)
   - Placeholder: "Wybierz rozmiar"

3. **Wiek** (Select, optional)
   - Label: "Wiek psa"
   - Options: z `ageCategories` (Szczeniak, Junior, Dorosły, Senior)
   - Placeholder: "Wybierz wiek"

4. **Alergeny** (Checkbox group, optional)
   - Label: "Znane alergeny"
   - Checkboxes dla każdego alergenu z `allergens` 
   - Layout: Grid 2-3 kolumny na desktop

5. **Notatki** (Textarea, optional)
   - Label: "Notatki"
   - Placeholder: "Dodatkowe informacje o Twoim psie..."
   - Max length: 500

**Submit Logic**:
```typescript
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);

  try {
    // Walidacja
    const validationError = validateDogForm(formData);
    if (validationError) {
      throw new Error(validationError);
    }

    if (mode === 'create') {
      // 1. Insert do dog_profiles
      const { data: newDog, error: profileError } = await supabase
        .from('dog_profiles')
        .insert({
          name: formData.name,
          size_type_id: formData.size_type_id,
          age_category_id: formData.age_category_id,
          notes: formData.notes,
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // 2. Insert allergens do dog_allergens
      if (formData.allergen_ids.length > 0) {
        const allergenInserts = formData.allergen_ids.map(allergenId => ({
          dog_id: newDog.id,
          allergen_id: allergenId,
        }));

        const { error: allergensError } = await supabase
          .from('dog_allergens')
          .insert(allergenInserts);

        if (allergensError) throw allergensError;
      }
    } else {
      // Edit mode - update profil
      const { error: updateError } = await supabase
        .from('dog_profiles')
        .update({
          name: formData.name,
          size_type_id: formData.size_type_id,
          age_category_id: formData.age_category_id,
          notes: formData.notes,
        })
        .eq('id', initialData!.id);

      if (updateError) throw updateError;

      // Update allergens (delete all, then re-insert)
      await supabase
        .from('dog_allergens')
        .delete()
        .eq('dog_id', initialData!.id);

      if (formData.allergen_ids.length > 0) {
        const allergenInserts = formData.allergen_ids.map(allergenId => ({
          dog_id: initialData!.id,
          allergen_id: allergenId,
        }));

        const { error: allergensError } = await supabase
          .from('dog_allergens')
          .insert(allergenInserts);

        if (allergensError) throw allergensError;
      }
    }

    // Success - redirect
    window.location.href = '/dogs';
  } catch (err: any) {
    setError(err.message || 'Wystąpił nieoczekiwany błąd');
  } finally {
    setIsLoading(false);
  }
};
```

### 5.4. DeleteDogModal
**Plik**: `src/components/dogs/DeleteDogModal.tsx`

**Odpowiedzialność**:
- Dialog potwierdzenia usunięcia
- Obsługa DELETE mutation

**Props**:
```typescript
interface DeleteDogModalProps {
  dogId: number;
  dogName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
```

**Layout**:
```tsx
<Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Usuń profil {dogName}?</DialogTitle>
      <DialogDescription>
        Ta akcja jest nieodwracalna. Wszystkie dane psa zostaną usunięte.
      </DialogDescription>
    </DialogHeader>

    {error && <Alert variant="destructive">{error}</Alert>}

    <DialogFooter>
      <Button variant="outline" onClick={onClose} disabled={isDeleting}>
        Anuluj
      </Button>
      <Button 
        variant="destructive" 
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Usuń
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### 5.5. EmptyDogs
**Plik**: `src/components/dogs/EmptyDogs.tsx`

**Odpowiedzialność**:
- Empty state jeśli użytkownik nie ma jeszcze psów

**Layout**:
```tsx
<div className="text-center py-16">
  <div className="text-6xl mb-4">🐕</div>
  <h2 className="text-2xl font-semibold mb-2">
    Nie masz jeszcze żadnego psa
  </h2>
  <p className="text-muted-foreground mb-6">
    Stwórz profil swojego psa, aby łatwiej filtrować karmy bezpieczne dla niego!
  </p>
  <Button size="lg" asChild>
    <a href="/dogs/new">
      <Plus className="mr-2 h-4 w-4" />
      Stwórz pierwszy profil
    </a>
  </Button>
</div>
```

---

## 6. Walidacja

### 6.1. Client-Side Validation
**Plik**: `src/lib/dogs/validation.ts`

```typescript
export interface DogFormData {
  name: string;
  size_type_id: number | null;
  age_category_id: number | null;
  allergen_ids: number[];
  notes: string | null;
}

/**
 * Validates dog form data
 * @returns Error message or null if valid
 */
export function validateDogForm(data: DogFormData): string | null {
  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    return 'Imię psa jest wymagane';
  }

  if (data.name.length > 50) {
    return 'Imię psa może mieć maksymalnie 50 znaków';
  }

  // Only letters, spaces, hyphens allowed
  const nameRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s\-]+$/;
  if (!nameRegex.test(data.name)) {
    return 'Imię psa może zawierać tylko litery, spacje i myślniki';
  }

  // Notes validation
  if (data.notes && data.notes.length > 500) {
    return 'Notatki mogą mieć maksymalnie 500 znaków';
  }

  return null;
}

/**
 * Sanitizes dog name (trim, remove multiple spaces)
 */
export function sanitizeDogName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}
```

---

## 7. Integracja z /foods

### 7.1. Automatyczne filtrowanie
W `src/pages/foods.astro` dodać sprawdzenie query param `?dogId`:

```astro
---
// ... existing code ...

let preselectedFilters = null;
const dogId = Astro.url.searchParams.get('dogId');

if (dogId && isLoggedIn) {
  // Pobranie profilu psa
  const { data: dogProfile } = await Astro.locals.supabase
    .from('dog_profiles')
    .select(`
      name,
      size_type_id,
      age_category_id,
      dog_allergens(allergen_id)
    `)
    .eq('id', dogId)
    .eq('user_id', Astro.locals.user.id)
    .single();

  if (dogProfile) {
    preselectedFilters = {
      dogName: dogProfile.name,
      sizeTypeId: dogProfile.size_type_id,
      ageCategoryId: dogProfile.age_category_id,
      excludeAllergenIds: dogProfile.dog_allergens?.map(da => da.allergen_id) || [],
    };
  }
}
---

<Layout title="Karmy dla psów - ZwierzakBezAlergii">
  <FoodsPage 
    client:load 
    isLoggedIn={isLoggedIn}
    preselectedFilters={preselectedFilters}
  />
</Layout>
```

### 7.2. Banner w FoodsPage
W `src/components/FoodsPage.tsx` dodać banner jeśli `preselectedFilters` istnieje:

```tsx
{preselectedFilters && (
  <Alert className="mb-4">
    <Dog className="h-4 w-4" />
    <AlertTitle>Wyniki dla: {preselectedFilters.dogName} 🐕</AlertTitle>
    <AlertDescription>
      Filtry automatycznie ustawione na podstawie profilu psa.
      <Button 
        variant="link" 
        size="sm"
        onClick={clearDogFilters}
      >
        Wyczyść filtry
      </Button>
    </AlertDescription>
  </Alert>
)}
```

---

## 8. Shadcn/ui Components (do zainstalowania)

### 8.1. Lista brakujących komponentów
```bash
npx shadcn@latest add dialog
npx shadcn@latest add textarea
npx shadcn@latest add checkbox
npx shadcn@latest add select
npx shadcn@latest add badge
```

---

## 9. Checklist Implementacji

### 9.1. Backend (Baza danych)
- [ ] Utworzenie migracji `20251102180000_add_dog_profiles.sql`
- [ ] Uruchomienie migracji (`supabase db push`)
- [ ] Weryfikacja tabel i RLS policies w Supabase Dashboard
- [ ] Test CRUD operations w SQL Editor

### 9.2. Types & Validation
- [ ] Dodanie typów do `src/types.ts`
- [ ] Utworzenie `src/lib/dogs/validation.ts`
- [ ] Testy jednostkowe dla walidacji

### 9.3. Strony (Astro SSR)
- [ ] `src/pages/dogs.astro` (lista)
- [ ] `src/pages/dogs/new.astro` (dodawanie)
- [ ] `src/pages/dogs/[id]/edit.astro` (edycja)
- [ ] Dodanie `/dogs` do protected routes w middleware

### 9.4. Komponenty React
- [ ] `src/components/dogs/DogsPage.tsx`
- [ ] `src/components/dogs/DogCard.tsx`
- [ ] `src/components/dogs/DogForm.tsx`
- [ ] `src/components/dogs/DeleteDogModal.tsx`
- [ ] `src/components/dogs/EmptyDogs.tsx`

### 9.5. Shadcn/ui Components
- [ ] Instalacja: dialog, textarea, checkbox, select, badge

### 9.6. Integracja
- [ ] Modyfikacja `src/pages/foods.astro` (obsługa `?dogId`)
- [ ] Modyfikacja `src/components/FoodsPage.tsx` (banner z filtrowaniem)
- [ ] Link "Moje psy" w UserMenu (już istnieje)

### 9.7. Testing
- [ ] Test tworzenia profilu psa
- [ ] Test edycji profilu
- [ ] Test usuwania profilu
- [ ] Test filtrowania karm na podstawie profilu
- [ ] Test RLS policies (próba dostępu do cudzego psa)
- [ ] Test responsywności (mobile/desktop)
- [ ] Test empty state

### 9.8. UX Improvements (opcjonalne, future)
- [ ] Toast notifications (sukces/błąd)
- [ ] Optimistic UI updates
- [ ] Lazy loading dla listy psów (pagination)
- [ ] Upload zdjęcia psa (avatar)
- [ ] Eksport profilu psa do PDF

---

## 10. Metryki Sukcesu

### 10.1. Performance
- [ ] Lista psów ładuje się < 200ms (SSR)
- [ ] Formularz zapisuje się < 500ms (client-side mutation)

### 10.2. UX
- [ ] Użytkownik może utworzyć profil w < 60 sekund
- [ ] Filtrowanie karm na podstawie profilu działa poprawnie (0 false positives)
- [ ] Responsywność działa na mobile/tablet/desktop

### 10.3. Security
- [ ] RLS policies blokują dostęp do cudzych profili
- [ ] Walidacja działa zarówno client-side jak i database-side (CHECK constraints)

---

## 11. Ograniczenia i Założenia

### 11.1. Założenia
- Użytkownik może mieć nieograniczoną liczbę psów
- Profil psa może mieć 0 alergenów (opcjonalne)
- Size i Age są opcjonalne (dla flexibility)
- Jedna osoba może edytować tylko swoje profile (RLS)

### 11.2. Out of Scope (MVP)
- Upload zdjęć psów
- Współdzielenie profilu z innymi użytkownikami
- Historia zmian profilu
- Powiadomienia o nowych karmach dla profilu
- Eksport/import profili
- Statystyki użytkowania

---

## 12. Harmonogram

### Dzień 1: Backend + Types
- Migracja bazy danych
- Typy TypeScript
- Walidacja

### Dzień 2: Strony + Core Components
- Astro pages (dogs, dogs/new, dogs/[id]/edit)
- DogForm component
- DogsPage component

### Dzień 3: UI Details + Integration
- DogCard, DeleteDogModal, EmptyDogs
- Integracja z /foods
- Instalacja Shadcn/ui components

### Dzień 4: Testing + Polish
- Manual testing wszystkich flow
- Bug fixes
- Responsywność
- UX improvements

---

## 13. Dodatkowe Notatki

### 13.1. Accessibility
- [ ] Wszystkie formularze mają `<label>` z `htmlFor`
- [ ] Checkboxes są dostępne klawiaturowo
- [ ] Error messages mają `role="alert"`
- [ ] Modal ma `aria-labelledby` i `aria-describedby`
- [ ] Focus trap w modalu usuwania

### 13.2. SEO
- [ ] Meta title dla każdej strony
- [ ] Canonical URLs
- [ ] Open Graph tags (opcjonalnie)

### 13.3. Analytics (future)
- Event: `dog_profile_created`
- Event: `dog_profile_deleted`
- Event: `foods_filtered_by_dog`

---

**Wersja**: 1.0  
**Data**: 2025-11-02  
**Autor**: AI Assistant  
**Status**: Ready for Implementation ✅

