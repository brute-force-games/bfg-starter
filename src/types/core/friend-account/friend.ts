import { z } from "zod";


export const NewGameFriendParametersSchema = z.object({
  name: z.string(),
  email: z.string().email("Please enter a valid email address"),
})

export type NewGameFriendParameters = z.infer<typeof NewGameFriendParametersSchema>;


export const FriendAccountStatusSchema = z.enum([
  'pending',
  'accepted',
  'rejected',
]);

export type FriendAccountStatus = z.infer<typeof FriendAccountStatusSchema>;


export const FriendAccountSchema = z.object({
  status: FriendAccountStatusSchema,
  name: z.string(),
  email: z.string(),
});

export type FriendAccount = z.infer<typeof FriendAccountSchema>;
