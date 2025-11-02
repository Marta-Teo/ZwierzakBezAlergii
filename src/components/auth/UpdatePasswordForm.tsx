import { useState, type FormEvent } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { supabase } from "@/lib/supabase/client";
import { getAuthErrorMessage } from "@/lib/auth/errorMessages";
import {
  validatePasswordStrict,
  validatePasswordConfirmation,
  getPasswordStrength,
  type PasswordStrength,
} from "@/lib/auth/validation";

export function UpdatePasswordForm() {
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
      const passwordError = validatePasswordStrict(password);
      if (passwordError) {
        throw new Error(passwordError);
      }

      const confirmError = validatePasswordConfirmation(
        password,
        confirmPassword
      );
      if (confirmError) {
        throw new Error(confirmError);
      }

      // Supabase Auth update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) throw updateError;

      setSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err: any) {
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
        <h2 className="text-2xl font-bold mb-2">Hasło zostało zmienione!</h2>
        <p className="text-muted-foreground mb-4">
          Za chwilę zostaniesz przekierowany do strony logowania.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-card rounded-lg shadow-lg p-8">
      {/* Logo/Heading */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">Ustaw nowe hasło</h1>
        <p className="text-muted-foreground">
          Wprowadź nowe hasło do swojego konta
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Password Input */}
        <div className="space-y-2">
          <Label htmlFor="password">Nowe hasło</Label>
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
                  className={`h-1 flex-1 rounded ${
                    passwordStrength === "weak" ? strengthColors.weak : "bg-gray-200"
                  }`}
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
                    passwordStrength === "strong"
                      ? strengthColors.strong
                      : "bg-gray-200"
                  }`}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Siła hasła: {strengthLabels[passwordStrength]}
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Potwierdź nowe hasło</Label>
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
              Zapisywanie...
            </>
          ) : (
            "Zmień hasło"
          )}
        </Button>
      </form>
    </div>
  );
}

