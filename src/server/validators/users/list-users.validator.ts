import { z } from "zod";

export const listUserQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  status: z.enum(["active", "inactive","all"]).default("all"),
});

export type ListUserDto = z.infer<typeof listUserQuerySchema>
