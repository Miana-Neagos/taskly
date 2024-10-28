import { TouchableOpacity, StyleSheet, Text, View, Alert } from "react-native";
import { theme } from "./theme";

export default function App() {
  const handleDelete = () => {
    Alert.alert("Are u sure u wanna delete?", "It will be gone 4ever", [
      {
        text: "Yes",
        onPress: () => console.log("Item deleted"),
        style: "destructive",
      },
      {
        text: "Cancel",
        onPress: () => console.log("Deletion aborted"),
        style: "cancel",
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>Coffee</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleDelete}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}> Delete </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    justifyContent: "center",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomColor: theme.colorCerulean,
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 24,
    fontWeight: "300",
  },
  button: {
    backgroundColor: theme.colorBlack,
    borderRadius: 6,
  },
  buttonText: {
    color: theme.colorWhite,
    textTransform: "uppercase",
    letterSpacing: 1,
    padding: 4,
  },
});
