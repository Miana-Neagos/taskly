import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { counterStorageKey, PersistedCountdownState } from "../../utils/shared";
import { getFromStorage } from "../../utils/storage";
import { format } from "date-fns";
import { theme } from "../../theme";

export default function HistoryScreen() {
  const [countdownState, setCountdownState] =
    useState<PersistedCountdownState>();

  useEffect(() => {
    const initialData = async () => {
      const value = await getFromStorage(counterStorageKey);
      setCountdownState(value);
    };
    initialData();
  }, []);

  // const formatedTimestamps = countdownState?.completedAtTimestamp?.map(timestamp => new Date(timestamp).toLocaleDateString());
  // console.log({formatedTimestamps});

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return date.toLocaleString("en-GB", options);
  };

  return (
    // <>
    //   <View style={styles.container}>
    //     <Text style={styles.text}>History</Text>
    //   </View>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.contentContainer}
        data={countdownState?.completedAtTimestamp}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyContainerText}>No history data</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>{formatTimestamp(item)}</Text>
          </View>
        )}
      ></FlatList>
    // </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
  },
  list: {
    flex: 1,
    backgroundColor: theme.colorWhite,
  },
  contentContainer: {
    marginTop: 8,
  },
  listItem: {
    backgroundColor: theme.colorLightGrey,
    marginHorizontal: 8,
    marginBottom: 8,
    padding: 12,
    borderRadius: 6,
  },
  listItemText: {
    fontSize: 18,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 18,
  },
  emptyContainerText: {
    fontSize: 18,
    fontWeight: "bold"
  },
});
