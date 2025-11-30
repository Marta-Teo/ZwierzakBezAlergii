import { useState } from "react";
import { Menu, Home, Package, BookOpen, Bot, Heart, Dog, LogIn, UserPlus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";

interface MobileMenuProps {
  isLoggedIn: boolean;
  userRole?: "user" | "admin";
}

/**
 * Menu mobilne dla nawigacji na małych ekranach
 * Wyświetla się jako hamburger menu, otwiera Sheet z linkami
 */
export function MobileMenu({ isLoggedIn, userRole = "user" }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Otwórz menu nawigacji">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[280px] p-0">
        <SheetHeader className="border-b px-4 py-4">
          <SheetTitle className="flex items-center gap-2">
            <span className="text-2xl">🐕</span>
            <span>ZwierzakBezAlergii</span>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col p-4" aria-label="Menu główne">
          {/* Główne linki nawigacyjne */}
          <div className="space-y-1">
            <NavLink href="/" icon={<Home className="h-5 w-5" />} onClick={closeMenu}>
              Strona główna
            </NavLink>
            <NavLink href="/foods" icon={<Package className="h-5 w-5" />} onClick={closeMenu}>
              Karmy
            </NavLink>
            <NavLink href="/articles" icon={<BookOpen className="h-5 w-5" />} onClick={closeMenu}>
              Artykuły
            </NavLink>
            <NavLink href="/asystent" icon={<Bot className="h-5 w-5" />} onClick={closeMenu} highlight>
              Asystent AI
            </NavLink>
          </div>

          {/* Separator */}
          <div className="my-4 border-t border-border" />

          {/* Linki dla zalogowanych */}
          {isLoggedIn ? (
            <div className="space-y-1">
              <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Moje konto</p>
              <NavLink href="/favorites" icon={<Heart className="h-5 w-5" />} onClick={closeMenu}>
                Ulubione karmy
              </NavLink>
              <NavLink href="/dogs" icon={<Dog className="h-5 w-5" />} onClick={closeMenu}>
                Moje psy
              </NavLink>
              {userRole === "admin" && (
                <>
                  <div className="my-2 border-t border-border" />
                  <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Administracja
                  </p>
                  <NavLink href="/admin/foods" icon={<Package className="h-5 w-5" />} onClick={closeMenu}>
                    Zarządzaj karmami
                  </NavLink>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <a href="/login" onClick={closeMenu}>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <LogIn className="h-5 w-5" />
                  Zaloguj się
                </Button>
              </a>
              <a href="/register" onClick={closeMenu}>
                <Button className="w-full justify-start gap-2">
                  <UserPlus className="h-5 w-5" />
                  Zarejestruj się
                </Button>
              </a>
            </div>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  highlight?: boolean;
}

function NavLink({ href, icon, children, onClick, highlight }: NavLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`
        flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors
        ${
          highlight
            ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700"
            : "text-foreground hover:bg-muted"
        }
      `}
    >
      {icon}
      {children}
    </a>
  );
}
