// context/AppContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppContextType {
  openaiKey: string;
  stabilityKey: string;
  setOpenaiKey: (key: string) => void;
  setStabilityKey: (key: string) => void;
  saveKeys: () => Promise<void>;
  isLoading: boolean;
  credits: number;
  useCredit: () => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [stabilityKey, setStabilityKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [credits, setCredits] = useState(50);

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    try {
      const oKey = await AsyncStorage.getItem('openai_key');
      const sKey = await AsyncStorage.getItem('stability_key');
      const savedCredits = await AsyncStorage.getItem('credits');
      if (oKey) setOpenaiKey(oKey);
      if (sKey) setStabilityKey(sKey);
      if (savedCredits) setCredits(parseInt(savedCredits));
    } catch (e) {
      console.error('Error loading keys:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveKeys = async () => {
    try {
      await AsyncStorage.setItem('openai_key', openaiKey);
      await AsyncStorage.setItem('stability_key', stabilityKey);
    } catch (e) {
      console.error('Error saving keys:', e);
    }
  };

  const useCredit = async () => {
    const newCredits = credits - 1;
    setCredits(newCredits);
    await AsyncStorage.setItem('credits', newCredits.toString());
  };

  return (
    <AppContext.Provider value={{
      openaiKey,
      stabilityKey,
      setOpenaiKey,
      setStabilityKey,
      saveKeys,
      isLoading,
      credits,
      useCredit,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
