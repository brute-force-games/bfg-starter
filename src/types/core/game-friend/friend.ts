import { z } from "zod";



export const NewGameFriendParametersSchema = z.object({
  name: z.string(),
  email: z.string().email("Please enter a valid email address"),
})

export type NewGameFriendParameters = z.infer<typeof NewGameFriendParametersSchema>;


// export const ValidatedNewFriendParametersSchema = NewFriendParametersSchema.superRefine((data, ctx) => {
//   // if (data.lobbyMinNumPlayers > data.lobbyMaxNumPlayers) {
//   //   ctx.addIssue({
//   //     code: z.ZodIssueCode.custom,
//   //     message: "Minimum number of players must be less than or equal to maximum number of players",
//   //     path: ["lobbyMinNumPlayers"],
//   //   });
//   // }
// });

// export type ValidatedNewFriendParameters = z.infer<typeof ValidatedNewFriendParametersSchema>;



export const FriendAccountStatusSchema = z.enum([
  'pending',
  'accepted',
  'rejected',
]);

export type FriendAccountStatus = z.infer<typeof FriendAccountStatusSchema>;


export const GameFriendAccountSchema = z.object({
  status: FriendAccountStatusSchema,
  name: z.string(),
  email: z.string(),
});

export type GameFriendAccount = z.infer<typeof GameFriendAccountSchema>;
