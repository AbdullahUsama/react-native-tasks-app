import { useListStore } from "../store/listStore";
import { TaskList } from "../types/list";

export function useTaskList(type: TaskList["type"]) {
  const {
    lists,
    isLoading,
    error,
    addTask,
    removeTask,
    toggleTask,
    loadLists,
  } = useListStore();

  const list = lists.find((list) => list.type === type);

  const handleAddTask = async (title: string, description: string) => {
    if (list) {
      await addTask(list.id, {
        title,
        description,
      });
    }
  };

  return {
    list,
    isLoading,
    error,
    handleAddTask,
    handleToggleTask: async (taskId: string) => {
      if (list) await toggleTask(list.id, taskId);
    },
    handleRemoveTask: async (taskId: string) => {
      if (list) await removeTask(list.id, taskId);
    },
    retry: loadLists,
  };
}
