import AsyncStorage from "@react-native-async-storage/async-storage";
import { TaskList } from "../types/list";

const STORAGE_KEY = "task-app:lists";

export const storage = {
  async saveLists(lists: TaskList[]) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
    } catch (error) {
      console.error("Error saving lists:", error);
    }
  },

  async loadLists(): Promise<TaskList[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error loading lists:", error);
      return [];
    }
  },
};
