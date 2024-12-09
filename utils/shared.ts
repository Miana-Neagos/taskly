export const storageKey = "shop-list";

export const counterStorageKey = "taskly-counter";

export type PersistedCountdownState = {
  currentNotifId: string | undefined;
  completedAtTimestamp: number[];
};

export const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;