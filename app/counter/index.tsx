import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, useWindowDimensions } from "react-native";
import { theme } from "../../theme";
import React, { useEffect, useRef, useState } from "react";
import { intervalToDuration, isBefore } from "date-fns";
import TimeSegment from "../../components/TimeSegment";
import { getFromStorage} from "../../utils/storage";
import { handleTaskCompletion } from "../../utils/handleTaskCompletion";
import { counterStorageKey, PersistedCountdownState } from "../../utils/shared";
import ConfettiCannon from "react-native-confetti-cannon";

// hard coding a possible frequency for the task -10 secs
const frequency = 10 * 1000;

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

  /*------- Keeps track of the most recent time the task was completed (the only task) ----------*/
  const lastCompletedTimestamp = countdownState?.completedAtTimestamp[0];

  /* ------ Fetching the countdown state from storage ----------*/
  useEffect(() => {
    const initialCountdownState = async () => {
      const value = await getFromStorage(counterStorageKey);
      setCountdownState(value);
      setTimeout(() => {
        setIsLoading(false);        
      }, 500);
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

// on task completion, both the confetti animation and the task state update are triggered
  const onTaskCompletion = () => {
    //trigger the confetti animation using the ref
    confettiRef?.current?.start();

    //handle the task state update
    handleTaskCompletion(frequency, countdownState, setCountdownState);
  }

  if(isLoading) {
    return (
      <View style={styles.activityIndicatorContainer}>
        <ActivityIndicator size="large" color={theme.colorBlack}></ActivityIndicator>
        <Text>Loading...</Text>
      </View>
    )  
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
        // onPress={() => handleTaskCompletion(frequency, countdownState, setCountdownState)}
        onPress={onTaskCompletion}
      >
        <Text style={styles.buttonText}>Complete Task</Text>
      </TouchableOpacity>
      <ConfettiCannon count={200} origin={{ x: width / 2, y:-10 }} autoStart={false} fadeOut={true} ref={confettiRef}></ConfettiCannon>
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
  activityIndicatorContainer: {
    flex: 1,
    gap: 20,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor: theme.colorWhite,
  },
});
