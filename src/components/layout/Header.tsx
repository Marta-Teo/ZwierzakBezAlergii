import type { User } from "@supabase/supabase-js";
import { Button } from "../ui/button";
import { UserMenu } from "./UserMenu";

interface HeaderProps {
  user: User | null;
  userRole?: "user" | "admin";
}

export function Header({ user, userRole = "user" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-2 hover:opacity-80">
          <span className="text-2xl">🐕</span>
          <span className="font-bold text-xl hidden sm:inline-block">
            ZwierzakBezAlergii
          </span>
        </a>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a
            href="/foods"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Karmy
          </a>
          <a
            href="/articles"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Artykuły
          </a>
          <a
            href="/asystent"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Asystent AI
          </a>
        </nav>

        {/* Auth Buttons / User Menu */}
        <div className="flex items-center gap-3">
          {user ? (
            <UserMenu
              user={{ email: user.email || "" }}
              userRole={userRole}
            />
          ) : (
            <>
              <a href="/login">
                <Button variant="ghost" size="sm">
                  Zaloguj się
                </Button>
              </a>
              <a href="/register">
                <Button size="sm">Zarejestruj się</Button>
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

