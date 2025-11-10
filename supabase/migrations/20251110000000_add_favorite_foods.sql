-- Migration: Add favorite_foods table
-- Description: Allows users to favorite foods for quick access
-- Date: 2025-11-10

-- ============================================================================
-- CREATE TABLE: favorite_foods
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.favorite_foods (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  food_id INTEGER NOT NULL REFERENCES public.foods(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Unikalny constraint (użytkownik + karma)
  CONSTRAINT unique_user_food UNIQUE(user_id, food_id)
);

-- ============================================================================
-- CREATE INDEXES
-- ============================================================================

-- Index dla szybkiego wyszukiwania po user_id (główny use case: lista ulubionych użytkownika)
CREATE INDEX IF NOT EXISTS idx_favorite_foods_user_id ON public.favorite_foods(user_id);

-- Index dla szybkiego wyszukiwania po food_id (use case: sprawdzenie czy karma jest ulubiona)
CREATE INDEX IF NOT EXISTS idx_favorite_foods_food_id ON public.favorite_foods(food_id);

-- Composite index dla szybkiego sprawdzania czy dana karma jest ulubioną danego użytkownika
CREATE INDEX IF NOT EXISTS idx_favorite_foods_user_food ON public.favorite_foods(user_id, food_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Włączenie RLS dla tabeli
ALTER TABLE public.favorite_foods ENABLE ROW LEVEL SECURITY;

-- Policy: użytkownik widzi tylko swoje ulubione karmy
CREATE POLICY "Users can view own favorites"
  ON public.favorite_foods
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: użytkownik może dodawać tylko swoje ulubione karmy
CREATE POLICY "Users can add own favorites"
  ON public.favorite_foods
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: użytkownik może usuwać tylko swoje ulubione karmy
CREATE POLICY "Users can delete own favorites"
  ON public.favorite_foods
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.favorite_foods IS 'Stores user favorite foods for quick access';
COMMENT ON COLUMN public.favorite_foods.user_id IS 'Reference to the user who favorited the food';
COMMENT ON COLUMN public.favorite_foods.food_id IS 'Reference to the favorited food';
COMMENT ON COLUMN public.favorite_foods.created_at IS 'Timestamp when the food was added to favorites';

