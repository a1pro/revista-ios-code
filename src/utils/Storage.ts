import AsyncStorage from '@react-native-async-storage/async-storage';

export const getLocalStorageData = async (key: string) => {
  const value = await AsyncStorage.getItem(key);
  if (!value) {return null;} 
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn(
      `Could not parse "${key}" as JSON, returning raw value:`,
      value
    );
    return value; 
  }
};

export const storeLocalStorageData = async (key: string, value: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const deleteLocalStorageData = async (key: string) => {
  await AsyncStorage.removeItem(key); 
};
