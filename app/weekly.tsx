import { View, StyleSheet, FlatList } from "react-native";
import { FAB, Text } from "react-native-paper";
import { TaskItem } from "../components/TaskItem";
import { LoadingOverlay } from "../components/LoadingOverlay";
import { ErrorMessage } from "../components/ErrorMessage";
import { TaskDialog } from "../components/TaskDialog";
import { useState, useCallback, useMemo } from "react";
import { useTaskList } from "../hooks/useTaskList";
import { Task } from "../types/list";

export default function WeeklyTasks() {
  const {
    list,
    isLoading,
    error,
    handleAddTask,
    handleToggleTask,
    handleRemoveTask,
    retry,
  } = useTaskList("weekly");
  const [dialogVisible, setDialogVisible] = useState(false);

  const handleCreateTask = useCallback(
    async (title: string, description: string) => {
      await handleAddTask(title, description);
      setDialogVisible(false);
    },
    [handleAddTask]
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
      {error && <ErrorMessage message={error} onRetry={retry} />}
      <FlatList
        data={list?.tasks || []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks yet</Text>}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setDialogVisible(true)}
        disabled={isLoading}
      />
      <TaskDialog
        visible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        onSubmit={handleCreateTask}
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
});
