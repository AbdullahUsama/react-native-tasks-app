export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: TaskPriority;
  deadline?: Date;
}

export interface TaskList {
  id: string;
  name: string;
  type: "daily" | "weekly" | "monthly" | "custom";
  tasks: Task[];
}
