import React, { useState, useRef, useEffect } from "react";
import { useChat } from "@/lib/hooks/useChat";
import { Button } from "./ui/button";

/**
 * PetFoodAssistant - Inteligentny asystent do doboru karm dla psów
 *
 * Komponent czatu który pomaga użytkownikom w:
 * - Doborze karmy dla psa z alergią
 * - Analizie składu karm
 * - Odpowiadaniu na pytania o alergeny
 */
export function PetFoodAssistant() {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading, error, sendMessage, clearMessages } = useChat({
    systemMessage: `Jesteś ekspertem od żywienia psów i alergii pokarmowych. 
Pomagasz właścicielom psów dobierać odpowiednie karmy, szczególnie dla psów z alergiami.
Odpowiadaj zwięźle, konkretnie i pomocnie. Jeśli pytają o konkretną karmę, zachęć do sprawdzenia bazy danych na stronie.
Bądź ciepły i przyjazny w komunikacji.`,
    model: "openai/gpt-3.5-turbo",
    temperature: 0.7,
    maxTokens: 500,
  });

  // Auto-scroll do najnowszej wiadomości
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    await sendMessage(input);
    setInput("");
  };

  // Przykładowe pytania do szybkiego startu
  const quickQuestions = [
    "Jakie są najczęstsze alergeny u psów?",
    "Mój pies ma alergię na kurczaka, co polecasz?",
    "Jak rozpoznać alergię pokarmową u psa?",
  ];

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="flex flex-col h-[600px] max-w-4xl mx-auto border border-border rounded-lg shadow-lg bg-card">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-purple-500 to-indigo-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-2xl">🐕</div>
          <div>
            <h2 className="text-xl font-bold text-white">Asystent Żywieniowy</h2>
            <p className="text-sm text-blue-100">Pytaj o karmy i alergeny</p>
          </div>
        </div>
        <Button
          onClick={clearMessages}
          variant="outline"
          size="sm"
          className="bg-white/20 text-white border-white/30 hover:bg-white/30"
        >
          Nowa rozmowa
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Witaj w Asystencie Żywieniowym!</h3>
            <p className="text-muted-foreground mb-6">Zapytaj mnie o karmy, alergeny lub dietę dla Twojego psa</p>

            {/* Quick Questions */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-3">Przykładowe pytania:</p>
              {quickQuestions.map((question, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickQuestion(question)}
                  className="block w-full max-w-md mx-auto px-4 py-2 text-left text-sm bg-card border border-border rounded-lg hover:bg-muted/50 hover:border-purple-300 transition-colors"
                >
                  💡 {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 ${
                message.role === "user"
                  ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
                  : "bg-card border border-border text-foreground"
              }`}
            >
              <div className="flex items-start gap-2">
                {message.role === "assistant" && <span className="text-lg">🤖</span>}
                <div className="flex-1">
                  <div className="text-xs font-semibold mb-1 opacity-70">
                    {message.role === "user" ? "Ty" : "Asystent"}
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {typeof message.content === "string"
                      ? message.content
                      : message.content.map((c) => (c.type === "text" ? c.text : "")).join("")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-card border border-border rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🤖</span>
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
                <span className="text-sm text-muted-foreground">Myślę...</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-semibold text-destructive">Wystąpił błąd</p>
                <p className="text-sm text-destructive/80">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Napisz pytanie o karmy lub alergeny..."
            className="flex-1 px-4 py-3 border border-border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-foreground placeholder:text-muted-foreground"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Wysyłam...
              </span>
            ) : (
              "📤 Wyślij"
            )}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          💡 Wskazówka: Możesz zapytać o konkretne składniki, alergeny lub porównać karmy
        </p>
      </div>
    </div>
  );
}
