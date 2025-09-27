import { DEXIE_CLOUD_DATABASE_URL_LOCAL_DEV, DEXIE_CLOUD_DATABASE_URL_STAGING, DEXIE_CLOUD_DATABASE_URL_PRODUCTION } from "~/data/dexie/dexie-config";
import { Environment, EnvSettings } from "./env-types";
// import { ACTIVE_PROJECT_EXPORT_VERSION } from "~/data/zod-types/schemas/import-export/versions";
// import { ACTIVE_PROFILE_EXPORT_VERSION } from "~/data/zod-types/schemas/import-export/versions";


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
  // cloudConfig: {
  //   isCloudEnabled: true,
  //   syncUrl: DEXIE_CLOUD_DATABASE_URL_LOCAL_DEV,
  // },
  // projectExportFormat: ACTIVE_PROJECT_EXPORT_VERSION,
  // profileExportFormat: ACTIVE_PROFILE_EXPORT_VERSION,
};

const devEnvSettings: EnvSettings = {
  envType: 'dev',
  backgroundColor: 'limegreen',
  pageTitlePrefix: '[dev]',
  // cloudConfig: {
  //   isCloudEnabled: false,
  // },
  // projectExportFormat: ACTIVE_PROJECT_EXPORT_VERSION,
  // profileExportFormat: ACTIVE_PROFILE_EXPORT_VERSION,
};

const stagingEnvSettings: EnvSettings = {
  envType: 'staging',
  backgroundColor: 'orange',
  pageTitlePrefix: '[stg]',
  // cloudConfig: {
  //   isCloudEnabled: true,
  //   syncUrl: DEXIE_CLOUD_DATABASE_URL_STAGING,
  // },
  // projectExportFormat: ACTIVE_PROJECT_EXPORT_VERSION,
  // profileExportFormat: ACTIVE_PROFILE_EXPORT_VERSION,
};

const productionEnvSettings: EnvSettings = {
  envType: 'production',
  backgroundColor: '#ffffff',
  pageTitlePrefix: '',
  // cloudConfig: {
  //   isCloudEnabled: true,
  //   syncUrl: DEXIE_CLOUD_DATABASE_URL_PRODUCTION,
  // },
  // projectExportFormat: ACTIVE_PROJECT_EXPORT_VERSION,
  // profileExportFormat: ACTIVE_PROFILE_EXPORT_VERSION,
};

const unknownEnvSettings: EnvSettings = {
  envType: 'unknown',
  backgroundColor: '#000000',
  pageTitlePrefix: '[unknown!]',
  // cloudConfig: {
  //   isCloudEnabled: false,
  // },
  // projectExportFormat: ACTIVE_PROJECT_EXPORT_VERSION,
  // profileExportFormat: ACTIVE_PROFILE_EXPORT_VERSION,
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


export const getDexieCloudDbUrl = () => {
  const environment = classifyEnvironmentFromHost();
  switch (environment) {
    case 'local':
      return DEXIE_CLOUD_DATABASE_URL_LOCAL_DEV;
    case 'staging':
      return DEXIE_CLOUD_DATABASE_URL_STAGING;
    case 'production':
      return DEXIE_CLOUD_DATABASE_URL_PRODUCTION;
    default:
      throw new Error(`Unknown environment: ${environment} - no dexie cloud db url available`);
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
