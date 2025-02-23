import { View, StyleSheet, FlatList } from "react-native";
import {
  FAB,
  List,
  Portal,
  Dialog,
  TextInput,
  Button,
  Text,
} from "react-native-paper";
import { useListStore } from "../store/listStore";
import { useState } from "react";
import { useRouter } from "expo-router";
import { LoadingOverlay } from "../components/LoadingOverlay";
import { ErrorMessage } from "../components/ErrorMessage";
import { useTaskList } from "../hooks/useTaskList";

export default function CustomLists() {
  const { lists, isLoading, error, addList, loadLists, removeList } =
    useListStore();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [listToDelete, setListToDelete] = useState<string | null>(null);
  const router = useRouter();
  const { handleAddTask } = useTaskList("custom");

  const customLists = lists.filter((list) => list.type === "custom");

  const handleCreateList = async () => {
    if (newListName.trim()) {
      await addList({
        name: newListName,
        type: "custom",
        tasks: [],
      });
      setNewListName("");
      setDialogVisible(false);
    }
  };

  const confirmDeleteList = (listId: string) => {
    setListToDelete(listId);
    setDialogVisible(true);
  };

  const deleteList = async () => {
    if (listToDelete) {
      await removeList(listToDelete);
      setListToDelete(null);
      setDialogVisible(false);
    }
  };

  const addNewTask = () => {
    handleAddTask("New Task Title", "Task Description", "medium");
  };

  return (
    <View style={styles.container}>
      {error && <ErrorMessage message={error} onRetry={loadLists} />}
      <FlatList
        data={customLists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={`${item.tasks.length} tasks`}
            left={(props) => <List.Icon {...props} icon="folder" />}
            onPress={() => router.push(`/custom/${item.id}`)}
            onLongPress={() => confirmDeleteList(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No custom lists yet</Text>
        }
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setDialogVisible(true)}
        disabled={isLoading}
      />

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Title>Delete List</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this list?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={deleteList}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {isLoading && <LoadingOverlay />}
      <Button onPress={addNewTask}>Add Task</Button>
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
