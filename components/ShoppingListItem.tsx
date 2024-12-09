// Import necessary components, icons, and theme
import { Alert, StyleSheet, Text, TouchableOpacity, Pressable, View } from "react-native";
import { theme } from "../theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from '@expo/vector-icons/Feather';

// Define props for ShoppingListItem
type Props = {
  name: string;
  isCompleted?: boolean;
  onDelete: () => void;
  onToggleComplete: () => void;
};

export default function ShoppingListItem({ name, isCompleted, onDelete, onToggleComplete, }: Props) {
  
  // Handle delete action with confirmation dialog
  const handleDelete = () => {
    Alert.alert(`Are u sure u wanna delete ${name}?`, undefined, [
      {
        text: "Yes",
        onPress: () => onDelete(),
        style: "destructive",
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };
  
  return (
    <>
      <Pressable
        style={[
          styles.itemContainer,
          isCompleted ? styles.completedContainer : undefined, 
        ]}
        onPress={onToggleComplete} // Handle toggling completion on press
      >
        <View style={styles.row}>
          {/* Display checkbox-like icon depending on completion status */}
          <Feather 
            name={isCompleted ? "check-square" : "square"} 
            size={24} 
            color={isCompleted ? theme.colorGrey : theme.colorOrange} 
          />
          
          {/* Display the shopping list item text */}
          <Text
            numberOfLines={1} 
            style={[styles.itemText, isCompleted ? styles.completedText : undefined]}
          >
            {name}
          </Text>
        </View>
        
        <TouchableOpacity onPress={handleDelete} activeOpacity={0.8}>
          <AntDesign
            name="closecircle"
            size={24}
            color={isCompleted ? theme.colorGrey : theme.colorRed} 
          />
        </TouchableOpacity>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomColor: theme.colorOrange,
    borderBottomWidth: 1,
  },
  completedContainer: {
    backgroundColor: theme.colorLightGrey, 
    borderBottomColor: theme.colorLightGrey,
  },
  itemText: {
    flex: 1,
    fontSize: 24,
    fontWeight: "300",
  },
  completedText: {
    color: theme.colorGrey,
    textDecorationLine: "line-through", 
    textDecorationColor: theme.colorGrey,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    flex: 1,
    alignItems: "center",
  },
});
