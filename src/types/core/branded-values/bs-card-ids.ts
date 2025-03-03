// import { z } from "zod";
// import { GroupCard } from "../../cards/group-card";
// import { IlluminatiCard } from "../../cards/illuminati-card";


// export const IlluminatiCardIdSchema = z.string().brand('IlluminatiCardId');

// export type IlluminatiCardId = z.infer<typeof IlluminatiCardIdSchema>;

// export const SpecialCardIdSchema = z.string().brand('SpecialCardId');

// export type SpecialCardId = z.infer<typeof SpecialCardIdSchema>;

// export const GroupCardIdSchema = z.string().brand('GroupCardId');

// export type GroupCardId = z.infer<typeof GroupCardIdSchema>;

// export const PlayCardIdSchema = z.union([SpecialCardIdSchema, GroupCardIdSchema]);

// export type PlayCardId = z.infer<typeof PlayCardIdSchema>;

// export const PowerStructureCardIdSchema = z.union([IlluminatiCardIdSchema, GroupCardIdSchema]);

// export type PowerStructureCardId = z.infer<typeof PowerStructureCardIdSchema>;

// export type PowerStructureCard = IlluminatiCard | GroupCard;
