-- Migration: Initial database schema for ZwierzakBezAlergii MVP
-- Purpose: Create all tables, relationships, indexes, and RLS policies
-- Affected: users, brands, size_types, age_categories, ingredients, allergens, 
--           foods, food_ingredients, ingredient_allergens, articles
-- Special considerations: 
--   - Integrates with Supabase Auth (auth.users)
--   - RLS policies restrict admin operations to users with 'admin' role
--   - Hierarchical allergen structure with self-referencing parent_id

-- ============================================================================
-- 1. EXTEND USERS TABLE WITH ROLE COLUMN
-- ============================================================================

-- users table is managed by Supabase Auth, we only extend it with custom fields
-- this table stores user profile information and roles (user, admin)
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

-- brands table stores dog food brands
create table if not exists public.brands (
  id serial primary key,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.brands is 'Dog food brands available in Poland';

-- size_types table stores granule size categories
create table if not exists public.size_types (
  id serial primary key,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.size_types is 'Granule size types (e.g., small, medium, large)';

-- age_categories table stores dog age categories
create table if not exists public.age_categories (
  id serial primary key,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.age_categories is 'Dog age categories (e.g., junior, adult, senior)';

-- ingredients table stores standardized food ingredients
create table if not exists public.ingredients (
  id serial primary key,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.ingredients is 'Standardized ingredient names for dog food';

-- allergens table stores allergens with hierarchical structure
-- parent_id allows grouping allergens (e.g., "meat" -> "chicken", "beef")
create table if not exists public.allergens (
  id serial primary key,
  name text not null,
  parent_id int references public.allergens(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.allergens is 'Allergen hierarchy with parent-child relationships';
comment on column public.allergens.parent_id is 'Self-reference for allergen grouping (e.g., chicken -> meat)';

-- ============================================================================
-- 3. MAIN TABLES
-- ============================================================================

-- foods table stores dog food products with their attributes
-- size_type_id and age_category_id can be null (not all foods have these categories)
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

comment on table public.foods is 'Dog food products with filtering attributes';
comment on column public.foods.ingredients_raw is 'Raw ingredient list as text (for display purposes)';
comment on column public.foods.size_type_id is 'Nullable - not all foods specify granule size';
comment on column public.foods.age_category_id is 'Nullable - not all foods specify age category';

-- articles table stores educational content about dog nutrition and allergies
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

comment on table public.articles is 'Educational articles about dog nutrition and allergies';
comment on column public.articles.slug is 'URL-friendly unique identifier for articles';

-- ============================================================================
-- 4. PIVOT TABLES (MANY-TO-MANY RELATIONSHIPS)
-- ============================================================================

-- food_ingredients links foods to their ingredients
-- cascade delete: when food is deleted, remove its ingredient relationships
-- no action on ingredient delete: prevent deleting ingredients used in foods
create table if not exists public.food_ingredients (
  food_id int not null references public.foods(id) on delete cascade,
  ingredient_id int not null references public.ingredients(id) on delete no action,
  primary key (food_id, ingredient_id)
);

comment on table public.food_ingredients is 'Many-to-many relationship between foods and ingredients';

-- ingredient_allergens maps ingredients to allergens they contain
-- no action on both deletes: preserve data integrity for filtering
create table if not exists public.ingredient_allergens (
  ingredient_id int not null references public.ingredients(id) on delete no action,
  allergen_id int not null references public.allergens(id) on delete no action,
  primary key (ingredient_id, allergen_id)
);

comment on table public.ingredient_allergens is 'Many-to-many relationship between ingredients and allergens';

-- ============================================================================
-- 5. INDEXES FOR QUERY PERFORMANCE
-- ============================================================================

-- b-tree indexes for foreign key lookups
create index if not exists idx_foods_brand_id on public.foods(brand_id);
create index if not exists idx_foods_size_type_id on public.foods(size_type_id);
create index if not exists idx_foods_age_category_id on public.foods(age_category_id);

-- gin indexes for full-text search on ingredient names and raw text
create index if not exists idx_ingredients_name on public.ingredients using gin(to_tsvector('simple', name));
create index if not exists idx_foods_ingredients_raw on public.foods using gin(to_tsvector('simple', ingredients_raw));

-- index for article slug lookups
create index if not exists idx_articles_slug on public.articles(slug);

-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- ============================================================================
-- 6.1 USERS TABLE
-- ============================================================================

alter table public.users enable row level security;

-- allow all authenticated users to view user profiles
create policy "select_users_authenticated" on public.users
  for select
  to authenticated
  using (true);

comment on policy "select_users_authenticated" on public.users is 
  'Authenticated users can view all user profiles';

-- allow anonymous users to view user profiles (for public content)
create policy "select_users_anon" on public.users
  for select
  to anon
  using (true);

comment on policy "select_users_anon" on public.users is 
  'Anonymous users can view all user profiles for public content attribution';

-- only allow users to insert their own profile during registration
create policy "insert_users_authenticated" on public.users
  for insert
  to authenticated
  with check (auth.uid() = id);

comment on policy "insert_users_authenticated" on public.users is 
  'Users can only create their own profile record during registration';

-- users can update their own profile (but not role - role updates handled separately)
create policy "update_users_authenticated" on public.users
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

comment on policy "update_users_authenticated" on public.users is 
  'Users can update their own profile data';

-- ============================================================================
-- 6.2 BRANDS TABLE
-- ============================================================================

alter table public.brands enable row level security;

-- allow all users (authenticated and anonymous) to view brands
create policy "select_brands_authenticated" on public.brands
  for select
  to authenticated
  using (true);

comment on policy "select_brands_authenticated" on public.brands is 
  'All authenticated users can view brands for filtering';

create policy "select_brands_anon" on public.brands
  for select
  to anon
  using (true);

comment on policy "select_brands_anon" on public.brands is 
  'Anonymous users can view brands for filtering';

-- only admins can insert brands
create policy "insert_brands_authenticated" on public.brands
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

comment on policy "insert_brands_authenticated" on public.brands is 
  'Only admin users can add new brands';

-- only admins can update brands
create policy "update_brands_authenticated" on public.brands
  for update
  to authenticated
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

comment on policy "update_brands_authenticated" on public.brands is 
  'Only admin users can modify brands';

-- only admins can delete brands
create policy "delete_brands_authenticated" on public.brands
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

comment on policy "delete_brands_authenticated" on public.brands is 
  'Only admin users can delete brands';

-- ============================================================================
-- 6.3 SIZE_TYPES TABLE
-- ============================================================================

alter table public.size_types enable row level security;

-- allow all users to view size types
create policy "select_size_types_authenticated" on public.size_types
  for select
  to authenticated
  using (true);

comment on policy "select_size_types_authenticated" on public.size_types is 
  'All authenticated users can view size types for filtering';

create policy "select_size_types_anon" on public.size_types
  for select
  to anon
  using (true);

comment on policy "select_size_types_anon" on public.size_types is 
  'Anonymous users can view size types for filtering';

-- only admins can modify size types
create policy "insert_size_types_authenticated" on public.size_types
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

comment on policy "insert_size_types_authenticated" on public.size_types is 
  'Only admin users can add new size types';

create policy "update_size_types_authenticated" on public.size_types
  for update
  to authenticated
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

comment on policy "update_size_types_authenticated" on public.size_types is 
  'Only admin users can modify size types';

create policy "delete_size_types_authenticated" on public.size_types
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

comment on policy "delete_size_types_authenticated" on public.size_types is 
  'Only admin users can delete size types';

-- ============================================================================
-- 6.4 AGE_CATEGORIES TABLE
-- ============================================================================

alter table public.age_categories enable row level security;

-- allow all users to view age categories
create policy "select_age_categories_authenticated" on public.age_categories
  for select
  to authenticated
  using (true);

comment on policy "select_age_categories_authenticated" on public.age_categories is 
  'All authenticated users can view age categories for filtering';

create policy "select_age_categories_anon" on public.age_categories
  for select
  to anon
  using (true);

comment on policy "select_age_categories_anon" on public.age_categories is 
  'Anonymous users can view age categories for filtering';

-- only admins can modify age categories
create policy "insert_age_categories_authenticated" on public.age_categories
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

comment on policy "insert_age_categories_authenticated" on public.age_categories is 
  'Only admin users can add new age categories';

create policy "update_age_categories_authenticated" on public.age_categories
  for update
  to authenticated
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

comment on policy "update_age_categories_authenticated" on public.age_categories is 
  'Only admin users can modify age categories';

create policy "delete_age_categories_authenticated" on public.age_categories
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

comment on policy "delete_age_categories_authenticated" on public.age_categories is 
  'Only admin users can delete age categories';

-- ============================================================================
-- 6.5 INGREDIENTS TABLE
-- ============================================================================

alter table public.ingredients enable row level security;

-- allow all users to view ingredients
create policy "select_ingredients_authenticated" on public.ingredients
  for select
  to authenticated
  using (true);

comment on policy "select_ingredients_authenticated" on public.ingredients is 
  'All authenticated users can view ingredients for filtering';

create policy "select_ingredients_anon" on public.ingredients
  for select
  to anon
  using (true);

comment on policy "select_ingredients_anon" on public.ingredients is 
  'Anonymous users can view ingredients for filtering';

-- only admins can modify ingredients
create policy "insert_ingredients_authenticated" on public.ingredients
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

comment on policy "insert_ingredients_authenticated" on public.ingredients is 
  'Only admin users can add new ingredients';

create policy "update_ingredients_authenticated" on public.ingredients
  for update
  to authenticated
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

comment on policy "update_ingredients_authenticated" on public.ingredients is 
  'Only admin users can modify ingredients';

create policy "delete_ingredients_authenticated" on public.ingredients
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

comment on policy "delete_ingredients_authenticated" on public.ingredients is 
  'Only admin users can delete ingredients';

-- ============================================================================
-- 6.6 ALLERGENS TABLE
-- ============================================================================

alter table public.allergens enable row level security;

-- allow all users to view allergens
create policy "select_allergens_authenticated" on public.allergens
  for select
  to authenticated
  using (true);

comment on policy "select_allergens_authenticated" on public.allergens is 
  'All authenticated users can view allergens for filtering';

create policy "select_allergens_anon" on public.allergens
  for select
  to anon
  using (true);

comment on policy "select_allergens_anon" on public.allergens is 
  'Anonymous users can view allergens for filtering';

-- only admins can modify allergens
create policy "insert_allergens_authenticated" on public.allergens
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

comment on policy "insert_allergens_authenticated" on public.allergens is 
  'Only admin users can add new allergens';

create policy "update_allergens_authenticated" on public.allergens
  for update
  to authenticated
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

comment on policy "update_allergens_authenticated" on public.allergens is 
  'Only admin users can modify allergens';

create policy "delete_allergens_authenticated" on public.allergens
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

comment on policy "delete_allergens_authenticated" on public.allergens is 
  'Only admin users can delete allergens';

-- ============================================================================
-- 6.7 FOODS TABLE
-- ============================================================================

alter table public.foods enable row level security;

-- allow all users to view foods (main filtering functionality)
create policy "select_foods_authenticated" on public.foods
  for select
  to authenticated
  using (true);

comment on policy "select_foods_authenticated" on public.foods is 
  'All authenticated users can browse and filter dog foods';

create policy "select_foods_anon" on public.foods
  for select
  to anon
  using (true);

comment on policy "select_foods_anon" on public.foods is 
  'Anonymous users can browse and filter dog foods';

-- only admins can insert foods
create policy "insert_foods_authenticated" on public.foods
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

comment on policy "insert_foods_authenticated" on public.foods is 
  'Only admin users can add new food products';

-- only admins can update foods
create policy "update_foods_authenticated" on public.foods
  for update
  to authenticated
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

comment on policy "update_foods_authenticated" on public.foods is 
  'Only admin users can modify food products';

-- only admins can delete foods
create policy "delete_foods_authenticated" on public.foods
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

comment on policy "delete_foods_authenticated" on public.foods is 
  'Only admin users can delete food products';

-- ============================================================================
-- 6.8 FOOD_INGREDIENTS TABLE (PIVOT)
-- ============================================================================

alter table public.food_ingredients enable row level security;

-- allow all users to view food-ingredient relationships
create policy "select_food_ingredients_authenticated" on public.food_ingredients
  for select
  to authenticated
  using (true);

comment on policy "select_food_ingredients_authenticated" on public.food_ingredients is 
  'All authenticated users can view food-ingredient relationships for filtering';

create policy "select_food_ingredients_anon" on public.food_ingredients
  for select
  to anon
  using (true);

comment on policy "select_food_ingredients_anon" on public.food_ingredients is 
  'Anonymous users can view food-ingredient relationships for filtering';

-- only admins can modify relationships
create policy "insert_food_ingredients_authenticated" on public.food_ingredients
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

comment on policy "insert_food_ingredients_authenticated" on public.food_ingredients is 
  'Only admin users can link ingredients to foods';

create policy "delete_food_ingredients_authenticated" on public.food_ingredients
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

comment on policy "delete_food_ingredients_authenticated" on public.food_ingredients is 
  'Only admin users can remove ingredient links from foods';

-- ============================================================================
-- 6.9 INGREDIENT_ALLERGENS TABLE (PIVOT)
-- ============================================================================

alter table public.ingredient_allergens enable row level security;

-- allow all users to view ingredient-allergen relationships
create policy "select_ingredient_allergens_authenticated" on public.ingredient_allergens
  for select
  to authenticated
  using (true);

comment on policy "select_ingredient_allergens_authenticated" on public.ingredient_allergens is 
  'All authenticated users can view ingredient-allergen mappings for filtering';

create policy "select_ingredient_allergens_anon" on public.ingredient_allergens
  for select
  to anon
  using (true);

comment on policy "select_ingredient_allergens_anon" on public.ingredient_allergens is 
  'Anonymous users can view ingredient-allergen mappings for filtering';

-- only admins can modify relationships
create policy "insert_ingredient_allergens_authenticated" on public.ingredient_allergens
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

comment on policy "insert_ingredient_allergens_authenticated" on public.ingredient_allergens is 
  'Only admin users can map ingredients to allergens';

create policy "delete_ingredient_allergens_authenticated" on public.ingredient_allergens
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

comment on policy "delete_ingredient_allergens_authenticated" on public.ingredient_allergens is 
  'Only admin users can remove allergen mappings from ingredients';

-- ============================================================================
-- 6.10 ARTICLES TABLE
-- ============================================================================

alter table public.articles enable row level security;

-- allow all users to view published articles
create policy "select_articles_authenticated" on public.articles
  for select
  to authenticated
  using (true);

comment on policy "select_articles_authenticated" on public.articles is 
  'All authenticated users can read educational articles';

create policy "select_articles_anon" on public.articles
  for select
  to anon
  using (true);

comment on policy "select_articles_anon" on public.articles is 
  'Anonymous users can read educational articles';

-- only admins can insert articles
create policy "insert_articles_authenticated" on public.articles
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

comment on policy "insert_articles_authenticated" on public.articles is 
  'Only admin users can create new articles';

-- only admins can update articles
create policy "update_articles_authenticated" on public.articles
  for update
  to authenticated
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

comment on policy "update_articles_authenticated" on public.articles is 
  'Only admin users can modify articles';

-- only admins can delete articles
create policy "delete_articles_authenticated" on public.articles
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

comment on policy "delete_articles_authenticated" on public.articles is 
  'Only admin users can delete articles';

-- ============================================================================
-- 7. TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ============================================================================

-- function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

comment on function public.handle_updated_at() is 
  'Automatically updates the updated_at timestamp on row modification';

-- apply trigger to all tables with updated_at column
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

