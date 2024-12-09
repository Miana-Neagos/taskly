import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, useWindowDimensions } from "react-native";
import { theme } from "../../theme";
import React, { useEffect, useRef, useState } from "react";
import { intervalToDuration, isBefore } from "date-fns";
import TimeSegment from "../../components/TimeSegment";
import { getFromStorage } from "../../utils/storage";
import { handleTaskCompletion } from "../../utils/handleTaskCompletion";
import { counterStorageKey, PersistedCountdownState } from "../../utils/shared";
import ConfettiCannon from "react-native-confetti-cannon";

// Define a hardcoded interval frequency for task updates (10 seconds).
const frequency = 10 * 1000;

// Type definition for countdown status.
type CountdownStatus = {
  isOverdue: boolean;
  distance: ReturnType<typeof intervalToDuration>;
};

export default function CounterScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [countdownState, setCountdownState] = useState<PersistedCountdownState>();
  const [status, setStatus] = useState<CountdownStatus>({
    isOverdue: false,
    distance: {},
  });
  const confettiRef = useRef<any>();
  const { width } = useWindowDimensions();

  /** 
   * Tracks the timestamp of the last completed task, if available.
   */
  const lastCompletedTimestamp = countdownState?.completedAtTimestamp[0];

  /** 
   * Fetch the initial countdown state from persistent storage on component mount.
   */
  useEffect(() => {
    const initializeCountdownState = async () => {
      const storedValue = await getFromStorage(counterStorageKey);
      setCountdownState(storedValue);
      setTimeout(() => setIsLoading(false), 500);
    };
    initializeCountdownState();
  }, []);

  /** 
   * Establishes a countdown interval to dynamically calculate overdue status and remaining time. 
   */
  useEffect(() => {
    const intervalId = setInterval(() => {
      const targetTime = lastCompletedTimestamp
        ? lastCompletedTimestamp + frequency
        : Date.now();

      const overdue = isBefore(targetTime, Date.now());
      const remainingTime = intervalToDuration(
        overdue
          ? { start: targetTime, end: Date.now() }
          : { start: Date.now(), end: targetTime }
      );

      setStatus({ isOverdue: overdue, distance: remainingTime });
    }, 1000);

    // Cleanup interval on component unmount.
    return () => clearInterval(intervalId);
  }, [lastCompletedTimestamp]);

  /** 
   * Handles task completion logic, triggering both the confetti animation 
   * and updates to the countdown state.
   */
  const onTaskCompletion = () => {
    confettiRef?.current?.start();
    handleTaskCompletion(frequency, countdownState, setCountdownState);
  };

  if (isLoading) {
    return (
      <View style={styles.activityIndicatorContainer}>
        <ActivityIndicator size="large" color={theme.colorBlack} />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        status.isOverdue ? styles.containerLate : undefined,
      ]}
    >
      {status.isOverdue ? (
        <Text style={[styles.heading, styles.whiteText]}>
          Task is overdue by
        </Text>
      ) : (
        <Text style={styles.heading}>Task is due in...</Text>
      )}

      <View style={styles.timeSegmentView}>
        {/* Render dynamic countdown segments */}
        <TimeSegment unit="Days" number={status.distance.days ?? 0} textStyle={status.isOverdue ? styles.whiteText : undefined} />
        <TimeSegment unit="Hours" number={status.distance.hours ?? 0} textStyle={status.isOverdue ? styles.whiteText : undefined} />
        <TimeSegment unit="Minutes" number={status.distance.minutes ?? 0} textStyle={status.isOverdue ? styles.whiteText : undefined} />
        <TimeSegment unit="Seconds" number={status.distance.seconds ?? 0} textStyle={status.isOverdue ? styles.whiteText : undefined} />
      </View>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={onTaskCompletion}
      >
        <Text style={styles.buttonText}>Complete Task</Text>
      </TouchableOpacity>

      {/* Render confetti animation upon task completion */}
      <ConfettiCannon
        count={200}
        origin={{ x: width / 2, y: -10 }}
        autoStart={false}
        fadeOut={true}
        ref={confettiRef}
      />
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
  activityIndicatorContainer: {
    flex: 1,
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colorWhite,
  },
});
