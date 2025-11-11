import { useState, type FormEvent } from "react";
import { Loader2, Mail } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { supabase } from "@/lib/supabase/client";
import { getAuthErrorMessage } from "@/lib/auth/errorMessages";
import { validateEmail } from "@/lib/auth/validation";

export function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Client-side validation
      const validationError = validateEmail(email);
      if (validationError) {
        throw new Error(validationError);
      }

      // Supabase Auth password reset
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (resetError) throw resetError;

      setSuccess(true);
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto bg-card rounded-lg shadow-lg p-8 text-center">
        <Mail className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Sprawdź swoją skrzynkę</h2>
        <p className="text-muted-foreground mb-4">
          Wysłaliśmy link do resetowania hasła na adres <strong>{email}</strong>.
        </p>
        <p className="text-sm text-muted-foreground">
          Nie otrzymałeś emaila? Sprawdź folder spam lub{" "}
          <button
            onClick={() => {
              setSuccess(false);
              setEmail("");
            }}
            className="text-primary hover:underline"
          >
            wyślij ponownie
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-card rounded-lg shadow-lg p-8">
      {/* Logo/Heading */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">Resetuj hasło</h1>
        <p className="text-muted-foreground">Wprowadź swój email aby otrzymać link do resetowania hasła</p>
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

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Wysyłanie...
            </>
          ) : (
            "Wyślij link"
          )}
        </Button>
      </form>

      {/* Back to Login Link */}
      <div className="mt-6 text-center text-sm">
        <a href="/login" className="text-primary hover:underline">
          Powrót do logowania
        </a>
      </div>
    </div>
  );
}
