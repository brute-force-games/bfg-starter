import { PrivatePlayerProfile, PrivatePlayerProfileSchema, createPrivatePlayerProfile, privateToPublicProfile } from '~/models/private-player-profile';
import { PublicPlayerProfile } from '~/models/public-player-profile';
import { v4 as uuidv4 } from 'uuid';

/**
 * Client-side storage for player profiles using localStorage
 * All profile data is stored locally - no server involvement
 */

const STORAGE_KEY = 'bfg_player_profiles';
const DEFAULT_PROFILE_KEY = 'bfg_default_player_profile_id';

/**
 * Get all private player profiles from localStorage
 */
export const getPrivatePlayerProfiles = (): PrivatePlayerProfile[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const profiles = JSON.parse(stored);
    return profiles.map((profile: any) => ({
      ...profile,
      createdAt: new Date(profile.createdAt),
      updatedAt: new Date(profile.updatedAt),
    })).filter((profile: any) => {
      const result = PrivatePlayerProfileSchema.safeParse(profile);
      if (!result.success) {
        console.warn('Invalid profile found in storage:', profile, result.error);
      }
      return result.success;
    });
  } catch (error) {
    console.error('Error loading player profiles:', error);
    return [];
  }
};

/**
 * Save all private player profiles to localStorage
 */
export const savePrivatePlayerProfiles = (profiles: PrivatePlayerProfile[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  } catch (error) {
    console.error('Error saving player profiles:', error);
    throw new Error('Failed to save player profiles');
  }
};

/**
 * Add a new private player profile
 */
export const addPrivatePlayerProfile = async (
  handle: string,
  avatarImageUrl?: string,
  isDefault: boolean = false
): Promise<PrivatePlayerProfile> => {
  const profiles = getPrivatePlayerProfiles();
  
  // Check if handle already exists
  if (profiles.some(p => p.handle === handle)) {
    throw new Error('Player profile with this handle already exists');
  }
  
  // If this is set as default, unset any existing default
  if (isDefault) {
    profiles.forEach(p => p.isDefault = false);
  }
  
  // Create new profile
  const profileData = await createPrivatePlayerProfile(handle, avatarImageUrl, isDefault);
  const newProfile: PrivatePlayerProfile = {
    id: uuidv4(),
    ...profileData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  profiles.push(newProfile);
  savePrivatePlayerProfiles(profiles);
  
  // Set as default profile if specified
  if (isDefault) {
    setDefaultPlayerProfile(newProfile.id);
  }
  
  return newProfile;
};

/**
 * Update an existing private player profile
 */
export const updatePrivatePlayerProfile = (id: string, updates: Partial<PrivatePlayerProfile>): PrivatePlayerProfile | null => {
  const profiles = getPrivatePlayerProfiles();
  const index = profiles.findIndex(p => p.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const updatedProfile = {
    ...profiles[index],
    ...updates,
    updatedAt: new Date(),
  };
  
  profiles[index] = updatedProfile;
  savePrivatePlayerProfiles(profiles);
  
  return updatedProfile;
};

/**
 * Delete a private player profile
 */
export const deletePrivatePlayerProfile = (id: string): boolean => {
  const profiles = getPrivatePlayerProfiles();
  const filtered = profiles.filter(p => p.id !== id);
  
  if (filtered.length === profiles.length) {
    return false; // Profile not found
  }
  
  savePrivatePlayerProfiles(filtered);
  
  // If this was the default profile, clear the default
  const currentDefault = getDefaultPlayerProfileId();
  if (currentDefault === id) {
    clearDefaultPlayerProfile();
  }
  
  return true;
};

/**
 * Get a private player profile by ID
 */
export const getPrivatePlayerProfile = (id: string): PrivatePlayerProfile | null => {
  const profiles = getPrivatePlayerProfiles();
  return profiles.find(p => p.id === id) || null;
};

/**
 * Get the default private player profile
 */
export const getDefaultPrivatePlayerProfile = (): PrivatePlayerProfile | null => {
  const defaultId = getDefaultPlayerProfileId();
  if (!defaultId) return null;
  
  return getPrivatePlayerProfile(defaultId);
};

/**
 * Set the default player profile
 */
export const setDefaultPlayerProfile = (id: string): void => {
  const profile = getPrivatePlayerProfile(id);
  if (!profile) {
    throw new Error('Player profile not found');
  }
  
  // Update the profile to be default
  updatePrivatePlayerProfile(id, { isDefault: true });
  
  // Store the default ID
  localStorage.setItem(DEFAULT_PROFILE_KEY, id);
};

/**
 * Get the default player profile ID
 */
export const getDefaultPlayerProfileId = (): string | null => {
  return localStorage.getItem(DEFAULT_PROFILE_KEY);
};

/**
 * Clear the default player profile
 */
export const clearDefaultPlayerProfile = (): void => {
  localStorage.removeItem(DEFAULT_PROFILE_KEY);
};

/**
 * Get all public player profiles (for sharing with other players)
 */
export const getPublicPlayerProfiles = (): PublicPlayerProfile[] => {
  const privateProfiles = getPrivatePlayerProfiles();
  return privateProfiles.map(privateToPublicProfile);
};

/**
 * Get a public player profile by ID
 */
export const getPublicPlayerProfile = (id: string): PublicPlayerProfile | null => {
  const privateProfile = getPrivatePlayerProfile(id);
  if (!privateProfile) return null;
  
  return privateToPublicProfile(privateProfile);
};

/**
 * Clear all player profiles (for testing/debugging)
 */
export const clearAllPlayerProfiles = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(DEFAULT_PROFILE_KEY);
};
