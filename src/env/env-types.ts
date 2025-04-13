
export type Environment = 'local' | 'dev' | 'staging' | 'production' | 'unknown';

export type CloudConfig = {
  isCloudEnabled: true;
  syncUrl: string;
} | {
  isCloudEnabled: false;
}


export interface EnvSettings {
  envType: Environment;
  backgroundColor: string;
  pageTitlePrefix: string;

  cloudConfig: CloudConfig;

  // projectExportFormat: string;
  // profileExportFormat: string;
}


export interface EnvSettingsContextType {
  appVersion: string;
  envSettings: EnvSettings;
}
