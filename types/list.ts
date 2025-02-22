export type TaskPriority = "Low" | "Medium" | "High";

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority?: TaskPriority;
  completed: boolean;
}

export interface TaskList {
  id: string;
  name: string;
  type: "daily" | "weekly" | "monthly" | "custom";
  tasks: Task[];
}
