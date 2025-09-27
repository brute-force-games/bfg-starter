# Simplified TinyBase Storage for Player Profiles

This document describes the simplified approach to storing player profiles in TinyBase using direct object storage with integer timestamps.

## Overview

Instead of storing data in TinyBase's generic format and then transforming it, we now store the profile objects directly as complete `PrivatePlayerProfile` objects. This eliminates all transformation logic and makes the code much simpler.

## Key Simplifications

### 1. Direct Object Storage
- Store complete `PrivatePlayerProfile` objects directly in TinyBase
- No need for table schema definitions
- No transformation logic required

### 2. Integer Timestamps
- Use `Date.now()` (milliseconds since epoch) for timestamps
- Avoids serialization issues with Date objects
- More efficient storage and comparison

### 3. Single Schema Validation
- Use the actual `PrivatePlayerProfileSchema` directly
- No need for separate "raw" schemas
- Consistent validation across the application

## Implementation

### Storage Format
```typescript
// Profile data stored directly in TinyBase
{
  id: string,
  handle: string,
  avatarImageUrl: string, // empty string if not provided
  publicKey: string,
  privateKey: string,
  isDefault: boolean,
  createdAt: number, // milliseconds since epoch
  updatedAt: number, // milliseconds since epoch
}
```

### Schema Definition
```typescript
export const PrivatePlayerProfileSchema = PublicPlayerProfileSchema.extend({
  isDefault: z.boolean(),
  privateKey: z.string(),
}).extend({
  // Override timestamps to use numbers
  createdAt: z.number(),
  updatedAt: z.number(),
});
```

### Simple Parsing
```typescript
const parseRawProfileData = (profileId: string, rawData: any): PrivatePlayerProfile | null => {
  const result = PrivatePlayerProfileSchema.safeParse(rawData);
  
  if (!result.success) {
    console.error(`Error validating profile data for ${profileId}:`, result.error);
    return null;
  }
  
  return result.data;
};
```

## Benefits

### 1. **Eliminated Complexity**
- No transformation schemas needed
- No type coercion logic
- No separate "raw" vs "validated" data structures

### 2. **Better Performance**
- Integer timestamps are more efficient than Date objects
- Direct object storage eliminates transformation overhead
- Smaller memory footprint

### 3. **Type Safety**
- Direct use of model schemas ensures consistency
- No risk of schema drift between storage and models
- Compile-time type checking

### 4. **Simpler Maintenance**
- Single source of truth for data structure
- Fewer moving parts to maintain
- Easier to debug and understand

## Data Flow

### Before (Complex)
```
Raw TinyBase Data → Transform Schema → Validate Schema → PrivatePlayerProfile
```

### After (Simple)
```
Stored Profile Object → PrivatePlayerProfileSchema → PrivatePlayerProfile
```

## Usage Examples

### Creating a Profile
```typescript
const profileData = {
  id: profileId,
  handle,
  avatarImageUrl: avatarImageUrl || '',
  publicKey: keyPair.publicKey,
  privateKey: keyPair.privateKey,
  isDefault,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

playerProfileStore.setRow('playerProfiles', profileId, profileData);
```

### Retrieving Profiles
```typescript
const rawData = playerProfileStore.getRow('playerProfiles', profileId);
const profile = PrivatePlayerProfileSchema.safeParse(rawData);
```

### Reactive Hooks
```typescript
const rawProfiles = useTable('playerProfiles', playerProfileStore);
const profiles = Object.entries(rawProfiles)
  .map(([id, data]) => parseRawProfileData(id, data))
  .filter(Boolean);
```

## Migration Benefits

### Code Reduction
- Removed transformation schemas
- Eliminated type coercion logic
- Simplified parsing functions

### Performance Improvements
- Integer timestamps are faster than Date objects
- Direct storage eliminates transformation overhead
- Smaller serialized data size

### Maintainability
- Single schema to maintain
- Consistent data format
- Easier to debug and test

## Future Considerations

1. **Migration**: If migrating from the old format, convert Date objects to integers
2. **Indexing**: Integer timestamps are easier to index and query
3. **Serialization**: JSON serialization is more efficient with primitives
4. **Debugging**: Integer timestamps are easier to read in dev tools

This simplified approach makes the codebase much cleaner and more maintainable while improving performance and type safety.
