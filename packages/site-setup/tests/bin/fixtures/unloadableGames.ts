/**
 * A games module that can't load, as one importing through a path alias (`@/…`) can't in plain
 * Node: it throws as it's imported, before it exports anything.
 */
throw new Error("Cannot find package '@/games' imported from unloadableGames.ts");
