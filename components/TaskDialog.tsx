import React, { useRef, useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import {
  Dialog,
  Portal,
  Button,
  TextInput,
  SegmentedButtons,
  List,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TaskPriority } from "../types/list";

interface TaskDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (
    title: string,
    description: string,
    priority: TaskPriority,
    deadline?: Date
  ) => void;
  loading?: boolean;
}

export const TaskDialog = React.memo(
  ({ visible, onDismiss, onSubmit, loading }: TaskDialogProps) => {
    const titleRef = useRef("");
    const descriptionRef = useRef("");
    const [priority, setPriority] = useState<TaskPriority>("medium");
    const [deadline, setDeadline] = useState<Date | undefined>();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [, forceUpdate] = useState(0);

    const handleSubmit = useCallback(() => {
      if (!titleRef.current.trim()) return;

      console.log("Creating Task:", {
        title: titleRef.current.trim(),
        description: descriptionRef.current.trim(),
        priority,
        deadline,
      });
      onSubmit(
        titleRef.current.trim(),
        descriptionRef.current.trim(),
        priority,
        deadline
      );
      titleRef.current = "";
      descriptionRef.current = "";
      setPriority("medium");
      setDeadline(undefined);
      forceUpdate((x) => x + 1);
    }, [onSubmit, priority, deadline]);

    const handleDateChange = (event: any, selectedDate?: Date) => {
      setShowDatePicker(false);
      if (selectedDate) {
        const newDeadline = deadline || new Date();
        newDeadline.setFullYear(selectedDate.getFullYear());
        newDeadline.setMonth(selectedDate.getMonth());
        newDeadline.setDate(selectedDate.getDate());
        setDeadline(newDeadline);
      }
    };

    const handleTimeChange = (event: any, selectedTime?: Date) => {
      setShowTimePicker(false);
      if (selectedTime) {
        const newDeadline = deadline || new Date();
        newDeadline.setHours(selectedTime.getHours());
        newDeadline.setMinutes(selectedTime.getMinutes());
        setDeadline(newDeadline);
      }
    };
    console.log("priority", priority);
    return (
      <Portal>
        <Dialog visible={visible} onDismiss={onDismiss}>
          <Dialog.Title>New Task</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Task Title"
              defaultValue={titleRef.current}
              onChangeText={(text) => {
                titleRef.current = text;
                forceUpdate((x) => x + 1);
              }}
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Description (optional)"
              defaultValue={descriptionRef.current}
              onChangeText={(text) => {
                descriptionRef.current = text;
                forceUpdate((x) => x + 1);
              }}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
            />
            <SegmentedButtons
              value={priority}
              onValueChange={(value) => setPriority(value as TaskPriority)}
              buttons={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
              ]}
            />
            <List.Item
              title="Set Deadline"
              description={
                deadline ? deadline.toLocaleString() : "No deadline set"
              }
              left={(props) => <List.Icon {...props} icon="clock" />}
              onPress={() => setShowDatePicker(true)}
              style={styles.deadline}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onDismiss}>Cancel</Button>
            <Button
              onPress={handleSubmit}
              loading={loading}
              disabled={loading || !titleRef.current.trim()}
            >
              Create
            </Button>
          </Dialog.Actions>
        </Dialog>
        {showDatePicker && (
          <DateTimePicker
            value={deadline || new Date()}
            mode="date"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDeadline(selectedDate);
            }}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={deadline || new Date()}
            mode="time"
            onChange={handleTimeChange}
          />
        )}
      </Portal>
    );
  }
);

const styles = StyleSheet.create({
  input: {
    marginBottom: 12,
  },
  priority: {
    marginBottom: 12,
  },
  deadline: {
    paddingLeft: 0,
  },
});
