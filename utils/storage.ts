import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getFromStorage(key: string) {
  try {
    const data = await AsyncStorage.getItem(key);
    // console.log(`this is GET STORAGE and the data is:`, data);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function saveToStorage(key: string, data: object) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    // console.log(`this is SET STORAGE and the data is:`, data);
    
  } catch {
    return null;
  }
}