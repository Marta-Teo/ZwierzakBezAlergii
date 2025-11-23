-- ============================================================================
-- COMBINED MIGRATIONS FILE FOR CLOUDFLARE DEPLOYMENT
-- ============================================================================
-- Purpose: This file combines all migrations in the correct order
-- Usage: Copy and paste this entire file into Supabase Dashboard → SQL Editor
-- Date: 2025-11-23
-- ============================================================================

-- ============================================================================
-- MIGRATION 1: 20251012173600_initial_schema.sql
-- ============================================================================

-- Migration: Initial database schema for ZwierzakBezAlergii MVP
-- Purpose: Create all tables, relationships, indexes, and RLS policies
-- Affected: users, brands, size_types, age_categories, ingredients, allergens, 
--           foods, food_ingredients, ingredient_allergens, articles

-- ============================================================================
-- 1. EXTEND USERS TABLE WITH ROLE COLUMN
-- ============================================================================

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  role varchar not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.users is 'Extended user profile data with role management';
comment on column public.users.role is 'User role: "user" (default) or "admin"';

-- ============================================================================
-- 2. DICTIONARY TABLES
-- ============================================================================

create table if not exists public.brands (
  id serial primary key,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.size_types (
  id serial primary key,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.age_categories (
  id serial primary key,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ingredients (
  id serial primary key,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.allergens (
  id serial primary key,
  name text not null,
  parent_id int references public.allergens(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 3. MAIN TABLES
-- ============================================================================

create table if not exists public.foods (
  id serial primary key,
  name text not null,
  brand_id int not null references public.brands(id) on delete restrict,
  size_type_id int references public.size_types(id) on delete restrict,
  age_category_id int references public.age_categories(id) on delete restrict,
  ingredients_raw text,
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.articles (
  id serial primary key,
  title text not null,
  slug text not null unique,
  content text not null,
  author_id uuid references public.users(id),
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 4. PIVOT TABLES (MANY-TO-MANY RELATIONSHIPS)
-- ============================================================================

create table if not exists public.food_ingredients (
  food_id int not null references public.foods(id) on delete cascade,
  ingredient_id int not null references public.ingredients(id) on delete no action,
  primary key (food_id, ingredient_id)
);

create table if not exists public.ingredient_allergens (
  ingredient_id int not null references public.ingredients(id) on delete no action,
  allergen_id int not null references public.allergens(id) on delete no action,
  primary key (ingredient_id, allergen_id)
);

-- ============================================================================
-- 5. INDEXES FOR QUERY PERFORMANCE
-- ============================================================================

create index if not exists idx_foods_brand_id on public.foods(brand_id);
create index if not exists idx_foods_size_type_id on public.foods(size_type_id);
create index if not exists idx_foods_age_category_id on public.foods(age_category_id);
create index if not exists idx_ingredients_name on public.ingredients using gin(to_tsvector('simple', name));
create index if not exists idx_foods_ingredients_raw on public.foods using gin(to_tsvector('simple', ingredients_raw));
create index if not exists idx_articles_slug on public.articles(slug);

-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- USERS TABLE
alter table public.users enable row level security;

create policy "select_users_authenticated" on public.users
  for select to authenticated using (true);

create policy "select_users_anon" on public.users
  for select to anon using (true);

create policy "insert_users_authenticated" on public.users
  for insert to authenticated with check (auth.uid() = id);

create policy "update_users_authenticated" on public.users
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- BRANDS TABLE
alter table public.brands enable row level security;

create policy "select_brands_authenticated" on public.brands
  for select to authenticated using (true);

create policy "select_brands_anon" on public.brands
  for select to anon using (true);

create policy "insert_brands_authenticated" on public.brands
  for insert to authenticated with check (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "update_brands_authenticated" on public.brands
  for update to authenticated 
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "delete_brands_authenticated" on public.brands
  for delete to authenticated using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- SIZE_TYPES TABLE
alter table public.size_types enable row level security;

create policy "select_size_types_authenticated" on public.size_types
  for select to authenticated using (true);

create policy "select_size_types_anon" on public.size_types
  for select to anon using (true);

create policy "insert_size_types_authenticated" on public.size_types
  for insert to authenticated with check (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "update_size_types_authenticated" on public.size_types
  for update to authenticated 
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "delete_size_types_authenticated" on public.size_types
  for delete to authenticated using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- AGE_CATEGORIES TABLE
alter table public.age_categories enable row level security;

create policy "select_age_categories_authenticated" on public.age_categories
  for select to authenticated using (true);

create policy "select_age_categories_anon" on public.age_categories
  for select to anon using (true);

create policy "insert_age_categories_authenticated" on public.age_categories
  for insert to authenticated with check (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "update_age_categories_authenticated" on public.age_categories
  for update to authenticated 
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "delete_age_categories_authenticated" on public.age_categories
  for delete to authenticated using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- INGREDIENTS TABLE
alter table public.ingredients enable row level security;

create policy "select_ingredients_authenticated" on public.ingredients
  for select to authenticated using (true);

create policy "select_ingredients_anon" on public.ingredients
  for select to anon using (true);

create policy "insert_ingredients_authenticated" on public.ingredients
  for insert to authenticated with check (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "update_ingredients_authenticated" on public.ingredients
  for update to authenticated 
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "delete_ingredients_authenticated" on public.ingredients
  for delete to authenticated using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- ALLERGENS TABLE
alter table public.allergens enable row level security;

create policy "select_allergens_authenticated" on public.allergens
  for select to authenticated using (true);

create policy "select_allergens_anon" on public.allergens
  for select to anon using (true);

create policy "insert_allergens_authenticated" on public.allergens
  for insert to authenticated with check (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "update_allergens_authenticated" on public.allergens
  for update to authenticated 
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "delete_allergens_authenticated" on public.allergens
  for delete to authenticated using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- FOODS TABLE
alter table public.foods enable row level security;

create policy "select_foods_authenticated" on public.foods
  for select to authenticated using (true);

create policy "select_foods_anon" on public.foods
  for select to anon using (true);

create policy "insert_foods_authenticated" on public.foods
  for insert to authenticated with check (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "update_foods_authenticated" on public.foods
  for update to authenticated 
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "delete_foods_authenticated" on public.foods
  for delete to authenticated using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- FOOD_INGREDIENTS TABLE
alter table public.food_ingredients enable row level security;

create policy "select_food_ingredients_authenticated" on public.food_ingredients
  for select to authenticated using (true);

create policy "select_food_ingredients_anon" on public.food_ingredients
  for select to anon using (true);

create policy "insert_food_ingredients_authenticated" on public.food_ingredients
  for insert to authenticated with check (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "delete_food_ingredients_authenticated" on public.food_ingredients
  for delete to authenticated using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- INGREDIENT_ALLERGENS TABLE
alter table public.ingredient_allergens enable row level security;

create policy "select_ingredient_allergens_authenticated" on public.ingredient_allergens
  for select to authenticated using (true);

create policy "select_ingredient_allergens_anon" on public.ingredient_allergens
  for select to anon using (true);

create policy "insert_ingredient_allergens_authenticated" on public.ingredient_allergens
  for insert to authenticated with check (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "delete_ingredient_allergens_authenticated" on public.ingredient_allergens
  for delete to authenticated using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- ARTICLES TABLE
alter table public.articles enable row level security;

create policy "select_articles_authenticated" on public.articles
  for select to authenticated using (true);

create policy "select_articles_anon" on public.articles
  for select to anon using (true);

create policy "insert_articles_authenticated" on public.articles
  for insert to authenticated with check (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "update_articles_authenticated" on public.articles
  for update to authenticated 
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "delete_articles_authenticated" on public.articles
  for delete to authenticated using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- ============================================================================
-- 7. TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ============================================================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

create trigger set_updated_at before update on public.users
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.brands
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.size_types
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.age_categories
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.ingredients
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.allergens
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.foods
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.articles
  for each row execute function public.handle_updated_at();

-- ============================================================================
-- MIGRATION 2: 20251022173110_add_image_url_to_foods.sql
-- ============================================================================

ALTER TABLE public.foods 
ADD COLUMN IF NOT EXISTS image_url text;

COMMENT ON COLUMN public.foods.image_url IS 'URL to the food package image';

-- ============================================================================
-- MIGRATION 3: 20251023210000_add_articles_fields.sql
-- ============================================================================

ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS excerpt text;

COMMENT ON COLUMN public.articles.excerpt IS 'Short article description (120-200 chars)';

ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.articles.published IS 'Publication status: true = published, false = draft';

CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles(published);

UPDATE public.articles SET published = true WHERE published IS NULL OR published = false;

-- ============================================================================
-- MIGRATION 4: 20251102120000_add_auth_user_trigger.sql
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, role, created_at, updated_at)
  VALUES (NEW.id, 'user', NOW(), NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.handle_new_user() IS 
  'Automatically creates a record in public.users when a new user registers';

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- MIGRATION 5: 20251102180000_add_dog_profiles.sql
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

CREATE TABLE IF NOT EXISTS public.dog_allergens (
  dog_id int NOT NULL REFERENCES public.dog_profiles(id) ON DELETE CASCADE,
  allergen_id int NOT NULL REFERENCES public.allergens(id) ON DELETE CASCADE,
  PRIMARY KEY (dog_id, allergen_id)
);

COMMENT ON TABLE public.dog_allergens IS 'Many-to-many relationship between dogs and their allergens';

CREATE INDEX IF NOT EXISTS idx_dog_profiles_user_id ON public.dog_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_dog_allergens_dog_id ON public.dog_allergens(dog_id);
CREATE INDEX IF NOT EXISTS idx_dog_allergens_allergen_id ON public.dog_allergens(allergen_id);

ALTER TABLE public.dog_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dog_allergens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own dog profiles"
  ON public.dog_profiles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dog profiles"
  ON public.dog_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dog profiles"
  ON public.dog_profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own dog profiles"
  ON public.dog_profiles FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view allergens for own dogs"
  ON public.dog_allergens FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.dog_profiles WHERE id = dog_allergens.dog_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can insert allergens for own dogs"
  ON public.dog_allergens FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.dog_profiles WHERE id = dog_allergens.dog_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can delete allergens for own dogs"
  ON public.dog_allergens FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.dog_profiles WHERE id = dog_allergens.dog_id AND user_id = auth.uid())
  );

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_dog_profiles_updated_at
  BEFORE UPDATE ON public.dog_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- MIGRATION 6: 20251110000000_add_favorite_foods.sql
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.favorite_foods (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  food_id INTEGER NOT NULL REFERENCES public.foods(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_food UNIQUE(user_id, food_id)
);

CREATE INDEX IF NOT EXISTS idx_favorite_foods_user_id ON public.favorite_foods(user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_foods_food_id ON public.favorite_foods(food_id);
CREATE INDEX IF NOT EXISTS idx_favorite_foods_user_food ON public.favorite_foods(user_id, food_id);

ALTER TABLE public.favorite_foods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON public.favorite_foods FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add own favorites"
  ON public.favorite_foods FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON public.favorite_foods FOR DELETE USING (auth.uid() = user_id);

COMMENT ON TABLE public.favorite_foods IS 'Stores user favorite foods for quick access';

-- ============================================================================
-- MIGRATION 7: 20251110100000_add_unique_constraint_ingredients_name.sql
-- ============================================================================

ALTER TABLE public.ingredients 
ADD CONSTRAINT ingredients_name_unique UNIQUE (name);

COMMENT ON CONSTRAINT ingredients_name_unique ON public.ingredients 
IS 'Ensures ingredient names are unique across the database';

-- ============================================================================
-- END OF MIGRATIONS
-- ============================================================================

