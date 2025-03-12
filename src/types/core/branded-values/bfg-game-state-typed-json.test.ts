import { z } from 'zod';
import { BfgGameSpecificGameStateJsonString, createBfgGameTypedJsonMetadata } from './bfg-game-state-typed-json';
import { TicTacToeGameName } from '~/types/bfg-game-engines/supported-games';


describe('createBfgGameTypedJsonMetadata', () => {
  // Sample test schema
  const TestSchema = z.object({
    value: z.number(),
    text: z.string()
  });

  type TestType = z.infer<typeof TestSchema>;

  const testObj: TestType = {
    value: 42,
    text: 'test'
  };

  const metadata = createBfgGameTypedJsonMetadata<typeof TestSchema>(
    TicTacToeGameName,
    'game-state',
    TestSchema
  );

  it('should create metadata with correct properties', () => {
    expect(metadata.bfgGameTitle).toBe(TicTacToeGameName);
    expect(metadata.bfgGameDataJsonType).toBe('game-state');
    expect(metadata.jsonSchema).toBe(TestSchema);
  });

  it('should create and parse JSON correctly', () => {
    const json = metadata.createGameAndTypeSpecificJsonString(testObj);
    const parsed = metadata.parseGameAndTypeSpecificJsonString(json);

    expect(parsed).toEqual(testObj);
  });

  it('should maintain type safety through JSON conversion', () => {
    const json = metadata.createGameAndTypeSpecificJsonString(testObj);
    expect(typeof json).toBe('string');
    expect(JSON.parse(json.jsonString)).toEqual(testObj);
  });

  it('should throw on invalid data', () => {
    const invalidJson = '{"value":"not a number","text":42}' as unknown as BfgGameSpecificGameStateJsonString;
    expect(() => metadata.parseGameAndTypeSpecificJsonString(invalidJson)).toThrow();
  });

  // it('should create branded schema', () => {
  //   const brandedSchema = metadata.getBrandedSchema();
  //   expect(typeof brandedSchema).toBe('string');
  // });

  it('should handle empty objects', () => {
    const emptyObj: TestType = {
      value: 0,
      text: ''
    };
    const json = metadata.createGameAndTypeSpecificJsonString(emptyObj);
    const parsed = metadata.parseGameAndTypeSpecificJsonString(json);
    expect(parsed).toEqual(emptyObj);
  });

  it('should preserve complex objects', () => {
    const ComplexSchema = z.object({
      nested: z.object({
        array: z.array(z.number()),
        map: z.record(z.string())
      })
    });

    const complexMetadata = createBfgGameTypedJsonMetadata(
      TicTacToeGameName,
      'game-state',
      ComplexSchema
    );

    const complexObj = {
      nested: {
        array: [1, 2, 3],
        map: { key: 'value' }
      }
    };

    const json = complexMetadata.createGameAndTypeSpecificJsonString(complexObj);
    const parsed = complexMetadata.parseGameAndTypeSpecificJsonString(json);
    expect(parsed).toEqual(complexObj);
  });
}); 