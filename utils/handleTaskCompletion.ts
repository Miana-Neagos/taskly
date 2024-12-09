import { registerForPushNotificationsAsync } from "./registerForPushNotificationsAsync";
import * as Notifications from "expo-notifications";
import { Alert } from "react-native";
import { saveToStorage } from "./storage";
import { counterStorageKey, PersistedCountdownState } from "./shared";
import * as Haptics from "expo-haptics";

export const handleTaskCompletion = async (
  frequency: number,
  // counterStorageKey: string,
  countdownState: PersistedCountdownState | undefined,
  setCountdownState: React.Dispatch<
    React.SetStateAction<PersistedCountdownState | undefined>
  >
) => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

  let pushNotifId;
  const result = await registerForPushNotificationsAsync();

  if (result === "granted") {
    pushNotifId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time is up ⌛, task is overdue",
      },
      trigger: {
        seconds: frequency / 1000,
      },
    });
  } else {
    Alert.alert(
      "Unable to schedule notifications",
      "Enable notification permissions for Taskly from device Settings"
    );
  }
  //check countdown state for existing scheduled notifications, then cancel them
  if (countdownState?.currentNotifId) {
    await Notifications.cancelScheduledNotificationAsync(
      countdownState.currentNotifId
    );
  }

  const newCountdownState: PersistedCountdownState = {
    currentNotifId: pushNotifId,
    completedAtTimestamp: countdownState
      ? [Date.now(), ...countdownState.completedAtTimestamp]
      : [Date.now()],
  };
  setCountdownState(newCountdownState);
  await saveToStorage(counterStorageKey, newCountdownState);
};
