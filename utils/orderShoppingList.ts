import { ShoppingListItemType } from "../app";

export function orderShoppingList(shoppingList: ShoppingListItemType[]):ShoppingListItemType[] {
  return shoppingList.sort((item1, item2) => {
    if (!item1.completedAtTimestamp && item2.completedAtTimestamp) return -1;
    if (item1.completedAtTimestamp && !item2.completedAtTimestamp) return 1;
    return (item2.completedAtTimestamp || item2.lastUpdatedTimestamp) -
    (item1.completedAtTimestamp || item1.lastUpdatedTimestamp);
  });
}
