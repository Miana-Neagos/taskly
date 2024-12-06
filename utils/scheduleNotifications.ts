// const scheduleNotifications = async () => {
//     let pushNotifId;
//     const result = await registerForPushNotificationsAsync();

//     if (result === "granted") {
//       pushNotifId = await Notifications.scheduleNotificationAsync({
//         content: {
//           title: "Time is up ⌛, task is overdue",
//           // body: "Get Moving",
//         },
//         trigger: {
//           seconds: frequency / 1000,
//         },
//       });
//     } else {
//       Alert.alert(
//         "Unable to schedule notifications",
//         "Enable notification permissions for Taskly from device Settings"
//       );
//     }
//     //check countdown state for existing scheduled notifications, then cancel them
//     if (countdownState?.currentNotifId) {
//       await Notifications.cancelScheduledNotificationAsync(countdownState.currentNotifId);
//     }

//     const newCountdownState: PersistedCountdownState = {
//       currentNotifId: pushNotifId,
//       completedAtTimestamp: countdownState
//         ? [Date.now(), ...countdownState.completedAtTimestamp]
//         : [Date.now()],
//     };
//     setCountdownState(newCountdownState);
//     await saveToStorage(counterStorageKey, newCountdownState);
//   };
