# 🖼️ Grafika tła dla strony głównej

Ten folder zawiera obrazy używane jako tło dla sekcji hero na stronie głównej.

## 📋 Jak zmienić tło strony głównej

### Metoda 1: Zamiana pliku (najszybsza)

1. **Przygotuj swój obraz:**
   - Zalecane wymiary: **1920x1080px** lub większe (Full HD+)
   - Zalecane formaty: `.jpg`, `.webp` (najlepszy dla wydajności), `.png`
   - Rozmiar pliku: max 500KB (zoptymalizowany)

2. **Zamień plik:**
   - Usuń lub zmień nazwę obecnego pliku `background.jpg`
   - Umieść swój nowy obraz jako `background.jpg` w tym folderze
   - Odśwież stronę (może być potrzebny twardy reload: Ctrl+Shift+R)

### Metoda 2: Dodanie nowego pliku

1. **Dodaj swój obraz** do tego folderu (np. `my-custom-background.webp`)

2. **Edytuj konfigurację** w pliku `src/config/hero.ts`:
   ```typescript
   background: {
     image: "/images/hero/my-custom-background.webp", // ← Zmień tutaj
     overlay: "dark",
     overlayOpacity: 0.7,
   }
   ```

3. **Odśwież stronę** w przeglądarce

## 🎨 Dostosowanie overlaya (gradientu)

W pliku `src/config/hero.ts` możesz dostosować gradient na obrazie:

```typescript
background: {
  image: "/images/hero/background.jpg",
  
  // Typ gradientu:
  overlay: "dark",  // Opcje: "dark", "light", "none"
  // - "dark" → dla jasnych zdjęć (dodaje ciemny gradient)
  // - "light" → dla ciemnych zdjęć (dodaje jasny gradient)
  // - "none" → brak gradientu
  
  // Intensywność gradientu (0.0 - 1.0):
  overlayOpacity: 0.7,  // 0.0 = przezroczysty, 1.0 = pełna moc
}
```

## 💡 Wskazówki

### Wybór odpowiedniego obrazu:
- ✅ **Dobrze:** Rozmyte tło, spokojne kolory, niski kontrast
- ✅ **Dobrze:** Obraz z dużą przestrzenią (nie za dużo szczegółów)
- ❌ **Unikaj:** Bardzo szczegółowych obrazów (zagłuszają tekst)
- ❌ **Unikaj:** Zbyt jasnych lub ciemnych obrazów bez overlaya

### Optymalizacja wydajności:
1. **Użyj formatu WebP** (najlepsze: mały rozmiar + dobra jakość)
   - Konwersja online: https://squoosh.app
   
2. **Kompresuj obraz** aby zmniejszyć czas ładowania
   - Jakość 80-85% to sweet spot
   
3. **Rozmiar pliku:**
   - Cel: < 200KB (bardzo dobrze)
   - Max: 500KB (akceptowalne)

### Narzędzia do optymalizacji:
- **Squoosh** (https://squoosh.app) - konwersja i kompresja
- **TinyPNG** (https://tinypng.com) - kompresja PNG/JPG
- **GIMP / Photoshop** - profesjonalne narzędzia

## 🚫 Wyłączenie tła

Jeśli chcesz **wyłączyć tło** i używać tylko koloru:

W pliku `src/config/hero.ts`:
```typescript
background: {
  image: null,  // ← Ustaw na null
  overlay: "dark",
  overlayOpacity: 0.7,
}
```

## 📷 Dobre źródła darmowych zdjęć

- **Unsplash**: https://unsplash.com (szukaj: "dog food", "pet", "dog")
- **Pexels**: https://pexels.com
- **Pixabay**: https://pixabay.com

## 🆘 Problemy?

### Obraz się nie wyświetla:
1. Sprawdź nazwę pliku (wielkość liter ma znaczenie!)
2. Sprawdź ścieżkę w `hero.ts`
3. Odśwież stronę (Ctrl+Shift+R)
4. Sprawdź konsolę przeglądarki (F12) pod kątem błędów

### Tekst jest nieczytelny:
1. Zwiększ `overlayOpacity` do 0.8 lub 0.9
2. Zmień `overlay` z "dark" na "light" (lub odwrotnie)
3. Wybierz inny obraz z lepszym kontrastem

### Strona ładuje się wolno:
1. Zmniejsz rozmiar pliku (kompresja)
2. Użyj formatu `.webp` zamiast `.jpg`
3. Zmniejsz wymiary obrazu (max 1920px szerokości)

---

**Powodzenia! 🎨**

