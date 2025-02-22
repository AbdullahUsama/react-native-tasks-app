import React, { useRef, useCallback, useState } from "react";
import { View, StyleSheet, FlatList, Keyboard } from "react-native";
import {
  Text,
  List,
  FAB,
  Portal,
  Dialog,
  TextInput,
  Button,
} from "react-native-paper";
import { useListStore } from "../store/listStore";
import { useRouter } from "expo-router";
import { LoadingOverlay } from "../components/LoadingOverlay";
import { ErrorMessage } from "../components/ErrorMessage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TaskList } from "../types/list";

export default function Home() {
  const { lists, isLoading, error, addList, loadLists } = useListStore();
  const [dialogVisible, setDialogVisible] = useState(false);
  const newListNameRef = useRef<string>(""); // Use ref for input field
  const [, forceUpdate] = useState(0); // Force re-render when needed
  const router = useRouter();

  const handleCreateList = useCallback(async () => {
    const trimmedName = newListNameRef.current.trim();
    if (trimmedName) {
      await addList({
        name: trimmedName,
        type: "custom",
        tasks: [],
      });
      newListNameRef.current = "";
      forceUpdate((x) => x + 1);
      setDialogVisible(false);
      Keyboard.dismiss();
    }
  }, [addList]);

  const getListIcon = (type: string) => {
    switch (type) {
      case "daily":
        return "calendar-today";
      case "weekly":
        return "calendar-week";
      case "monthly":
        return "calendar-month";
      default:
        return "folder";
    }
  };

  const RenderItem = React.memo(({ item }: { item: TaskList }) => (
    <List.Item
      title={
        item.type === "custom"
          ? item.name
          : `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} Tasks`
      }
      description={`${item.tasks.length} tasks`}
      left={(props) => (
        <MaterialCommunityIcons
          name={getListIcon(item.type)}
          size={24}
          color={props.color}
          style={{ marginLeft: 8, alignSelf: "center" }}
        />
      )}
      onPress={() =>
        router.push(
          item.type === "custom" ? `/custom/${item.id}` : `/${item.type}`
        )
      }
    />
  ));

  return (
    <View style={styles.container}>
      {error && <ErrorMessage message={error} onRetry={loadLists} />}
      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RenderItem item={item} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No lists yet</Text>}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
      />
      <FAB
        icon="plus"
        label="New List"
        style={styles.fab}
        onPress={() => setDialogVisible(true)}
        disabled={isLoading}
      />
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Title>Create New List</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="List Name"
              defaultValue={newListNameRef.current}
              onChangeText={(text) => {
                newListNameRef.current = text;
                forceUpdate((x) => x + 1);
              }}
              mode="outlined"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button
              onPress={handleCreateList}
              loading={isLoading}
              disabled={isLoading || !newListNameRef.current.trim()}
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
  container: { flex: 1, padding: 16 },
  emptyText: { textAlign: "center", marginTop: 20, opacity: 0.5 },
  fab: { position: "absolute", margin: 16, right: 0, bottom: 0 },
});
