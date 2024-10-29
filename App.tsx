import { TouchableOpacity, StyleSheet, Text, View, Alert } from "react-native";
import { theme } from "./theme";
import ShoppingListItem from "./components/ShoppingListItem";

export default function App() {
  return (
    <View style={styles.container}>
      <ShoppingListItem name="Coffee"/>
      <ShoppingListItem name="Sugar"/>
      <ShoppingListItem name="Tea"/>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    justifyContent: "center",
  },
});
