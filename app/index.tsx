import { FlatList, StyleSheet, TextInput, View, Text, LayoutAnimation, Platform, UIManager } from "react-native";
import { theme } from "../theme";
import ShoppingListItem from "../components/ShoppingListItem";
import { useEffect, useState } from "react";
import { orderShoppingList } from "../utils/orderShoppingList";
import { getFromStorage, saveToStorage } from "../utils/storage";
import * as Haptics from "expo-haptics";
import { storageKey } from "../utils/shared";
import { generateId } from "../utils/shared";

// Type definition for individual shopping list items
export type ShoppingListItemType = {
  id: string;
  name: string;
  completedAtTimestamp?: number;
  lastUpdatedTimestamp: number;
};

// Enable animation effects on Android devices for smoother UI transitions
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function App() {
  const [typedValue, setTypedValue] = useState<string>(); 
  const [shoppingList, setShoppingList] = useState<ShoppingListItemType[]>([]); 

  // Fetch initial shopping list data from local storage
  useEffect(() => {
    const fetchInitial = async () => {
      const data = await getFromStorage(storageKey);
      if (data) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Animate list changes
        setShoppingList(data);
      }
    };
    fetchInitial();
  }, []);

  // Handle submission of new shopping list item
  const handleSubmit = () => {
    if (typedValue) {
      const newShoppingList = [
        {
          id: generateId(), 
          name: typedValue,
          lastUpdatedTimestamp: Date.now(),
        },
        ...shoppingList,
      ];
      console.log("Configuring animation...");
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Animate UI changes
      setShoppingList(newShoppingList);
      saveToStorage(storageKey, newShoppingList); // Save to storage
      setTypedValue(""); // Clear input field after submission
    }
  };

  // Handle deletion of an item from the shopping list
  const handleDelete = (id: string) => {
    const newShoppingList = shoppingList.filter((item) => item.id !== id); 
    saveToStorage(storageKey, newShoppingList); 
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Animate UI changes
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    setShoppingList(newShoppingList); 
  };

  // Handle toggling item completion status
  const handleToggleComplete = (id: string) => {
    const newShoppingList = shoppingList.map((item) => {
      if (item.id === id) {
        // Trigger appropriate haptic feedback
        if (item.completedAtTimestamp) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        return {
          ...item,
          lastUpdatedTimestamp: Date.now(),
          completedAtTimestamp: item.completedAtTimestamp
            ? undefined
            : Date.now(),
        };
      }
      return item;
    });
    saveToStorage(storageKey, newShoppingList);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Animate changes
    setShoppingList(newShoppingList); 
  };

  return (
    <>
      <FlatList
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>Shopping list is empty.</Text>
          </View>
        }
        ListHeaderComponent={
          <TextInput
            style={styles.textInput}
            placeholder="E.g. Sugar"
            onChangeText={setTypedValue}
            value={typedValue}
            keyboardType="default"
            autoCapitalize="words"
            autoCorrect={true}
            underlineColorAndroid="transparent"
            onSubmitEditing={handleSubmit}
          />
        }
        data={orderShoppingList(shoppingList)}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        stickyHeaderIndices={[0]} 
        renderItem={({ item }) => (
          <ShoppingListItem
            name={item.name}
            onDelete={() => handleDelete(item.id)}
            onToggleComplete={() => handleToggleComplete(item.id)}
            isCompleted={Boolean(item.completedAtTimestamp)}
          />
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    paddingVertical: 12,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  textInput: {
    borderColor: theme.colorGrey,
    borderWidth: 2,
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 12,
    fontSize: 18,
    borderRadius: 50,
    backgroundColor: theme.colorWhite,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 18,
  },
});
