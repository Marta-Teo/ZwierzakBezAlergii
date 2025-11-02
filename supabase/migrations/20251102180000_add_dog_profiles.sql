-- ============================================================================
-- Migration: Add dog profiles and allergens tables
-- Purpose: Enable users to create personalized dog profiles with allergens
-- Related: dogs-view-implementation-plan.md
-- Date: 2025-11-02
-- ============================================================================

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

COMMENT ON FUNCTION public.update_updated_at_column() IS
  'Automatically updates the updated_at column to the current timestamp';

-- Trigger on dog_profiles
CREATE TRIGGER update_dog_profiles_updated_at
  BEFORE UPDATE ON public.dog_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

