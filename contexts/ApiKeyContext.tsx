import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo, useCallback } from 'react';

// Konteks tidak lagi memerlukan `setApiKey`.
interface ApiKeyContextType {
  apiKey: string;
  isApiKeySet: boolean;
  isInitializing: boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string>('');
  const [isInitializing, setIsInitializing] = useState(true);

  // Fungsi helper untuk memeriksa apakah kunci yang diberikan adalah placeholder.
  const isPlaceholderKey = (key: string | null | undefined): boolean => {
    if (!key) return true; // Anggap null, undefined, atau string kosong sebagai placeholder.
    return key.toUpperCase().includes('PLACEHOLDER');
  };

  // Logika inisialisasi yang disederhanakan: HANYA mengambil dari backend.
  const initializeApiKey = useCallback(async () => {
    setIsInitializing(true);

    try {
      const response = await fetch('/api/get-api-key');
      if (response.ok) {
        const data = await response.json();
        if (data.apiKey && !isPlaceholderKey(data.apiKey)) {
          setApiKeyState(data.apiKey);
        } else {
          console.error('Kunci API yang diterima dari backend kosong atau merupakan placeholder.');
        }
      } else {
        console.error('Gagal mengambil kunci API default dari backend:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error saat mengambil kunci API dari backend:', error);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    initializeApiKey();
  }, [initializeApiKey]);

  const isApiKeySet = useMemo(() => !!apiKey && !isPlaceholderKey(apiKey), [apiKey]);

  // Menyediakan nilai konteks.
  return (
    <ApiKeyContext.Provider value={{ apiKey, isApiKeySet, isInitializing }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = (): ApiKeyContextType => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
};
