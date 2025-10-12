# Schemat bazy danych PostgreSQL dla ZwierzakBezAlergii (MVP)

## 1. Tabele z kolumnami, typami danych i ograniczeniami

### 1.1 users

Ta tabela będzi eobsługiwana przez Supabase Auth.

- `id` UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
- `role` VARCHAR NOT NULL DEFAULT 'user'
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 1.2 brands
- `id` SERIAL PRIMARY KEY
- `name` TEXT NOT NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 1.3 size_types
- `id` SERIAL PRIMARY KEY
- `name` TEXT NOT NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 1.4 age_categories
- `id` SERIAL PRIMARY KEY
- `name` TEXT NOT NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 1.5 ingredients
- `id` SERIAL PRIMARY KEY
- `name` TEXT NOT NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 1.6 allergens
- `id` SERIAL PRIMARY KEY
- `name` TEXT NOT NULL
- `parent_id` INT REFERENCES allergens(id) ON DELETE SET NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 1.7 foods
- `id` SERIAL PRIMARY KEY
- `name` TEXT NOT NULL
- `brand_id` INT NOT NULL REFERENCES brands(id) ON DELETE RESTRICT
- `size_type_id` INT REFERENCES size_types(id) ON DELETE RESTRICT
- `age_category_id` INT REFERENCES age_categories(id) ON DELETE RESTRICT
- `ingredients_raw` TEXT
- `created_by` UUID REFERENCES users(id)
- `updated_by` UUID REFERENCES users(id)
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 1.8 food_ingredients (pivot)
- `food_id` INT NOT NULL REFERENCES foods(id) ON DELETE CASCADE
- `ingredient_id` INT NOT NULL REFERENCES ingredients(id) ON DELETE NO ACTION
- PRIMARY KEY (`food_id`, `ingredient_id`)

### 1.9 ingredient_allergens (pivot)
- `ingredient_id` INT NOT NULL REFERENCES ingredients(id) ON DELETE NO ACTION
- `allergen_id` INT NOT NULL REFERENCES allergens(id) ON DELETE NO ACTION
- PRIMARY KEY (`ingredient_id`, `allergen_id`)

### 1.10 articles
- `id` SERIAL PRIMARY KEY
- `title` TEXT NOT NULL
- `slug` TEXT NOT NULL UNIQUE
- `content` TEXT NOT NULL
- `author_id` UUID REFERENCES users(id)
- `created_by` UUID REFERENCES users(id)
- `updated_by` UUID REFERENCES users(id)
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

## 2. Relacje między tabelami

- `users(1)` → `foods(N)` (via `created_by`, `updated_by`)
- `users(1)` → `articles(N)` (via `author_id`, `created_by`, `updated_by`)
- `brands(1)` → `foods(N)` (via `brand_id`)
- `size_types(1)` → `foods(N)` (via `size_type_id`)
- `age_categories(1)` → `foods(N)` (via `age_category_id`)
- `foods(N)` ↔ `ingredients(N)` (pivot `food_ingredients`)
- `ingredients(N)` ↔ `allergens(N)` (pivot `ingredient_allergens`)
- `allergens(1)` → `allergens(N)` (self-referential `parent_id`)

## 3. Indeksy dla wydajności

- `CREATE INDEX ON foods(brand_id);`
- `CREATE INDEX ON foods(size_type_id);`
- `CREATE INDEX ON foods(age_category_id);`
- `CREATE INDEX idx_ingredients_name ON ingredients USING GIN(to_tsvector('simple', name));`
- `CREATE INDEX idx_foods_ingredients_raw ON foods USING GIN(to_tsvector('simple', ingredients_raw));`

## 4. Zasady PostgreSQL (RLS)

### 4.1 Tabela foods
- `ALTER TABLE foods ENABLE ROW LEVEL SECURITY;`
- POLICY `select_foods`: `FOR SELECT USING (true)`
- POLICY `insert_foods`: `FOR INSERT WITH CHECK (auth.role() = 'admin')`
- POLICY `update_foods`: `FOR UPDATE USING (auth.role() = 'admin') WITH CHECK (auth.role() = 'admin')`
- POLICY `delete_foods`: `FOR DELETE USING (auth.role() = 'admin')`

### 4.2 Tabela articles
- `ALTER TABLE articles ENABLE ROW LEVEL SECURITY;`
- POLICY `select_articles`: `FOR SELECT USING (true)`
- POLICY `insert_articles`: `FOR INSERT WITH CHECK (auth.role() = 'admin')`
- POLICY `update_articles`: `FOR UPDATE USING (auth.role() = 'admin') WITH CHECK (auth.role() = 'admin')`
- POLICY `delete_articles`: `FOR DELETE USING (auth.role() = 'admin')`

## 5. Dodatkowe uwagi

- Brak unikalności nazwy karmy w ramach marki (zgodnie z decyzją użytkownika).
- Pola `size_type_id` i `age_category_id` mogą być NULL, aby obsłużyć karmy bez podziału.
- Brak dodatkowych ograniczeń CHECK/NOT NULL na tych polach.
- Partycjonowanie odłożone na przyszłość (możliwość range/list partitioning).
- Wymagania backupu i retencji danych wymagają doprecyzowania.
