// export function orderShoppingList(shoppingList) {
//   return shoppingList.sort((item1, item2) => {
//     if (item1.completedAtTimestamp && item2.completedAtTimestamp) {
//       return item2.completedAtTimestamp - item1.completedAtTimestamp;
//     }

//     if (item1.completedAtTimestamp && !item2.completedAtTimestamp) {
//       return 1;
//     }

//     if (!item1.completedAtTimestamp && item2.completedAtTimestamp) {
//       return -1;
//     }

//     if (!item1.completedAtTimestamp && !item2.completedAtTimestamp) {
//       return item2.lastUpdatedTimestamp - item1.lastUpdatedTimestamp;
//     }

//     return 0;
//   });
// }

export function newSortingList(shoppingList) {
  return shoppingList.sort((item1, item2) => {
    if (!item1.completedAtTimestamp && item2.completedAtTimestamp) return -1;
    if (item1.completedAtTimestamp && !item2.completedAtTimestamp) return 1;
    return (item2.completedAtTimestamp || item2.lastUpdatedTimestamp) -
           (item1.completedAtTimestamp || item1.lastUpdatedTimestamp);
  });
}
