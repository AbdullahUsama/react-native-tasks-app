import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import { Checkbox, Text, IconButton } from "react-native-paper";
import { Task } from "../types/list";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

const priorityColors = {
  low: "#8BC34A",
  medium: "#FFC107",
  high: "#F44336",
};

const getTimeLeft = (deadline: Date) => {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (diff < 0) return "Overdue";
  if (days > 0) return `${days}d left`;
  if (hours > 0) return `${hours}h left`;
  return "Due soon";
};

export const TaskItem = memo(function TaskItem({
  task,
  onToggle,
  onDelete,
}: TaskItemProps) {
  console.log("Task Item p task item:", task.priority);
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <Checkbox
          status={task.completed ? "checked" : "unchecked"}
          onPress={onToggle}
        />
        <View style={styles.textContent}>
          <Text
            style={[styles.title, task.completed && styles.completed]}
            numberOfLines={1}
          >
            {task.title}
            <Text
              style={[
                styles.priorityText,
                { color: priorityColors[task.priority] || "#000" },
              ]}
            >
              {" "}
              (
              {task.priority
                ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
                : "No Priority"}
              )
            </Text>
          </Text>
          {task.description ? (
            <Text
              style={[styles.description, task.completed && styles.completed]}
              numberOfLines={2}
            >
              {task.description}
            </Text>
          ) : null}
          <View style={styles.metadata}>
            {task.priority && (
              <Text
                style={[
                  styles.metadataText,
                  { color: priorityColors[task.priority] },
                ]}
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}{" "}
                Priority
              </Text>
            )}
            {task.deadline && (
              <Text style={styles.metadataText}>
                {getTimeLeft(new Date(task.deadline))}
              </Text>
            )}
          </View>
        </View>
      </View>
      <IconButton icon="delete-outline" onPress={onDelete} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
  },
  leftContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  textContent: {
    flex: 1,
    marginLeft: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  completed: {
    textDecorationLine: "line-through",
    opacity: 0.7,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  metadata: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  metadataText: {
    fontSize: 12,
    marginRight: 16,
    color: "#666",
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
