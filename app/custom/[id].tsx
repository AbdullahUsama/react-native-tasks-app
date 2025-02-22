import { View, StyleSheet, FlatList } from "react-native";
import { FAB, Text } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { TaskItem } from "../../components/TaskItem";
import { LoadingOverlay } from "../../components/LoadingOverlay";
import { ErrorMessage } from "../../components/ErrorMessage";
import { TaskDialog } from "../../components/TaskDialog";
import { useState, useCallback, useMemo } from "react";
import { useListStore } from "../../store/listStore";

export default function CustomListTasks() {
  const { id } = useLocalSearchParams();
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

  const list = useMemo(() => lists.find((list) => list.id === id), [lists, id]);

  const handleAddTask = useCallback(
    async (title: string, description: string) => {
      if (list) {
        await addTask(list.id, {
          title,
          description,
        });
        setDialogVisible(false);
      }
    },
    [list, addTask]
  );

  const handleToggleTask = useCallback(
    (taskId: string) => {
      if (list) toggleTask(list.id, taskId);
    },
    [list, toggleTask]
  );

  const handleRemoveTask = useCallback(
    (taskId: string) => {
      if (list) removeTask(list.id, taskId);
    },
    [list, removeTask]
  );

  const renderItem = useCallback(
    ({ item }) => (
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
});
