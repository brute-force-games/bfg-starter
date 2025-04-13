import { createContext, useContext } from 'react';
import { EnvSettingsContextType } from './env-types';


export const EnvSettingsContext = createContext<EnvSettingsContextType | undefined>(undefined);


export const useEnvSettings = () => {
  const context = useContext(EnvSettingsContext);
  if (context === undefined) {
    throw new Error('useEnvSettings must be used within an EnvSettingsProvider');
  }
  return context;
};
