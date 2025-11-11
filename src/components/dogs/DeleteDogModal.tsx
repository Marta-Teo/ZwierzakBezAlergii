import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Alert, AlertDescription } from "../ui/alert";
import { supabase } from "@/lib/supabase/client";

interface DeleteDogModalProps {
  dogId: number;
  dogName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * DeleteDogModal Component
 * Confirmation dialog for deleting a dog profile
 */
export function DeleteDogModal({ dogId, dogName, isOpen, onClose, onSuccess }: DeleteDogModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      // Delete dog profile (allergens will be deleted automatically via CASCADE)
      const { error: deleteError } = await supabase.from("dog_profiles").delete().eq("id", dogId);

      if (deleteError) throw deleteError;

      // Success
      onSuccess();
    } catch (err: any) {
      console.error("Delete error:", err);
      setError(err.message || "Wystąpił nieoczekiwany błąd");
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Usuń profil {dogName}?</DialogTitle>
          <DialogDescription>Ta akcja jest nieodwracalna. Wszystkie dane psa zostaną usunięte.</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Anuluj
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Usuń
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
