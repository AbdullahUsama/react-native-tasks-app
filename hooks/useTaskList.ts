import { useListStore } from "../store/listStore";
import { TaskList, TaskPriority } from "../types/list";

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

  const handleAddTask = async (
    title: string,
    description: string,
    priority: TaskPriority = "medium"
  ) => {
    if (list) {
      console.log("priority use task list: ", list);

      await addTask(list.id, {
        title,
        description,
        completed: false,
        priority,
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
