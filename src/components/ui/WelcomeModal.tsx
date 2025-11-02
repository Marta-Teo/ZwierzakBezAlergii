import { useEffect, useState } from "react";
import { Dog } from "lucide-react";
import { Button } from "./button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog";

/**
 * Welcome Modal
 * Displays once per session for new (non-logged-in) visitors
 * Encourages registration by highlighting personalized features
 */
export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if modal was already shown in this session
    const hasSeenModal = sessionStorage.getItem("welcome_modal_seen");
    if (!hasSeenModal) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("welcome_modal_seen", "true");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Dog className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl">
            Witaj w ZwierzakBezAlergii! 🐕
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Stwórz profil swojego psa i automatycznie filtruj karmy bezpieczne dla niego!
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          <div className="rounded-lg bg-muted/50 p-4 text-sm">
            <p className="mb-2 font-medium">Co zyskasz po rejestracji?</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>✓ Profile psów z alergenami</li>
              <li>✓ Lista ulubionych karm</li>
              <li>✓ Historia przeglądanych produktów</li>
            </ul>
          </div>

          <a href="/register" className="block">
            <Button className="w-full" size="lg" onClick={handleClose}>
              Stwórz konto
            </Button>
          </a>
          <Button variant="outline" className="w-full" onClick={handleClose}>
            Przeglądaj bez konta
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

