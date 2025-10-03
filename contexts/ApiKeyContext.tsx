import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo } from 'react';

const API_KEY_STORAGE_KEY = 'gemini_api_key';

interface ApiKeyContextType {
  apiKey: string;
  isApiKeySet: boolean;
  setApiKey: (key: string) => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string>('');

  useEffect(() => {
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedKey) {
      setApiKeyState(storedKey);
    }
  }, []);

  const setApiKey = (key: string) => {
    const trimmedKey = key.trim();
    setApiKeyState(trimmedKey);
    if (trimmedKey) {
      localStorage.setItem(API_KEY_STORAGE_KEY, trimmedKey);
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
  };

  const isApiKeySet = useMemo(() => !!apiKey, [apiKey]);

  return (
    <ApiKeyContext.Provider value={{ apiKey, isApiKeySet, setApiKey }}>
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
