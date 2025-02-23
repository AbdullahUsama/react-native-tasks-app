import { Task, TaskPriority } from "../types/list";
import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import { Checkbox, Text, IconButton } from "react-native-paper";

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
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

const extractPriorityAndTitle = (
  fullTitle: string
): { title: string; priority: TaskPriority } => {
  const matches = fullTitle.match(/^(.*?)\s*\[(low|medium|high)\]$/);
  if (matches) {
    return {
      title: matches[1].trim(),
      priority: matches[2] as TaskPriority,
    };
  }
  return {
    title: fullTitle,
    priority: "medium", // default priority
  };
};

export const TaskItem = memo(function TaskItem({
  task,
  onToggle,
  onDelete,
}: TaskItemProps) {
  const { title, priority } = extractPriorityAndTitle(task.title);

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <Checkbox
          status={task.completed ? "checked" : "unchecked"}
          onPress={onToggle}
        />
        <View style={styles.textContent}>
          <View style={styles.titleContainer}>
            <Text
              style={[styles.title, task.completed && styles.completed]}
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text style={styles.separator}> - </Text>
            <PriorityBadge priority={priority} />
          </View>
          {task.description ? (
            <Text
              style={[styles.description, task.completed && styles.completed]}
              numberOfLines={2}
            >
              {task.description}
            </Text>
          ) : null}
          <View style={styles.metadata}>
            {task.deadline && (
              <Text
                style={[
                  styles.metadataText,
                  new Date(task.deadline).getTime() - new Date().getTime() <
                    0 && styles.overdueText,
                ]}
              >
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
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  separator: {
    marginHorizontal: 4,
    color: "#666",
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
  overdueText: {
    color: "#F44336",
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
});
