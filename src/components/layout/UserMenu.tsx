import { useState } from "react";
import { Dog, Heart, LogOut, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { supabase } from "@/lib/supabase/client";
import { getInitials } from "@/lib/auth/validation";

interface UserMenuProps {
  user: {
    email: string;
  };
  userRole?: "user" | "admin";
}

export function UserMenu({ user, userRole = "user" }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
      setIsLoggingOut(false);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full"
          aria-label="Menu użytkownika"
        >
          <Avatar>
            <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">Moje konto</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            {userRole === "admin" && (
              <span className="text-xs font-medium text-primary">Admin</span>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <a href="/dogs" className="cursor-pointer">
            <Dog className="mr-2 h-4 w-4" />
            Moje psy
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a href="/favorites" className="cursor-pointer">
            <Heart className="mr-2 h-4 w-4" />
            Ulubione karmy
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="cursor-pointer"
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Wylogowywanie...
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              Wyloguj
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

