import { FlatList, StyleSheet, TextInput, View, Text, LayoutAnimation, Platform, UIManager } from "react-native";
import { theme } from "../theme";
import ShoppingListItem from "../components/ShoppingListItem";
import { useEffect, useState } from "react";
import { orderShoppingList } from "../utils/orderShoppingList";
import { getFromStorage, saveToStorage } from "../utils/storage";
import * as Haptics from "expo-haptics";

const storageKey = "shop-list";

export type ShoppingListItemType = {
  id: string;
  name: string;
  completedAtTimestamp?: number;
  lastUpdatedTimestamp: number;
};

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function App() {
  const [typedValue, setTypedValue] = useState<string>();
  const [shoppingList, setShoppingList] = useState<ShoppingListItemType[]>([]);

  useEffect(() => {
    const fetchInitial = async () => {
      const data = await getFromStorage(storageKey);
      if (data) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setShoppingList(data);
      }
    };
    fetchInitial();
  }, []);

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
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setShoppingList(newShoppingList);
      saveToStorage(storageKey, newShoppingList);
      setTypedValue("");
    }
  };

  const handleDelete = (id: string) => {
    const newShoppingList = shoppingList.filter((item) => item.id !== id);
    saveToStorage(storageKey, newShoppingList);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
    setShoppingList(newShoppingList);
  };

  const handleToggleComplete = (id: string) => {
    const newShoppingList = shoppingList.map((item) => {
      if (item.id === id) {
        if (item.completedAtTimestamp) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        }
        return {
          ...item,
          lastUpdatedTimestamp: Date.now(),
          completedAtTimestamp: item.completedAtTimestamp
            ? undefined
            : Date.now(),
        }
      }
      return item;
      })
    saveToStorage(storageKey, newShoppingList);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShoppingList(newShoppingList);
  };

  return (
    <>
      {/* {console.log("FlatList re-rendered")} */}
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
      ></FlatList>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    // justifyContent: "center",
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
