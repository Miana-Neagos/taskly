import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { counterStorageKey, PersistedCountdownState } from "../../utils/shared";
import { getFromStorage } from "../../utils/storage";
import { theme } from "../../theme";

// HistoryScreen component for displaying a list of completed countdown history
export default function HistoryScreen() {
  const [countdownState, setCountdownState] = useState<PersistedCountdownState>();

  // Fetch countdown history data on component mount
  useEffect(() => {
    const initialData = async () => {
      const value = await getFromStorage(counterStorageKey);
      setCountdownState(value);
    };
    initialData();
  }, []);

  // Format timestamp into a readable date-time string
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
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.contentContainer}
      data={countdownState?.completedAtTimestamp}
      keyExtractor={(item, index) => index.toString()}
      // Show this message if there’s no history data
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyContainerText}>No history data</Text>
        </View>
      }
      // Render each item in the history list
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>{formatTimestamp(item)}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
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
    fontWeight: "bold",
  },
});
