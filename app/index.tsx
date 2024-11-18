import { FlatList, StyleSheet, TextInput, View, Text } from "react-native";
import { theme } from "../theme";
import ShoppingListItem from "../components/ShoppingListItem";
import { useState } from "react";
import { newSortingList } from "../utils/orderShoppingList";

type ShoppingListItemType = {
  id: string;
  name: string;
  completedAtTimestamp?: number;
  lastUpdatedTimestamp: number;
};

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export default function App() {
  const [typedValue, setTypedValue] = useState("");
  const [shoppingList, setShoppingList] = useState<ShoppingListItemType[]>([]);

  // console.log("App component re-rendered");

  const handleSubmit = () => {
    if (typedValue) {
      // console.log(`this is handle submit and ${value}`);
      const newShoppingList = [
        { id: generateId(), name: typedValue, lastUpdatedTimestamp: Date.now() },
        ...shoppingList,
      ];
      setShoppingList(newShoppingList);
      setTypedValue("");
    }
  };

  const handleDelete = (id: string) => {
    const newShoppingList = shoppingList.filter((item) => item.id !== id);
    setShoppingList(newShoppingList);
  };

  const handleToggleComplete = (id: string) => {
    const newShoppingList = shoppingList.map((item) =>
      item.id === id
        ? {
            ...item,
            lastUpdatedTimestamp: Date.now(),
            completedAtTimestamp: item.completedAtTimestamp
              ? undefined
              : Date.now(),
          }
        : item
    );
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
        data={newSortingList(shoppingList)}
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
