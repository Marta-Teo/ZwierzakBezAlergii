# 🚀 Szybkie dodanie składnika "suszone białko drobiowe"

## 📋 Co robi ten SQL:

1. ✅ Dodaje składnik **"suszone białko drobiowe"** do tabeli `ingredients`
2. ✅ Łączy go z alergenami: **drób, kurczak, indyk, kaczka, gęś, przepiórka**
3. ✅ Dodaje do karmy **Josera Sensi Plus**
4. ✅ Pokazuje weryfikację i podsumowanie

---

## 🎯 Jak wykonać:

### **Krok 1:** Otwórz Supabase Studio
http://127.0.0.1:54323

### **Krok 2:** Przejdź do **SQL Editor**

### **Krok 3:** Skopiuj i wklej plik:
📁 **`.ai/add-suszone-bialko-drobiowe.sql`**

### **Krok 4:** Kliknij **RUN** (Ctrl+Enter)

---

## ✅ Rezultat:

Powinieneś zobaczyć komunikaty:
```
NOTICE: ID składnika "suszone białko drobiowe": 163
NOTICE:   ✓ Połączono z alergenem ID 12: kurczak
NOTICE:   ✓ Połączono z alergenem ID 15: indyk
NOTICE:   ✓ Połączono z alergenem ID 18: kaczka
... (itd)
NOTICE: Dodano 5-8 powiązań z alergenami
NOTICE: ✓ Dodano składnik do karmy: Josera Sensi Plus
NOTICE: ===========================================
NOTICE: PODSUMOWANIE: suszone białko drobiowe
NOTICE: ID składnika: 163
NOTICE: Połączonych alergenów: 5-8
NOTICE: Karm zawierających składnik: 1
NOTICE: ===========================================
```

Plus 2 tabele z weryfikacją:
1. **Składnik + alergeny**
2. **Karmy zawierające składnik**

---

## 🧪 Test:

### 1. Sprawdź w widoku:
http://localhost:3000/foods

### 2. Znajdź **Josera Sensi Plus**

### 3. Kliknij → Modal → Sprawdź:
- ✅ Lista składników zawiera **"suszone białko drobiowe"**
- ✅ Lista alergenów zawiera **kurczak, indyk, kaczka** (itd)

---

## 🐛 Jeśli Josera Sensi Plus nie istnieje:

SQL pokaże dostępne karmy Josera i możesz ręcznie dodać:

```sql
-- Znajdź ID karmy (zastąp nazwą z listy)
SELECT id, name FROM foods WHERE name ILIKE '%josera%';

-- Dodaj składnik (zastąp 123 prawdziwym ID)
INSERT INTO food_ingredients (food_id, ingredient_id)
VALUES (
  123,  -- ID karmy
  (SELECT id FROM ingredients WHERE name = 'suszone białko drobiowe')
);
```

---

## ✨ Gotowe!

"Suszone białko drobiowe" jest w bazie i połączone z alergenami! 🎉

