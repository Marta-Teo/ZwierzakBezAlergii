# Aktualizacja składu karm - Instrukcja

## Sposób 1: Użycie pliku konfiguracyjnego (ZALECANY)

**Zalety:**
- ✅ Zachowuje polskie znaki (ą, ć, ę, ł, ń, ó, ś, ź, ż)
- ✅ Łatwe w edycji
- ✅ Brak problemów z kodowaniem w PowerShell

**Kroki:**

1. **Edytuj plik** `scripts/food-update-config.json`:

```json
{
  "foodName": "Brit Care Bezzbożowa Łosoś z Ziemniakiem",
  "ingredients": "Łosoś, ziemniaki, suszona pulpa jabłkowa, tłuszcz z kurczaka, olej z łososia, mączka grochowa, glukozamina, siarczan chondroityny, probiotyk"
}
```

2. **Uruchom skrypt**:

```bash
npm run food:update
```

lub

```bash
npm run food:update --config
```

## Sposób 2: Argumenty w linii poleceń

**Uwaga:** Ten sposób może mieć problemy z polskimi znakami w PowerShell!

```bash
npm run food:update "Nazwa karmy" "składnik1, składnik2, składnik3"
```

## Co robi skrypt?

1. **Znajduje karmę** w bazie danych (obsługuje częściowe dopasowanie nazwy)
2. **Parsuje składniki** - usuwa procenty i ilości w nawiasach
3. **Sprawdza istniejące składniki** w bazie
4. **Dodaje nowe składniki** używając `upsert` (bezpieczne dla duplikatów)
5. **Mapuje składniki na alergeny** według wbudowanej tabeli
6. **Aktualizuje powiązania** karma-składnik

## Po aktualizacji

Jeśli chcesz zapisać zmiany do pliku seed.sql:

```bash
npm run db:export
```

## Przykłady składników

Skrypt automatycznie:
- Usuwa procenty: `"suszona jagnięcina (42%)"` → `"suszona jagnięcina"`
- Usuwa jednostki: `"glukozamina (300 mg/kg)"` → `"glukozamina"`
- Normalizuje nazwy specjalne: `"probiotyk"` → `"probiotyki"`
- Łączy duplikaty

## Troubleshooting

### Problem: "Nie znaleziono karmy"
- Sprawdź dokładną nazwę w bazie
- Skrypt próbuje częściowego dopasowania
- Lista dostępnych karm zostanie wyświetlona przy błędzie

### Problem: "duplicate key value violates unique constraint"
- ✅ **ROZWIĄZANE** - skrypt używa teraz `upsert` zamiast `insert`

### Problem: Polskie znaki są źle wyświetlane
- ✅ Użyj pliku konfiguracyjnego (`food-update-config.json`)
- Upewnij się że plik jest zapisany w UTF-8

