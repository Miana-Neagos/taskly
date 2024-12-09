import { registerForPushNotificationsAsync } from "./registerForPushNotificationsAsync";
import * as Notifications from "expo-notifications";
import { Alert } from "react-native";
import { saveToStorage } from "./storage";
import { counterStorageKey, PersistedCountdownState } from "./shared";
import * as Haptics from "expo-haptics";

// Handle task completion, schedule notifications, and persist state
export const handleTaskCompletion = async (
  frequency: number,
  countdownState: PersistedCountdownState | undefined,
  setCountdownState: React.Dispatch<React.SetStateAction<PersistedCountdownState | undefined>>
) => {
  // Trigger haptic feedback on success
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

  let pushNotifId;
  const result = await registerForPushNotificationsAsync();

  // Schedule notification if permission is granted
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

  // Cancel existing scheduled notifications if any
  if (countdownState?.currentNotifId) {
    await Notifications.cancelScheduledNotificationAsync(countdownState.currentNotifId);
  }

  // Update countdown state with new notification details
  const newCountdownState: PersistedCountdownState = {
    currentNotifId: pushNotifId,
    completedAtTimestamp: countdownState
      ? [Date.now(), ...countdownState.completedAtTimestamp]
      : [Date.now()],
  };

  // Persist new state and trigger state update
  setCountdownState(newCountdownState);
  await saveToStorage(counterStorageKey, newCountdownState);
};
