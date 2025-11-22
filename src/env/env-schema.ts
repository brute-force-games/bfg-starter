import { z } from 'zod';

/**
 * Environment variable schema
 * Validates and provides type-safe access to environment variables.
 * No defaults are provided in code - all defaults must be in .env files.
 * All variables are required - missing values will cause validation errors.
 */
const envSchema = z.object({
  VITE_WORKSPACE_ROOT: z.string(),
  VITE_DEV_PORT: z.coerce.number(),
  VITE_TRYSTERO_APP_ID: z.string(),
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string(),
  VITE_NOSTR_RELAYS: z.string(),
});

/**
 * Validated environment variables
 * Throws an error if required variables are missing or invalid.
 * All values must be provided in .env files - see .env.example for defaults.
 */
const rawEnv = {
  VITE_WORKSPACE_ROOT: import.meta.env.VITE_WORKSPACE_ROOT,
  VITE_DEV_PORT: import.meta.env.VITE_DEV_PORT,
  VITE_TRYSTERO_APP_ID: import.meta.env.VITE_TRYSTERO_APP_ID,
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  VITE_NOSTR_RELAYS: import.meta.env.VITE_NOSTR_RELAYS,
};

const parseResult = envSchema.safeParse(rawEnv);

if (!parseResult.success) {
  const missingVars: string[] = [];
  const invalidVars: string[] = [];
  
  for (const issue of parseResult.error.issues) {
    const varName = issue.path[0] as string;
    if (rawEnv[varName as keyof typeof rawEnv] === undefined || rawEnv[varName as keyof typeof rawEnv] === '') {
      missingVars.push(varName);
    } else {
      invalidVars.push(`${varName}: ${issue.message}`);
    }
  }
  
  const errorMessages: string[] = [];
  if (missingVars.length > 0) {
    errorMessages.push(`Missing required environment variables: ${missingVars.join(', ')}`);
    errorMessages.push(`Please set these in your .env file. See .env.example for default values.`);
  }
  if (invalidVars.length > 0) {
    errorMessages.push(`Invalid environment variables: ${invalidVars.join('; ')}`);
  }
  
  throw new Error(`Environment variable validation failed:\n${errorMessages.join('\n')}`);
}

export const env = parseResult.data;

export type Env = z.infer<typeof envSchema>;

