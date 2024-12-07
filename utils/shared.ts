export const counterStorageKey = "taskly-counter";

export type PersistedCountdownState = {
  currentNotifId: string | undefined;
  completedAtTimestamp: number[];
};