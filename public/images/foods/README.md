# 📸 Folder na obrazki karm

## Struktura plików

Dodawaj tutaj obrazki opakowań karm w formacie:
```
{marka}-{nazwa-karmy}.jpg
```

## Zalecane parametry obrazków:

### Dla miniatur (grid 4:3):
- **Rozmiar:** 600x450px
- **Format:** JPG lub WebP
- **Kompresja:** 80-85% jakości
- **Rozmiar pliku:** < 100KB

### Dla dużych zdjęć (modal 16:9):
- **Rozmiar:** 800x450px
- **Format:** JPG lub WebP
- **Kompresja:** 85-90% jakości
- **Rozmiar pliku:** < 150KB

## Przykładowe nazwy:

```
royal-canin-medium-adult.jpg
brit-care-large-breed.jpg
purina-pro-plan-sensitive.jpg
acana-heritage-puppy.jpg
hills-science-diet-adult.jpg
```

## Jak dodać obrazek do karmy:

### Opcja 1: SQL w Supabase Studio
```sql
UPDATE foods 
SET image_url = '/images/foods/nazwa-pliku.jpg'
WHERE id = 1;
```

### Opcja 2: Table Editor w Supabase Studio
1. Otwórz tabelę `foods`
2. Kliknij w wiersz karmy
3. W polu `image_url` wpisz: `/images/foods/nazwa-pliku.jpg`
4. Save

## Testowanie:

Po dodaniu sprawdź w przeglądarce:
```
http://localhost:3000/images/foods/nazwa-pliku.jpg
```

Jeśli obrazek się wyświetla - URL jest poprawny!

---

## Placeholder (testowy)

Jeśli nie masz prawdziwych zdjęć, użyj tymczasowo:
```
https://via.placeholder.com/600x450/3B82F6/FFFFFF?text=Nazwa+Karmy
```

Kolory (zmień hex):
- Niebieski: 3B82F6
- Zielony: 10B981
- Fioletowy: 8B5CF6
- Pomarańczowy: F59E0B

