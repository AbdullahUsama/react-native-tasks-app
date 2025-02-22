import { memo } from "react";
import { View, StyleSheet } from "react-native";
import { Checkbox, Text, IconButton } from "react-native-paper";
import { Task } from "../types/list";

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

export const TaskItem = memo(function TaskItem({
  task,
  onToggle,
  onDelete,
}: TaskItemProps) {
  return (
    <View style={styles.container}>
      <Checkbox
        status={task.completed ? "checked" : "unchecked"}
        onPress={onToggle}
      />
      <View style={styles.content}>
        <Text style={[styles.title, task.completed && styles.completed]}>
          {task.title}
        </Text>
        {task.description && (
          <Text style={styles.description}>{task.description}</Text>
        )}
      </View>
      <IconButton icon="delete" onPress={onDelete} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  content: {
    flex: 1,
    marginHorizontal: 8,
  },
  title: {
    fontSize: 16,
  },
  completed: {
    textDecorationLine: "line-through",
    opacity: 0.7,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
  },
});
