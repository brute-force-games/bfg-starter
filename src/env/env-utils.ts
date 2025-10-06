import { Environment, EnvSettings } from "./env-types";


// this is declared in vite.config.ts and will be replaced during build
declare const BUILD_DETAILS: {
  timestamp: string;
  commit: string;
  branch: string;
}; 


export const getAppVersionString = () => {
  const versionString = `${BUILD_DETAILS.branch}@${BUILD_DETAILS.commit} (${BUILD_DETAILS.timestamp})`;
  return versionString;
};


const classifyEnvironmentFromHost = (): Environment => {
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname.startsWith('192.168.') || hostname.startsWith('127.0.0.1')) {
    return 'local';
  }

  if (hostname.startsWith('dev')) {
    return 'dev';
  }
  
  if (hostname.includes('staging') || hostname.includes('-stage') || hostname.includes('dev')) {
    return 'staging';
  }
  
  return 'production';
};


const localEnvSettings: EnvSettings = {
  envType: 'local',
  backgroundColor: 'limegreen',
  pageTitlePrefix: '[local]',
};

const devEnvSettings: EnvSettings = {
  envType: 'dev',
  backgroundColor: 'limegreen',
  pageTitlePrefix: '[dev]',
};

const stagingEnvSettings: EnvSettings = {
  envType: 'staging',
  backgroundColor: 'orange',
  pageTitlePrefix: '[stg]',
};

const productionEnvSettings: EnvSettings = {
  envType: 'production',
  backgroundColor: '#ffffff',
  pageTitlePrefix: '',
};

const unknownEnvSettings: EnvSettings = {
  envType: 'unknown',
  backgroundColor: '#000000',
  pageTitlePrefix: '[unknown!]',
};


export const getEnvSettings = (): EnvSettings => {
  const environment = classifyEnvironmentFromHost();

  switch (environment) {
    case 'local':
      return localEnvSettings;
    case 'dev':
      return devEnvSettings;
    case 'staging':
      return stagingEnvSettings;
    case 'production':
      return productionEnvSettings;
    default:
      return unknownEnvSettings;
  }
};


export const getIsEnvProduction = () => {
  const environment = classifyEnvironmentFromHost();
  return environment === 'production';
};


export const getIsEnvNonProduction = () => {
  const environment = classifyEnvironmentFromHost();
  return environment !== 'production';
};
