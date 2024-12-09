import { View, Text, StyleSheet } from "react-native";
import { theme } from "../theme";

// IdeaScreen component: placeholder for the idea feature screen
export default function IdeaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}> Idea Screen </Text>
      <Text style={styles.textLoading}> Work in progress 🔃</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
  },
  textLoading: {
    color: theme.colorGrey,
    padding: 10,
  },
});
