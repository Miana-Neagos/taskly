import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../theme";

type Props = {
  name: string;
}
export default function ShoppingListItem({ name }: Props) {
  const handleDelete = () => {
    Alert.alert(`Are u sure u wanna delete ${name}?`, "It will be gone 4ever", [
      {
        text: "Yes",
        onPress: () => console.log(`${name} deleted`),
        style: "destructive",
      },
      {
        text: "Cancel",
        onPress: () => console.log(`${name} deletion aborted`),
        style: "cancel",
      },
    ]);
  };
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{name}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleDelete}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}> Delete </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
