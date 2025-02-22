import { View, StyleSheet, FlatList } from "react-native";
import { FAB, Text } from "react-native-paper";
import { useListStore } from "../store/listStore";
import { TaskItem } from "../components/TaskItem";
import { LoadingOverlay } from "../components/LoadingOverlay";
import { ErrorMessage } from "../components/ErrorMessage";
import { TaskDialog } from "../components/TaskDialog";
import { useState, useCallback, useMemo } from "react";
import { AddCustomListFAB } from "../components/AddCustomListFAB";

export default function DailyTasks() {
  const {
    lists,
    isLoading,
    error,
    addTask,
    removeTask,
    toggleTask,
    loadLists,
  } = useListStore();
  const [dialogVisible, setDialogVisible] = useState(false);

  const dailyList = useMemo(
    () => lists.find((list) => list.type === "daily"),
    [lists]
  );

  const handleAddTask = useCallback(
    async (title: string, description: string) => {
      if (dailyList) {
        await addTask(dailyList.id, {
          title,
          description,
        });
        setDialogVisible(false);
      }
    },
    [dailyList, addTask]
  );

  const handleToggleTask = useCallback(
    (taskId: string) => {
      if (dailyList) toggleTask(dailyList.id, taskId);
    },
    [dailyList, toggleTask]
  );

  const handleRemoveTask = useCallback(
    (taskId: string) => {
      if (dailyList) removeTask(dailyList.id, taskId);
    },
    [dailyList, removeTask]
  );

  const renderItem = useCallback(
    ({ item }: { item: Task }) => (
      <TaskItem
        task={item}
        onToggle={() => handleToggleTask(item.id)}
        onDelete={() => handleRemoveTask(item.id)}
      />
    ),
    [handleToggleTask, handleRemoveTask]
  );

  return (
    <View style={styles.container}>
      {error && <ErrorMessage message={error} onRetry={loadLists} />}
      <FlatList
        data={dailyList?.tasks || []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks yet</Text>}
      />
      <FAB
        icon="plus"
        style={[styles.fab, styles.taskFab]}
        onPress={() => setDialogVisible(true)}
        disabled={isLoading}
      />
      <AddCustomListFAB />
      <TaskDialog
        visible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        onSubmit={handleAddTask}
        loading={isLoading}
      />
      {isLoading && <LoadingOverlay />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    opacity: 0.5,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  taskFab: {
    bottom: 80,
  },
});
