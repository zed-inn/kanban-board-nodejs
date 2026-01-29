import { createEnum } from "@shared/utils/create-enum";

export const SOCKET = {
  EVENTS: createEnum(["join-board"] as const),
};
