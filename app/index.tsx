import React, { useRef, useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { BlurView } from "expo-blur";
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
import { Calendar } from "react-native-calendars";
import { MaterialIcons } from "@expo/vector-icons";

export default function Home() {
  const { lists, isLoading, error, addList, loadLists, removeList } =
    useListStore();
  const [createDialogVisible, setCreateDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const newListNameRef = useRef("");
  const [listToDelete, setListToDelete] = useState<string | null>(null);
  const router = useRouter();
  const [, forceUpdate] = useState(0);

  const handleCreateList = useCallback(async () => {
    const trimmedName = newListNameRef.current.trim();
    if (trimmedName) {
      await addList({ name: trimmedName, type: "custom", tasks: [] });
      newListNameRef.current = "";
      setCreateDialogVisible(false);
      Keyboard.dismiss();
      forceUpdate((x) => x + 1);
    }
  }, [addList]);

  return (
    <View style={styles.container}>
      {error && <ErrorMessage message={error} onRetry={loadLists} />}
      {calendarVisible && (
        <BlurView intensity={30} style={StyleSheet.absoluteFill} />
      )}
      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={`${item.tasks.length} tasks`}
            onPress={() => router.push(`/custom/${item.id}`)}
            onLongPress={() => {
              setListToDelete(item.id);
              setDeleteDialogVisible(true);
            }}
          />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No lists yet</Text>}
      />
      <FAB
        icon="calendar"
        style={styles.calendarFab}
        onPress={() => setCalendarVisible(!calendarVisible)}
      />
      {calendarVisible && (
        <View style={styles.calendarContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setCalendarVisible(false)}
          >
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>
          <Calendar style={styles.calendar} />
        </View>
      )}
      <FAB
        icon="plus"
        label="New List"
        style={styles.fab}
        onPress={() => setCreateDialogVisible(true)}
        disabled={isLoading}
      />
      <Portal>
        <Dialog
          visible={createDialogVisible}
          onDismiss={() => setCreateDialogVisible(false)}
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
            <Button onPress={() => setCreateDialogVisible(false)}>
              Cancel
            </Button>
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
      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Delete List</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this list?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>
              Cancel
            </Button>
            <Button
              onPress={async () => {
                if (listToDelete) {
                  await removeList(listToDelete);
                  setListToDelete(null);
                  setDeleteDialogVisible(false);
                }
              }}
            >
              Delete
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
  calendarFab: { position: "absolute", margin: 16, left: 0, bottom: 0 },
  calendarContainer: {
    position: "absolute",
    top: "20%",
    left: "10%",
    right: "10%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "red",
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  calendar: { marginTop: 16 },
});
