import React, { useRef, useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Dialog,
  Portal,
  Button,
  TextInput,
  SegmentedButtons,
  List,
  useTheme,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TaskPriority } from "../types/list";

interface TaskDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (title: string, description: string, deadline?: Date) => void;
  loading?: boolean;
}

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case "low":
      return "#4CAF50"; // Green
    case "medium":
      return "#FF9800"; // Orange
    case "high":
      return "#F44336"; // Red
    default:
      return "#757575"; // Default gray
  }
};

const PriorityBadge = ({ priority }: { priority: TaskPriority }) => (
  <Text
    style={[
      styles.priorityBadge,
      { backgroundColor: getPriorityColor(priority) },
    ]}
  >
    {priority}
  </Text>
);

export const TaskDialog = React.memo(
  ({ visible, onDismiss, onSubmit, loading }: TaskDialogProps) => {
    const theme = useTheme();
    const titleRef = useRef("");
    const descriptionRef = useRef("");
    const [deadline, setDeadline] = useState<Date | undefined>();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [, forceUpdate] = useState(0);
    const [priority, setPriority] = useState<TaskPriority>("medium");

    const handleSubmit = useCallback(() => {
      if (!titleRef.current.trim()) return;

      const baseTitle = titleRef.current.trim();
      // Now we'll let the UI handle the priority display
      const titleWithPriority = `${baseTitle} [${priority}]`;
      onSubmit(titleWithPriority, descriptionRef.current.trim(), deadline);

      titleRef.current = "";
      descriptionRef.current = "";
      setPriority("medium");
      setDeadline(undefined);
      forceUpdate((x) => x + 1);
    }, [onSubmit, deadline, priority]);

    const handleDateChange = (event: any, selectedDate?: Date) => {
      setShowDatePicker(false);
      if (selectedDate) {
        const newDeadline = deadline || new Date();
        newDeadline.setFullYear(selectedDate.getFullYear());
        newDeadline.setMonth(selectedDate.getMonth());
        newDeadline.setDate(selectedDate.getDate());
        setDeadline(newDeadline);
        setShowTimePicker(true); // Automatically show time picker after date selection
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
            <View style={styles.prioritySection}>
              <Text style={styles.priorityLabel}>Priority:</Text>
              <View style={styles.priorityPreview}>
                <Text></Text>
                <Text style={styles.previewTitle}>
                  {titleRef.current || "Task"}
                </Text>
                <Text> - </Text>
                <PriorityBadge priority={priority} />
              </View>
            </View>
            <SegmentedButtons
              value={priority}
              onValueChange={(value) => setPriority(value as TaskPriority)}
              buttons={[
                {
                  value: "low",
                  label: "Low",
                  style: {
                    backgroundColor: priority === "low" ? "#E8F5E9" : undefined,
                  },
                },
                {
                  value: "medium",
                  label: "Medium",
                  style: {
                    backgroundColor:
                      priority === "medium" ? "#FFF3E0" : undefined,
                  },
                },
                {
                  value: "high",
                  label: "High",
                  style: {
                    backgroundColor:
                      priority === "high" ? "#FFEBEE" : undefined,
                  },
                },
              ]}
              style={styles.segmentedButtons}
            />
            {/* <List.Item
              title="Set Deadline"
              description={
                deadline ? deadline.toLocaleString() : "No deadline set"
              }
              left={(props) => <List.Icon {...props} icon="clock" />}
              onPress={() => setShowDatePicker(true)}
              style={styles.deadline}
            /> */}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onDismiss}>Cancel</Button>
            <Button
              onPress={handleSubmit}
              loading={loading}
              disabled={loading || !titleRef.current.trim()}
              mode="contained"
            >
              Create
            </Button>
          </Dialog.Actions>
        </Dialog>
        {showDatePicker && (
          <DateTimePicker
            value={deadline || new Date()}
            mode="date"
            onChange={handleDateChange}
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
  deadline: {
    paddingLeft: 0,
    marginTop: 12,
  },
  prioritySection: {
    marginVertical: 12,
  },
  priorityLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  priorityPreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  previewTitle: {
    fontWeight: "500",
  },
  priorityBadge: {
    fontSize: 12,
    color: "white",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    overflow: "hidden",
    textTransform: "capitalize",
  },
  segmentedButtons: {
    marginBottom: 12,
  },
});
