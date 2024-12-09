import { Link, Stack } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { theme } from "../../theme";
import { Pressable } from "react-native";

// Layout component for navigation between Counter and History screens
export default function Layout() {
  return (
    <Stack>
      {/* Main Counter screen with a header right button linking to the history page */}
      <Stack.Screen
        name="index"
        options={{
          title: "Counter",
          headerRight: () => (
            <Link href="/counter/history" asChild>
              <Pressable hitSlop={20}>
                <MaterialIcons
                  name="history"
                  size={32}
                  color={theme.colorGrey}
                />
              </Pressable>
            </Link>
          ),
        }}
      ></Stack.Screen>
      {/* History screen for displaying historical data */}
      <Stack.Screen name="history" options={{title: "History"}}></Stack.Screen>
    </Stack>
  );
}
