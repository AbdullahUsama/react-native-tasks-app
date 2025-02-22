import { useEffect } from "react";
import { useListStore } from "../store/listStore";

export function useInitializeLists() {
  const { lists, initialized, loadLists, addList } = useListStore();

  useEffect(() => {
    loadLists();
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const defaultLists = [
      { type: "daily", name: "Daily Tasks" },
      { type: "weekly", name: "Weekly Tasks" },
      { type: "monthly", name: "Monthly Tasks" },
    ] as const;

    defaultLists.forEach((defaultList) => {
      const exists = lists.some((list) => list.type === defaultList.type);
      if (!exists) {
        addList({
          name: defaultList.name,
          type: defaultList.type,
          tasks: [],
        });
      }
    });
  }, [initialized]);
}
