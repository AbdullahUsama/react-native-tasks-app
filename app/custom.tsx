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

export default function CustomLists() {
  const { lists, isLoading, error, addList, loadLists } = useListStore();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newListName, setNewListName] = useState("");
  const router = useRouter();

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
          <Dialog.Title>Create New Listt</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="List Name"
              value={newListName}
              onChangeText={setNewListName}
              mode="outlined"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button
              onPress={handleCreateList}
              loading={isLoading}
              disabled={isLoading || !newListName.trim()}
            >
              Create
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
