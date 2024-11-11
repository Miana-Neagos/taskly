import { useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function CounterScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Counter Screen</Text>
      <TouchableOpacity onPress={() => router.navigate("./idea")}>
        <Text style={{ textAlign: "center", marginBottom: 18, fontSize: 24 }}>
          Go to idea
        </Text>
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
  text: {
    fontSize: 24,
  },
});
