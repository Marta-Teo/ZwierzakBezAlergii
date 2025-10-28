# 🚀 Szybki Start - Asystent Żywieniowy

## 1️⃣ Skonfiguruj API Key (jeśli jeszcze nie zrobiłeś)

Utwórz plik `.env` w katalogu głównym:

```bash
OPENROUTER_API_KEY=sk-or-v1-twoj-klucz-tutaj
PUBLIC_APP_NAME=ZwierzakBezAlergii
PUBLIC_SITE_URL=https://zwierzakbezalergii.pl
```

💡 **Jak uzyskać klucz API:**
1. Zarejestruj się na https://openrouter.ai/
2. Wejdź na https://openrouter.ai/keys
3. Kliknij "Create Key"
4. Skopiuj klucz do pliku `.env`

---

## 2️⃣ Uruchom serwer deweloperski

```bash
npm run dev
```

---

## 3️⃣ Otwórz asystenta w przeglądarce

```
http://localhost:4321/asystent
```

---

## ✅ Gotowe! 

Teraz możesz:
- 💬 Rozmawiać z asystentem o karmach
- 🔍 Analizować składy
- ⚠️ Sprawdzać alergeny
- 💡 Otrzymywać personalizowane porady

---

## 🎨 Dostosowywanie

### Zmiana modelu AI

W `src/components/PetFoodAssistant.tsx` (linia ~14):

```typescript
const { messages, isLoading, error, sendMessage, clearMessages } = useChat({
  model: 'openai/gpt-4', // ← Zmień tutaj!
  // 'openai/gpt-3.5-turbo' - szybszy, tańszy
  // 'openai/gpt-4' - lepszy, droższy
  // 'anthropic/claude-3-sonnet' - dobry balans
});
```

### Zmiana instrukcji dla AI

W tym samym miejscu, zmień `systemMessage`:

```typescript
systemMessage: `Tutaj opisz jak ma się zachowywać AI...`
```

### Zmiana kolorów

W `src/components/PetFoodAssistant.tsx` szukaj klas Tailwind:
- `bg-blue-500` → zmień na inny kolor
- `from-blue-500 to-blue-600` → gradient w nagłówku

---

## 📊 Koszty

Przykładowe koszty przy użyciu GPT-3.5-turbo:
- **1 rozmowa (5 wiadomości):** ~$0.001 (poniżej 1 grosza)
- **100 rozmów:** ~$0.10 (40 groszy)
- **1000 rozmów:** ~$1.00 (4 złote)

💡 **Oszczędzaj:**
- Użyj `maxTokens: 300` zamiast 500 dla krótszych odpowiedzi
- Użyj GPT-3.5 zamiast GPT-4 (20x tańszy!)

---

## 🎯 Przykładowe pytania do przetestowania

Wklej je w czacie żeby sprawdzić jak działa:

1. **Podstawowe:**
   - "Jakie są najczęstsze alergeny u psów?"
   - "Czym różni się nietolerancja od alergii?"

2. **Konkretne:**
   - "Mój pies ma alergię na kurczaka i pszenicę, co polecasz?"
   - "Czy jagnięcina jest hipoalergiczna?"

3. **Analiza składu:**
   - "Karma zawiera: kurczak 30%, ryż 25%, kukurydza 20%. Jest bezpieczna?"
   - "Co sądzisz o karmach z owadami jako źródłem białka?"

---

## 🔧 Troubleshooting

### Problem: "API key jest wymagany"
✅ Sprawdź czy plik `.env` istnieje i zawiera `OPENROUTER_API_KEY`

### Problem: "Network error"
✅ Sprawdź połączenie z internetem
✅ Sprawdź czy serwer dev działa (`npm run dev`)

### Problem: AI odpowiada po angielsku
✅ W `systemMessage` dodaj: "Odpowiadaj zawsze po polsku"

### Problem: Odpowiedzi są za długie
✅ Zmniejsz `maxTokens` z 500 na 300 lub 200

---

## 🎉 Co dalej?

### Pomysły na rozszerzenie:

1. **Dodaj przycisk "Zapytaj AI" przy każdej karmie**
   ```tsx
   <button onClick={() => sendMessage(`Czy karma ${foodName} jest bezpieczna?`)}>
     Zapytaj AI
   </button>
   ```

2. **Quiz "Znajdź idealną karmę"**
   - Zadawaj pytania o rasę, wiek, alergeny
   - Na koniec polecaj konkretne karmy z bazy

3. **Analiza zdjęć etykiet** (wymaga modelu z vision)
   - Użytkownik wrzuca zdjęcie składu
   - AI analizuje i ostrzega przed alergenami

4. **Integracja z bazą danych**
   - AI może przeszukiwać Twoją bazę karm
   - "Pokaż mi wszystkie karmy bez drobiu z bazy"

---

## 📚 Pełna dokumentacja

Więcej informacji: `docs/openrouter-usage.md`

---

**Powodzenia! 🐾**

