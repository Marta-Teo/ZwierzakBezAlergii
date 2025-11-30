import { useState, type FormEvent } from "react";
import { CheckCircle, Loader2, X, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { supabase } from "@/lib/supabase/client";
import { getAuthErrorMessage } from "@/lib/auth/errorMessages";
import { validateRegisterForm, getPasswordStrength, type PasswordStrength } from "@/lib/auth/validation";

interface RegisterFormProps {
  redirectTo?: string;
}

// Helper component for password requirements
function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {met ? (
        <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
      ) : (
        <X className="w-3 h-3 text-red-500 flex-shrink-0" />
      )}
      <span className={met ? "text-green-600" : "text-muted-foreground"}>{text}</span>
    </div>
  );
}

export function RegisterForm({ redirectTo = "/foods" }: RegisterFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const passwordStrength: PasswordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Client-side validation
      const validationError = validateRegisterForm(email, password, confirmPassword);
      if (validationError) {
        throw new Error(validationError);
      }

      // Supabase Auth registration
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      setSuccess(true);

      // If email verification is disabled, user is automatically logged in
      if (data.session) {
        setTimeout(() => {
          window.location.href = redirectTo;
        }, 2000);
      }
    } catch (err: unknown) {
      console.error("Registration error:", err);
      setError(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicator colors
  const strengthColors: Record<PasswordStrength, string> = {
    weak: "bg-red-500",
    medium: "bg-yellow-500",
    strong: "bg-green-500",
  };

  const strengthLabels: Record<PasswordStrength, string> = {
    weak: "Słabe",
    medium: "Średnie",
    strong: "Silne",
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto bg-card rounded-lg shadow-lg p-8 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Rejestracja udana!</h2>
        
        <div className="text-left bg-muted/50 rounded-lg p-4 mb-4">
          <p className="font-medium mb-2">📧 Link aktywacyjny został wysłany na adres:</p>
          <p className="text-primary font-semibold mb-3">{email}</p>
          
          <p className="font-medium mb-2">Co teraz?</p>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
            <li>Otwórz swoją skrzynkę email</li>
            <li>Znajdź wiadomość od ZwierzakBezAlergii</li>
            <li>Kliknij link aktywacyjny w wiadomości</li>
            <li>Po aktywacji możesz się zalogować</li>
          </ol>
        </div>

        <div className="text-sm text-muted-foreground bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-4">
          <p className="font-medium text-amber-700 dark:text-amber-400 mb-1">⚠️ Nie widzisz emaila?</p>
          <ul className="text-amber-600 dark:text-amber-500 space-y-1">
            <li>• Sprawdź folder <strong>Spam</strong> lub <strong>Oferty</strong></li>
            <li>• Email może dotrzeć w ciągu kilku minut</li>
            <li>• Upewnij się, że adres email jest poprawny</li>
          </ul>
        </div>

        <a href="/login" className="inline-block text-primary hover:underline font-medium">
          Przejdź do logowania →
        </a>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-card rounded-lg shadow-lg p-8">
      {/* Logo/Heading */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">Zarejestruj się</h1>
        <p className="text-muted-foreground">Stwórz konto aby korzystać z pełni możliwości</p>
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
            autoComplete="new-password"
          />

          {/* Password Strength Indicator */}
          {password && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1">
                <div
                  className={`h-1 flex-1 rounded ${passwordStrength === "weak" ? strengthColors.weak : "bg-gray-200"}`}
                />
                <div
                  className={`h-1 flex-1 rounded ${
                    passwordStrength === "medium"
                      ? strengthColors.medium
                      : passwordStrength === "strong"
                        ? strengthColors.strong
                        : "bg-gray-200"
                  }`}
                />
                <div
                  className={`h-1 flex-1 rounded ${
                    passwordStrength === "strong" ? strengthColors.strong : "bg-gray-200"
                  }`}
                />
              </div>
              <p className="text-xs text-muted-foreground">Siła hasła: {strengthLabels[passwordStrength]}</p>

              {/* Password Requirements */}
              <div className="mt-2 space-y-1 text-xs">
                <p className="font-medium text-muted-foreground mb-1">Wymagania:</p>
                <div className="space-y-0.5">
                  <RequirementItem met={password.length >= 8} text="Minimum 8 znaków" />
                  <RequirementItem met={/[A-Z]/.test(password)} text="Wielka litera" />
                  <RequirementItem met={/[a-z]/.test(password)} text="Mała litera" />
                  <RequirementItem met={/\d/.test(password)} text="Cyfra" />
                  <RequirementItem met={/[!@#$%^&*(),.?":{}|<>]/.test(password)} text="Znak specjalny (!@#$%...)" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
          <Input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            placeholder="••••••••"
            disabled={isLoading}
            autoComplete="new-password"
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Rejestracja...
            </>
          ) : (
            "Zarejestruj się"
          )}
        </Button>
      </form>

      {/* Login Link */}
      <div className="mt-6 text-center text-sm">
        Masz już konto?{" "}
        <a href="/login" className="text-primary hover:underline font-medium">
          Zaloguj się
        </a>
      </div>
    </div>
  );
}
