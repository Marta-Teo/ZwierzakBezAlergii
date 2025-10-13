import { useState } from 'react';
import { Button } from './ui/button';

// 🔥 TAK UŻYWASZ API ENDPOINT z komponentu React!

interface Brand {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  success: boolean;
  data?: Brand[];
  count?: number;
  error?: string;
}

export default function BrandsExample() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = async () => {
    setLoading(true);
    setError(null);

    try {
      // Wywołanie API endpoint
      const response = await fetch('/api/brands');
      const result: ApiResponse = await response.json();

      if (result.success && result.data) {
        setBrands(result.data);
      } else {
        setError(result.error || 'Wystąpił nieznany błąd');
      }
    } catch (err) {
      setError('Nie udało się połączyć z API');
      console.error('Błąd fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-4 text-purple-900">
          Przykład użycia API Endpoint (React)
        </h3>

        <div className="mb-6">
          <Button
            onClick={fetchBrands}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {loading ? 'Ładowanie...' : '🔄 Pobierz marki z API'}
          </Button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>
              <strong>Błąd:</strong> {error}
            </p>
          </div>
        )}

        {brands.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Znaleziono <strong>{brands.length}</strong> marek:
            </p>
            <ul className="space-y-2">
              {brands.map((brand) => (
                <li
                  key={brand.id}
                  className="p-4 bg-white rounded-lg border border-purple-200 hover:border-purple-400 transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-purple-900">{brand.name}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      ID: {brand.id}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 p-4 bg-purple-100 border-l-4 border-purple-600 rounded">
          <p className="text-sm text-purple-900">
            💡 <strong>Jak to działa:</strong>
          </p>
          <ul className="text-sm text-purple-800 mt-2 space-y-1 list-disc list-inside">
            <li>Komponent wywołuje <code className="bg-purple-200 px-1 rounded">/api/brands</code></li>
            <li>Endpoint używa Supabase do pobrania danych</li>
            <li>Dane są zwracane jako JSON i wyświetlane w komponencie</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

