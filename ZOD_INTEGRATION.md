# Zod Integration for TinyBase Player Profiles

This document describes the Zod schema validation integration for the TinyBase player profile system.

## Overview

Zod provides runtime validation and type safety for all data loaded from TinyBase tables. This ensures data integrity and provides better error handling when parsing raw table data.

## Key Features

### Runtime Validation
- All data loaded from TinyBase tables is validated using Zod schemas
- Invalid data is gracefully handled with proper error logging
- Type-safe parsing with automatic type coercion

### Error Handling
- Comprehensive error logging for debugging
- Graceful fallbacks when data parsing fails
- Automatic cleanup of corrupted data

### Type Safety
- Full TypeScript integration with Zod schemas
- Compile-time and runtime type checking
- Automatic type inference and validation

## Implementation

### Store-Level Validation

#### Raw Data Parsing
```typescript
const RawPlayerProfileRowSchema = z.record(z.string(), z.unknown()).transform((data) => {
  // Transform raw TinyBase data to expected format
  return {
    handle: String(data.handle || ''),
    avatarImageUrl: data.avatarImageUrl ? String(data.avatarImageUrl) : undefined,
    isDefault: Boolean(data.isDefault),
    publicKey: String(data.publicKey || ''),
    privateKey: String(data.privateKey || ''),
    createdAt: String(data.createdAt || ''),
    updatedAt: String(data.updatedAt || ''),
  };
});
```

#### Profile Data Validation
```typescript
const RawPlayerProfileSchema = z.object({
  handle: z.string(),
  avatarImageUrl: z.string().optional(),
  isDefault: z.boolean(),
  publicKey: z.string(),
  privateKey: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
```

#### Storage Data Validation
```typescript
const StoredDataSchema = z.object({
  tables: z.record(z.string(), z.any()).optional(),
  values: z.record(z.string(), z.any()).optional(),
});
```

### Hook-Level Validation

#### Reactive Data Parsing
```typescript
const RawProfileDataSchema = z.object({
  handle: z.unknown().transform(val => String(val || '')),
  avatarImageUrl: z.unknown().transform(val => val ? String(val) : undefined),
  isDefault: z.unknown().transform(val => Boolean(val)),
  publicKey: z.unknown().transform(val => String(val || '')),
  privateKey: z.unknown().transform(val => String(val || '')),
  createdAt: z.unknown().transform(val => String(val || '')),
  updatedAt: z.unknown().transform(val => String(val || '')),
});
```

## Usage Examples

### Safe Profile Parsing
```typescript
const parseRawProfileData = (profileId: string, rawData: any): PrivatePlayerProfile | null => {
  try {
    const parsedData = RawPlayerProfileRowSchema.parse(rawData);
    const validatedData = RawPlayerProfileSchema.parse(parsedData);
    
    return {
      id: profileId,
      handle: validatedData.handle,
      avatarImageUrl: validatedData.avatarImageUrl,
      publicKey: validatedData.publicKey,
      privateKey: validatedData.privateKey,
      isDefault: validatedData.isDefault,
      createdAt: new Date(validatedData.createdAt),
      updatedAt: new Date(validatedData.updatedAt),
    };
  } catch (error) {
    console.error(`Error parsing profile data for ${profileId}:`, error);
    return null;
  }
};
```

### Store Restoration with Validation
```typescript
export const restoreStore = (): void => {
  try {
    const stored = localStorage.getItem('tinybase_player_profiles');
    if (!stored) return;
    
    const parsedData = JSON.parse(stored);
    const validatedData = StoredDataSchema.parse(parsedData);
    
    // Safe restoration with validated data
    if (validatedData.tables) {
      Object.entries(validatedData.tables).forEach(([tableId, table]) => {
        playerProfileStore.setTable(tableId, table);
      });
    }
  } catch (error) {
    console.error('Error restoring store:', error);
    // Clear corrupted data
    localStorage.removeItem('tinybase_player_profiles');
  }
};
```

### Reactive Hook with Validation
```typescript
export const usePlayerProfiles = () => {
  const rawProfiles = useTable('playerProfiles', playerProfileStore);
  const profileList: PrivatePlayerProfile[] = [];
  
  Object.entries(rawProfiles).forEach(([id, rawProfileData]) => {
    const parsedProfile = parseRawProfileData(id, rawProfileData);
    if (parsedProfile) {
      profileList.push(parsedProfile);
    }
  });

  return profileList;
};
```

## Benefits

### Data Integrity
- Runtime validation ensures data consistency
- Automatic type coercion handles edge cases
- Invalid data is filtered out gracefully

### Developer Experience
- Clear error messages for debugging
- Type-safe operations throughout the application
- Automatic TypeScript integration

### Performance
- Efficient validation with early returns
- Minimal overhead for valid data
- Graceful handling of invalid data

### Reliability
- Robust error handling prevents crashes
- Automatic cleanup of corrupted data
- Consistent data format across the application

## Error Handling Strategy

1. **Parse Errors**: Log detailed error information and return null
2. **Validation Errors**: Log validation failures and skip invalid records
3. **Storage Errors**: Clear corrupted data and continue with empty store
4. **Type Errors**: Use type coercion with fallback values

## Schema Evolution

The Zod schemas are designed to be flexible and handle data evolution:

- Optional fields are properly handled
- Type coercion provides backward compatibility
- Transform functions handle data format changes
- Validation errors are logged but don't break the application

## Testing Considerations

When testing with Zod validation:

1. **Valid Data**: Ensure schemas accept expected data formats
2. **Invalid Data**: Test error handling with malformed data
3. **Edge Cases**: Test with missing fields, wrong types, etc.
4. **Performance**: Validate that parsing doesn't impact performance

## Future Enhancements

1. **Custom Error Types**: Define specific error types for different validation failures
2. **Schema Versioning**: Add version information to schemas for migration
3. **Validation Metrics**: Track validation success/failure rates
4. **Schema Documentation**: Generate documentation from schemas
