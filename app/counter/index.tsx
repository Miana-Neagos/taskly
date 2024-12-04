import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { theme } from "../../theme";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { intervalToDuration, isBefore } from "date-fns";
import TimeSegment from "../../components/TimeSegment";
import { getFromStorage, saveToStorage } from "../../utils/storage";

// hard coding a possible frequency for the task -10 secs
const frequency = 10 * 1000;
const counterStorageKey = "taskly-counter";

type PersistedCountdownState = {
  currentNotifId: string | undefined;
  completedAtTimestamp: number[];
};

type CountdownStatus = {
  isOverdue: boolean;
  distance: ReturnType<typeof intervalToDuration>;
};

export default function CounterScreen() {
  // const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [countdownState, setCountdownState] = useState<PersistedCountdownState>();
  const [status, setStatus] = useState<CountdownStatus>({
    isOverdue: false,
    distance: {},
  });

  /*------- Keeps track of the most recent time the task was completed (the only task) ----------*/
  const lastCompletedTimestamp = countdownState?.completedAtTimestamp[0];

  /* ------ Fetching the countdown state from storage ----------*/
  useEffect(() => {
    const initialCountdownState = async () => {
      const value = await getFromStorage(counterStorageKey);
      setCountdownState(value);
    };
    initialCountdownState();
  }, []);

  useEffect(() => {
    // setInterval inside the useEffect ensures that the countdown continuously updates every second, regardless of whether "lastCompletedTimestamp" changes
    const intervalId = setInterval(() => {
      // calculating the due time
      const timestamp = lastCompletedTimestamp ? lastCompletedTimestamp + frequency : Date.now();

      const isOverdue = isBefore(timestamp, Date.now());
      const distance = intervalToDuration(
        isOverdue
          ? { start: timestamp, end: Date.now() }
          : { start: Date.now(), end: timestamp }
      );
      setStatus({ isOverdue, distance });
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
    // passing a dependancy for useEffect so that the countdown logic is recalculated each time "lastUpdatedTimestamp" is modified
  }, [lastCompletedTimestamp]);

  const scheduleNotifications = async () => {
    let pushNotifId;
    const result = await registerForPushNotificationsAsync();

    if (result === "granted") {
      pushNotifId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Time is up ⌛, task is overdue",
          // body: "Get Moving",
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
      await Notifications.cancelScheduledNotificationAsync(countdownState.currentNotifId);
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

  return (
    <View
      style={[
        styles.container,
        status.isOverdue ? styles.containerLate : undefined,
      ]}
    >
      {status.isOverdue ? (
        <Text style={[styles.heading, styles.whiteText]}>
          {" "}
          Task is overdue by
        </Text>
      ) : (
        <Text style={styles.heading}>Task is due in...</Text>
      )}
      <View style={styles.timeSegmentView}>
        <TimeSegment
          unit="Days"
          number={status.distance.days ?? 0}
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        ></TimeSegment>
        <TimeSegment
          unit="Hours"
          number={status.distance.hours ?? 0}
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        ></TimeSegment>
        <TimeSegment
          unit="Minutes"
          number={status.distance.minutes ?? 0}
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        ></TimeSegment>
        <TimeSegment
          unit="Seconds"
          number={status.distance.seconds ?? 0}
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        ></TimeSegment>
      </View>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={scheduleNotifications}
      >
        <Text style={styles.buttonText}>Complete Task</Text>
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
    color: theme.colorBlack,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 18,
  },
  timeSegmentView: {
    flexDirection: "row",
    fontWeight: "bold",
    marginBottom: 18,
  },
  containerLate: {
    backgroundColor: theme.colorOrange,
  },
  whiteText: {
    color: theme.colorWhite,
  },
});
