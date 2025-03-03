import { getEnvSettings } from './env-utils';
import { getAppVersionString } from './env-utils';
import { EnvSettingsContextType } from './env-types';
import { EnvSettingsContext } from './EnvSettingsContext';


// const EnvSettingsContext = createContext<EnvSettingsContextType | undefined>(undefined);


// export const useEnvSettings = () => {
//   const context = useContext(EnvSettingsContext);
//   if (context === undefined) {
//     throw new Error('useEnvSettings must be used within an EnvSettingsProvider');
//   }
//   return context;
// };


interface IEnvSettingsProviderProps {
  children: React.ReactNode;
}

export const EnvSettingsProvider = ({ children }: IEnvSettingsProviderProps) => {
  const value: EnvSettingsContextType = {
    appVersion: getAppVersionString(),
    envSettings: getEnvSettings(),
  };

  return (
    <EnvSettingsContext.Provider value={value}>
      {children}
    </EnvSettingsContext.Provider>
  );
};
