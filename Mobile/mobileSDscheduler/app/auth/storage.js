import * as SecureStore from "expo-secure-store";

const key = "user";
const storeUser = async (user) => {
  try {
    await SecureStore.setItemAsync(key, user);
  } catch (error) {
    console.log("Couldn't store user", error);
  }
};

const getUser = async () => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.log("Error getting user", error);
  }
};

const removeUser = async () => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.log("Error removing user", error);
  }
};

export default { getUser, removeUser, storeUser };
