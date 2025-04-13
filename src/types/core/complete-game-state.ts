// import { z } from "zod";
// import { GameIdSchema } from "./branded-values/bs-game-id";
// import { PlayerIdSchema } from "./branded-values/bs-player-id";
// import { CompletePlayerDataSchema } from "../player/complete-player-data";
// import { PublicPlayerDataSchema } from "../player/public-player-data";
// import { GameLobbyCompleteSchema } from "./game-lobby";
// import { GroupCardIdSchema, IlluminatiCardIdSchema, PlayCardIdSchema, PowerStructureCardIdSchema } from "./branded-values/bs-card-ids";
// import { PlayerTurnPhaseSchema } from "../gamestate/game-phase";
// import { AttackTypeSchema } from "../enums/attack-types";
// import { PlayerKeySchema } from "../player/player-def";


// export const GameStatusSchema = z.object({
//   isOver: z.boolean(),
//   winner: PlayerIdSchema.nullable(),
// });

// export type GameStatus = z.infer<typeof GameStatusSchema>;


// export const CurrentTurnSchema = z.object({
//   turnNumber: z.number().nonnegative(),
//   turnStartTime: z.coerce.date(),
//   playerId: PlayerIdSchema,
//   playerKey: PlayerKeySchema,
//   phase: PlayerTurnPhaseSchema,
// });

// export type CurrentTurn = z.infer<typeof CurrentTurnSchema>;


// export const TransferredPowerSchema = z.object({
//   sourceCardId: PlayCardIdSchema.readonly(),
//   power: z.number().nonnegative().readonly(),
// });

// export type TransferredPower = z.infer<typeof TransferredPowerSchema>;


// export const InterferenceIncrementSchema = z.object({
//   sourcePlayerId: PlayerIdSchema.readonly(), // interference MB can only come from Illuminati card
//   amountOfMBs: z.number().nonnegative().readonly(),
// });

// export type InterferenceIncrement = z.infer<typeof InterferenceIncrementSchema>;


// export const CurrentAttackSchema = z.object({
//   attackType: AttackTypeSchema,

//   attackingCardId: PowerStructureCardIdSchema,
//   defendingCardId: GroupCardIdSchema,

//   attackingPlayerId: PlayerIdSchema,
//   attackingPlayerKey: PlayerKeySchema,
//   defendingPlayerId: PlayerIdSchema.nullable(),
//   defendingPlayerKey: PlayerKeySchema.nullable(),

//   attackPower: z.number(),
//   defenseResistance: z.number(),

//   isPrivilegedAttack: z.boolean(),
//   isPrivilegeCancelled: z.boolean(),
//   isAttackCommitted: z.boolean(),
//   isAttackFinalized: z.boolean(),
//   isDefenseFinalized: z.boolean(),
//   isThisFinalAttack: z.boolean(),

//   currentPlayerIdsAbstainingFromAttack: z.array(PlayerIdSchema),

//   transferredPower: z.array(TransferredPowerSchema),
//   powerStructurePositionDefenseBonus: z.number(),

//   allocatedGroupMBsForAttack: z.number().nonnegative(),
//   allocatedIlluminatiMBsForAttack: z.number().nonnegative()
//     .refine((n) => n % 2 === 0, {
//       message: "Allocated Illuminati MBs for attack must be even (can only add in increments of 2)"
//     }),

//   allocatedGroupMBsForDefense: z.number().nonnegative(),
//   allocatedIlluminatiMBsForDefense: z.number().nonnegative(),

//   proAttackInterference: z.array(InterferenceIncrementSchema),
//   proDefenseInterference: z.array(InterferenceIncrementSchema),
// });

// export type CurrentAttack = z.infer<typeof CurrentAttackSchema>;


// export const CompleteGameStateSchema = z.object({
//   thisType: z.literal('CompleteGameState'),

//   lobbyParameters: GameLobbyCompleteSchema.readonly(),
//   gameId: GameIdSchema.readonly(),
//   gameStartTime: z.coerce.date().readonly(),
//   gameHostPlayerId: PlayerIdSchema.readonly(),
//   randomSeed: z.string().readonly(),

//   name: z.string().readonly(),
//   gameStatus: GameStatusSchema.readonly(),
//   players: z.array(CompletePlayerDataSchema).readonly(),

//   currentTurn: CurrentTurnSchema.readonly(),
//   currentAttack: CurrentAttackSchema.nullable(),
//   alreadyAttackedGroupIds: z.array(PlayCardIdSchema).readonly(),
//   numberOfRemainingActions: z.number().nonnegative().readonly(),
  
//   unusedIlluminatiCardIds: z.array(IlluminatiCardIdSchema).readonly(),
//   uncontrolledGroupIds: z.array(GroupCardIdSchema).readonly(),
//   nextDiceRoll: z.array(z.number().min(1).max(6)).length(2).readonly(),
//   drawPile: z.array(PlayCardIdSchema).readonly(),
//   discardPile: z.array(PlayCardIdSchema).readonly(),

//   bankMegaBuck1sPileCount: z.number().nonnegative().readonly(),
//   bankMegaBuck2sPileCount: z.number().nonnegative().readonly(),
//   bankMegaBuck3sPileCount: z.number().nonnegative().readonly(),
//   bankMegaBuck5sPileCount: z.number().nonnegative().readonly(),
//   bankMegaBuck10sPileCount: z.number().nonnegative().readonly(),
//   bankMegaBuck20sPileCount: z.number().nonnegative().readonly(),
// });

// export type CompleteGameState = z.infer<typeof CompleteGameStateSchema>;


// export const PublicGameStateSchema = CompleteGameStateSchema
//   .omit({
//     players: true,
//   })
//   .extend({
//     thisType: z.literal('PublicGameState'),
//     players: z.array(PublicPlayerDataSchema).readonly(),
//   });

// export type PublicGameState = z.infer<typeof PublicGameStateSchema>;
