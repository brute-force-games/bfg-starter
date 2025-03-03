import { z } from "zod";


export const FriendAccountSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  status: z.enum(['pending', 'accepted', 'rejected']),
});


export type FriendAccount = z.infer<typeof FriendAccountSchema>;
