
export type Environment = 'local' | 'dev' | 'staging' | 'production' | 'unknown';


export interface EnvSettings {
  envType: Environment;
  backgroundColor: string;
  pageTitlePrefix: string;
}


export interface EnvSettingsContextType {
  appVersion: string;
  envSettings: EnvSettings;
}
