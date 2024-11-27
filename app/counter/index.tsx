import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { theme } from "../../theme";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";
import * as Notifications from "expo-notifications";

export default function CounterScreen() {
  const scheduleNotifications = async () => {
    const result = await registerForPushNotificationsAsync();
    console.log("this is SCHEDULE NOTIFICATION");
    console.log(result);
    

    if (result === "granted") {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Time is up ⌛",
          body: "Get Moving",
        },
        trigger: {
          seconds: 5,
        },
      });
    } else {
      Alert.alert(
        "Unable to schedule notifications",
        "Enable notification permissions for Taskly from device Settings"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Counter Screen</Text>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={scheduleNotifications}
      >
        <Text style={styles.buttonText}>Schedule Notification</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 12,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 24,
    color: theme.colorWhite,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  text: {
    fontSize: 24,
  },
});
