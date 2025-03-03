import { z } from "zod";


export const DexieCloudEmailSchema = z.string().brand('DbkDexieCloudEmail');
export type DexieCloudEmail = z.infer<typeof DexieCloudEmailSchema>;

