import { Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { theme } from "../theme";

// Layout component sets up the main tab navigation for the app
export default function Layout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: theme.colorOrange }}>
      {/* Shopping List tab with list icon */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Shopping List",
          tabBarIcon: ({ color, size }) => (
            <Feather name="list" size={size} color={color} />
          ),
        }}
      ></Tabs.Screen>
      {/* Counter tab with clock icon, header is hidden */}
      <Tabs.Screen
        name="counter"
        options={{
          title: "Counter",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="clockcircle" size={size} color={color} />
          ),
        }}
      ></Tabs.Screen>
      {/* Idea tab with lightbulb icon */}
      <Tabs.Screen
        name="idea"
        options={{
          title: "Idea",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="lightbulb" size={size} color={color} />
          ),
        }}
      ></Tabs.Screen>
    </Tabs>
  );
}
