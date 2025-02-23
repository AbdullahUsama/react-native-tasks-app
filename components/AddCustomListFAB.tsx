import React, { useState, useCallback } from "react";
import { StyleSheet } from "react-native";
import { FAB, Portal, Dialog, TextInput, Button } from "react-native-paper";
import { useListStore } from "../store/listStore";

export function AddCustomListFAB() {
  const { addList, isLoading } = useListStore();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newListName, setNewListName] = useState("");

  const handleCreateList = useCallback(async () => {
    if (newListName.trim()) {
      await addList({
        name: newListName,
        type: "custom",
        tasks: [],
      });
      setNewListName("");
      setDialogVisible(false);
    }
  }, [newListName, addList]);

  return (
    <>
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
          <Dialog.Title>Create New List1</Dialog.Title>
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
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
