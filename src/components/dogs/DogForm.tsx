import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Alert, AlertDescription } from "../ui/alert";
import { supabase } from "@/lib/supabase/client";
import type {
  SizeTypeDTO,
  AgeCategoryDTO,
  AllergenDTO,
  UpdateDogProfileDTO,
} from "@/types";
import { validateDogForm, sanitizeDogName } from "@/lib/dogs/validation";

interface DogFormProps {
  mode: "create" | "edit";
  initialData?: UpdateDogProfileDTO;
  sizeTypes: SizeTypeDTO[];
  ageCategories: AgeCategoryDTO[];
  allergens: AllergenDTO[];
}

/**
 * DogForm Component
 * Form for creating and editing dog profiles
 */
export function DogForm({
  mode,
  initialData,
  sizeTypes,
  ageCategories,
  allergens,
}: DogFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [sizeTypeId, setSizeTypeId] = useState<number | null>(
    initialData?.size_type_id || null
  );
  const [ageCategoryId, setAgeCategoryId] = useState<number | null>(
    initialData?.age_category_id || null
  );
  const [allergenIds, setAllergenIds] = useState<number[]>(
    initialData?.allergen_ids || []
  );
  const [notes, setNotes] = useState(initialData?.notes || "");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAllergenToggle = (allergenId: number) => {
    setAllergenIds((prev) =>
      prev.includes(allergenId)
        ? prev.filter((id) => id !== allergenId)
        : [...prev, allergenId]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("Musisz być zalogowany aby wykonać tę akcję");
      }

      // Sanitize and validate
      const sanitizedName = sanitizeDogName(name);
      const validationError = validateDogForm({
        name: sanitizedName,
        size_type_id: sizeTypeId,
        age_category_id: ageCategoryId,
        allergen_ids: allergenIds,
        notes: notes || null,
      });

      if (validationError) {
        throw new Error(validationError);
      }

      if (mode === "create") {
        // 1. Insert dog profile
        const { data: newDog, error: profileError } = await supabase
          .from("dog_profiles")
          .insert({
            user_id: user.id,
            name: sanitizedName,
            size_type_id: sizeTypeId,
            age_category_id: ageCategoryId,
            notes: notes || null,
          })
          .select()
          .single();

        if (profileError) throw profileError;

        // 2. Insert allergens
        if (allergenIds.length > 0) {
          const allergenInserts = allergenIds.map((allergenId) => ({
            dog_id: newDog.id,
            allergen_id: allergenId,
          }));

          const { error: allergensError } = await supabase
            .from("dog_allergens")
            .insert(allergenInserts);

          if (allergensError) throw allergensError;
        }
      } else {
        // Edit mode - update profile
        const { error: updateError } = await supabase
          .from("dog_profiles")
          .update({
            name: sanitizedName,
            size_type_id: sizeTypeId,
            age_category_id: ageCategoryId,
            notes: notes || null,
          })
          .eq("id", initialData!.id);

        if (updateError) throw updateError;

        // Update allergens (delete all, then re-insert)
        await supabase
          .from("dog_allergens")
          .delete()
          .eq("dog_id", initialData!.id);

        if (allergenIds.length > 0) {
          const allergenInserts = allergenIds.map((allergenId) => ({
            dog_id: initialData!.id,
            allergen_id: allergenId,
          }));

          const { error: allergensError } = await supabase
            .from("dog_allergens")
            .insert(allergenInserts);

          if (allergensError) throw allergensError;
        }
      }

      // Success - redirect
      window.location.href = "/dogs";
    } catch (err: any) {
      console.error("Dog form error:", err);
      setError(err.message || "Wystąpił nieoczekiwany błąd");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Name Input */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Imię psa <span className="text-destructive">*</span>
        </Label>
        <Input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={50}
          placeholder="np. Burek"
          disabled={isLoading}
          autoComplete="off"
        />
        <p className="text-xs text-muted-foreground">
          Tylko litery, spacje i myślniki (maksymalnie 50 znaków)
        </p>
      </div>

      {/* Size Select */}
      <div className="space-y-2">
        <Label htmlFor="size_type">Rozmiar psa</Label>
        <Select
          value={sizeTypeId?.toString() || ""}
          onValueChange={(value) => setSizeTypeId(value ? parseInt(value) : null)}
          disabled={isLoading}
        >
          <SelectTrigger id="size_type">
            <SelectValue placeholder="Wybierz rozmiar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="clear">Brak</SelectItem>
            {sizeTypes.map((sizeType) => (
              <SelectItem key={sizeType.id} value={sizeType.id.toString()}>
                {sizeType.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Age Select */}
      <div className="space-y-2">
        <Label htmlFor="age_category">Wiek psa</Label>
        <Select
          value={ageCategoryId?.toString() || ""}
          onValueChange={(value) =>
            setAgeCategoryId(value ? parseInt(value) : null)
          }
          disabled={isLoading}
        >
          <SelectTrigger id="age_category">
            <SelectValue placeholder="Wybierz wiek" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="clear">Brak</SelectItem>
            {ageCategories.map((ageCategory) => (
              <SelectItem key={ageCategory.id} value={ageCategory.id.toString()}>
                {ageCategory.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Allergens Checkboxes */}
      <div className="space-y-2">
        <Label>Znane alergeny</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 border rounded-md max-h-96 overflow-y-auto">
          {allergens.map((allergen) => (
            <div key={allergen.id} className="flex items-center space-x-2">
              <Checkbox
                id={`allergen-${allergen.id}`}
                checked={allergenIds.includes(allergen.id)}
                onCheckedChange={() => handleAllergenToggle(allergen.id)}
                disabled={isLoading}
              />
              <label
                htmlFor={`allergen-${allergen.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {allergen.name}
              </label>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Wybrane: {allergenIds.length}
        </p>
      </div>

      {/* Notes Textarea */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notatki</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={500}
          placeholder="Dodatkowe informacje o Twoim psie..."
          disabled={isLoading}
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          {notes.length}/500 znaków
        </p>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Dodaj psa" : "Zapisz zmiany"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => (window.location.href = "/dogs")}
          disabled={isLoading}
        >
          Anuluj
        </Button>
      </div>
    </form>
  );
}

