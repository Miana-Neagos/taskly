import { FlatList, StyleSheet, TextInput, View, Text } from "react-native";
import { theme } from "../theme";
import ShoppingListItem from "../components/ShoppingListItem";
import { useState } from "react";

type ShoppingListItemType = {
  id: string;
  name: string;
};

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// const initialList: ShoppingListItemType[] = [
//   { id: generateId(), name: "Coffee" },
//   { id: generateId(), name: "Tea" },
//   { id: generateId(), name: "Milk" },
// ];

export default function App() {
  const [value, setValue] = useState("");
  const [shoppingList, setShoppingList] =
    useState<ShoppingListItemType[]>([]);

  console.log("App component re-rendered");

  const handleSubmit = () => {
    if (value) {
      console.log(`this is handle submit and ${value}`);

      const newShoppingList = [
        { id: generateId(), name: value },
        ...shoppingList,
      ];
      setShoppingList(newShoppingList);
      setValue("");
    }
  };

  return (
    <>
      {console.log("FlatList re-rendered")}
      <FlatList
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>Shopping list is empty.</Text>
          </View>     }
        ListHeaderComponent={
          <TextInput
            style={styles.textInput}
            placeholder="E.g. Sugar"
            value={value}
            onChangeText={setValue}
            keyboardType="default"
            autoCapitalize="words"
            autoCorrect={true}
            underlineColorAndroid="transparent"
            onSubmitEditing={handleSubmit}
          />
        }
        data={shoppingList}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        stickyHeaderIndices={[0]}
        renderItem={({ item }) => {
          console.log(`Rendering item: ${item.name}`);

          return <ShoppingListItem name={item.name} />;
        }}
      ></FlatList>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    // justifyContent: "center",
    padding: 12,
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
  }
});
