import { z } from "zod";

export const GlobalSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
});

export type GlobalDto = z.infer<typeof GlobalSchema>;

export const GlobalResponseSchema = <T extends z.ZodRawShape>(data?: T) =>
  z.object({ message: z.string(), ...(data ? { data: z.object(data) } : {}) });
