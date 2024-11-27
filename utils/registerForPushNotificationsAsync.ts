import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      showBadge: false,
    });
  }

  if (Device.isDevice) {
    // Step 1: Get the current notification permissions
    const permissions = await Notifications.getPermissionsAsync();
    // console.log(`this is permissions object:`);
    // console.log(permissions);
    
    // Step 2: Extract the status from the permissions object
    const currentPermissionStatus = permissions.status;

    // Step 3: Check if notifications are already grantedr
    if (currentPermissionStatus !== "granted") {
      // Step 4: If not granted, request permissions from the user
      const requestPermissionResult =
        await Notifications.requestPermissionsAsync();
    //   console.log(`this is request permission result:`);
    //   console.log(requestPermissionResult);

      const newPermissionStatus = requestPermissionResult.status;

      // Step 5: Return the new permission status
      return newPermissionStatus;
    } else {
      // Step 6: If already granted, return the current permission status
      return currentPermissionStatus;
    }
  }
}

//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     if (existingStatus !== "granted") {
//         const { status } = await Notifications.requestPermissionsAsync();
//         return status;
//     } else {
//         return existingStatus;
//     }
// } else {
//     return null;
// }
