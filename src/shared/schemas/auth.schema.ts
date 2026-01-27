import { zId } from "@config/constants/db-schema";
import { z } from "zod";

export const AuthPayloadSchema = z.object({ id: zId });

export type AuthPayload = z.infer<typeof AuthPayloadSchema>;
