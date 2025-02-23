import { Task, TaskPriority } from "../types/list";
import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import { Checkbox, Text, IconButton } from "react-native-paper";

// Helper functions
const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case "low":
      return "#4CAF50";
    case "medium":
      return "#FF9800";
    case "high":
      return "#F44336";
    default:
      return "#757575";
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
    priority: "medium",
  };
};

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
  const { title, priority } = extractPriorityAndTitle(task.title);

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <View style={{ marginRight: 4 }}>
          <Checkbox
            status={task.completed ? "checked" : "unchecked"}
            onPress={onToggle}
          />
        </View>
        <View style={styles.textContent}>
          <View style={styles.titleContainer}>
            <View style={styles.titlePriorityContainer}>
              <Text
                style={[
                  styles.title,
                  task.completed && styles.completed,
                  { color: task.completed ? "#888" : "#1a1a1a" },
                ]}
                numberOfLines={1}
              >
                {title}
              </Text>
              <PriorityBadge priority={priority} />
            </View>
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
              <View style={styles.deadlineContainer}>
                <Text
                  style={[
                    styles.metadataText,
                    new Date(task.deadline).getTime() - new Date().getTime() <
                      0 && styles.overdueText,
                  ]}
                >
                  {getTimeLeft(new Date(task.deadline))}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <IconButton
        icon="delete-outline"
        onPress={onDelete}
        style={styles.deleteButton}
        iconColor="#FF5252"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderColor: "#f0f0f0",
    borderWidth: 1,
  },
  leftContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    marginRight: 4,
  },
  textContent: {
    flex: 1,
    marginLeft: 8,
  },
  titleContainer: {
    marginBottom: 4,
  },
  titlePriorityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  completed: {
    textDecorationLine: "line-through",
    opacity: 0.7,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    lineHeight: 20,
  },
  metadata: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  deadlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  metadataText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  overdueText: {
    color: "#FF5252",
    fontWeight: "600",
  },
  priorityBadge: {
    fontSize: 12,
    color: "white",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 16,
    overflow: "hidden",
    textTransform: "capitalize",
    fontWeight: "600",
  },
  deleteButton: {
    marginLeft: 8,
  },
});
