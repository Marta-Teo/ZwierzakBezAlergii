import { vi } from "vitest";

/**
 * Mock dla klienta Supabase
 * Użyj tego w testach gdzie potrzebujesz zamockować Supabase
 *
 * Przykład użycia:
 * ```ts
 * import { mockSupabaseClient } from '@/test/mocks/supabase';
 *
 * vi.mock('@/db/supabase.client', () => ({
 *   createClient: vi.fn(() => mockSupabaseClient)
 * }));
 * ```
 */
export const mockSupabaseClient = {
  auth: {
    getUser: vi.fn(),
    getSession: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    signUp: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    like: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    contains: vi.fn().mockReturnThis(),
    containedBy: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn(),
    maybeSingle: vi.fn(),
  })),
};

/**
 * Helper do mockowania odpowiedzi z Supabase
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createSupabaseResponse = <T>(data: T, error: any = null) => ({
  data,
  error,
  count: null,
  status: error ? 400 : 200,
  statusText: error ? "Bad Request" : "OK",
});
