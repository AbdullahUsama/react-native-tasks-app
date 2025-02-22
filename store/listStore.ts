import { create } from "zustand";
import { TaskList, Task } from "../types/list";
import { storage } from "../services/storage";

interface ListStore {
  lists: TaskList[];
  initialized: boolean;
  isLoading: boolean;
  error: string | null;
  loadLists: () => Promise<void>;
  addList: (list: Omit<TaskList, "id">) => Promise<void>;
  removeList: (id: string) => Promise<void>;
  addTask: (listId: string, task: Omit<Task, "id">) => Promise<void>;
  removeTask: (listId: string, taskId: string) => Promise<void>;
  toggleTask: (listId: string, taskId: string) => Promise<void>;
  clearError: () => void;
}

export const useListStore = create<ListStore>((set, get) => ({
  lists: [],
  initialized: false,
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  loadLists: async () => {
    try {
      set({ isLoading: true, error: null });
      const lists = await storage.loadLists();
      set({ lists, initialized: true });
    } catch (error) {
      set({ error: "Failed to load lists" });
    } finally {
      set({ isLoading: false });
    }
  },

  addList: async (list) => {
    try {
      set({ isLoading: true, error: null });
      const newList = { ...list, id: Math.random().toString() };
      const newLists = [...get().lists, newList];
      await storage.saveLists(newLists);
      set({ lists: newLists });
    } catch (error) {
      set({ error: "Failed to add list" });
    } finally {
      set({ isLoading: false });
    }
  },

  removeList: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const newLists = get().lists.filter((list) => list.id !== id);
      await storage.saveLists(newLists);
      set({ lists: newLists });
    } catch (error) {
      set({ error: "Failed to remove list" });
    } finally {
      set({ isLoading: false });
    }
  },

  addTask: async (listId, task) => {
    try {
      set({ isLoading: true, error: null });
      const newLists = get().lists.map((list) =>
        list.id === listId
          ? {
              ...list,
              tasks: [
                ...list.tasks,
                { ...task, id: Math.random().toString(), completed: false },
              ],
            }
          : list
      );
      await storage.saveLists(newLists);
      set({ lists: newLists });
    } catch (error) {
      set({ error: "Failed to add task" });
    } finally {
      set({ isLoading: false });
    }
  },

  removeTask: async (listId: string, taskId: string) => {
    try {
      const currentLists = get().lists;
      const listIndex = currentLists.findIndex((list) => list.id === listId);
      if (listIndex === -1) return;

      const list = currentLists[listIndex];
      const newLists = [...currentLists];
      newLists[listIndex] = {
        ...list,
        tasks: list.tasks.filter((task) => task.id !== taskId),
      };

      set({ lists: newLists });
      await storage.saveLists(newLists);
    } catch (error) {
      set({ error: "Failed to remove task" });
    }
  },

  toggleTask: async (listId: string, taskId: string) => {
    try {
      const currentLists = get().lists;
      const listIndex = currentLists.findIndex((list) => list.id === listId);
      if (listIndex === -1) return;

      const list = currentLists[listIndex];
      const taskIndex = list.tasks.findIndex((task) => task.id === taskId);
      if (taskIndex === -1) return;

      const newLists = [...currentLists];
      newLists[listIndex] = {
        ...list,
        tasks: [
          ...list.tasks.slice(0, taskIndex),
          {
            ...list.tasks[taskIndex],
            completed: !list.tasks[taskIndex].completed,
          },
          ...list.tasks.slice(taskIndex + 1),
        ],
      };

      set({ lists: newLists });
      await storage.saveLists(newLists);
    } catch (error) {
      set({ error: "Failed to toggle task" });
    }
  },
}));
