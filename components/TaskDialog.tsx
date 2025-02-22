import React, { useRef, useCallback, useState } from "react";
import { Dialog, Portal, Button } from "react-native-paper";
import { TextInput, StyleSheet, Keyboard } from "react-native";

interface TaskDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (title: string, description: string) => void;
  loading?: boolean;
}

export const TaskDialog = React.memo(
  ({ visible, onDismiss, onSubmit, loading }: TaskDialogProps) => {
    const titleRef = useRef("");
    const descriptionRef = useRef("");
    const [, forceUpdate] = useState(0); // Force re-render when needed
    const descriptionInputRef = useRef<TextInput>(null);

    const handleChangeTitle = useCallback((text: string) => {
      titleRef.current = text;
      forceUpdate((x) => x + 1); // Trigger re-render
    }, []);

    const handleChangeDescription = useCallback((text: string) => {
      descriptionRef.current = text;
      forceUpdate((x) => x + 1);
    }, []);

    const handleSubmit = useCallback(() => {
      if (!titleRef.current.trim()) return;

      Keyboard.dismiss();
      onSubmit(titleRef.current.trim(), descriptionRef.current.trim());
      titleRef.current = "";
      descriptionRef.current = "";
      forceUpdate((x) => x + 1); // Reset fields
      onDismiss();
    }, [onSubmit, onDismiss]);

    const handleDismiss = useCallback(() => {
      Keyboard.dismiss();
      titleRef.current = "";
      descriptionRef.current = "";
      forceUpdate((x) => x + 1); // Reset fields
      onDismiss();
    }, [onDismiss]);

    return (
      <Portal>
        <Dialog visible={visible} onDismiss={handleDismiss}>
          <Dialog.Title>New Task</Dialog.Title>
          <Dialog.Content>
            <TextInput
              style={[styles.input, styles.titleInput]}
              placeholder="Task Title"
              defaultValue={titleRef.current}
              onChangeText={handleChangeTitle}
              autoFocus
              returnKeyType="next"
              onSubmitEditing={() => descriptionInputRef.current?.focus()}
              maxLength={100}
            />
            <TextInput
              ref={descriptionInputRef}
              style={[styles.input, styles.descriptionInput]}
              placeholder="Description (optional)"
              defaultValue={descriptionRef.current}
              onChangeText={handleChangeDescription}
              multiline
              maxLength={500}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleDismiss}>Cancel</Button>
            <Button
              onPress={handleSubmit}
              loading={loading}
              disabled={loading || !titleRef.current.trim()}
            >
              Create
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  }
);

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  titleInput: {
    marginBottom: 12,
    height: 45,
  },
  descriptionInput: {
    height: 100,
  },
});
