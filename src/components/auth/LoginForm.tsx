import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { supabase } from "@/lib/supabase/client";
import { getAuthErrorMessage } from "@/lib/auth/errorMessages";
import { validateLoginForm } from "@/lib/auth/validation";

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({ redirectTo = "/foods" }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Client-side validation
      const validationError = validateLoginForm(email, password);
      if (validationError) {
        throw new Error(validationError);
      }

      // Supabase Auth login
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Success - full page reload to refresh SSR context
      window.location.href = redirectTo;
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-card rounded-lg shadow-lg p-8">
      {/* Logo/Heading */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">Zaloguj się</h1>
        <p className="text-muted-foreground">Wprowadź swoje dane aby kontynuować</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="twoj@email.pl"
            disabled={isLoading}
            autoComplete="email"
          />
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <Label htmlFor="password">Hasło</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            placeholder="••••••••"
            disabled={isLoading}
            autoComplete="current-password"
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
            "Zaloguj się"
          )}
        </Button>
      </form>

      {/* Register Link */}
      <div className="mt-6 text-center text-sm">
        Nie masz konta?{" "}
        <a href="/register" className="text-primary hover:underline font-medium">
          Zarejestruj się
        </a>
      </div>
    </div>
  );
}
