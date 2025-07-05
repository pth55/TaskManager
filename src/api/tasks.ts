import api from "./api";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
}

// Helper functions for localStorage
const TASKS_KEY = "tasks";

function loadTasksFromStorage(): Task[] {
  const data = localStorage.getItem(TASKS_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
  // If no tasks, initialize with default tasks
  const defaultTasks: Task[] = [
    {
      _id: "1",
      title: "Complete React assignment",
      description: "Build a task tracker application",
      completed: false,
      priority: "medium",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
    },
    {
      _id: "2",
      title: "Review JavaScript concepts",
      description: "Go through ES6+ features",
      completed: true,
      priority: "medium",
      createdAt: "2024-01-14T15:30:00Z",
      updatedAt: "2024-01-14T15:30:00Z",
    },
  ];
  saveTasksToStorage(defaultTasks);
  return defaultTasks;
}

function saveTasksToStorage(tasks: Task[]) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

// Description: Get all tasks for the authenticated user
export const getTasks = async (): Promise<{ tasks: Task[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tasks = loadTasksFromStorage();
      resolve({ tasks });
    }, 200);
  });
};

// Description: Create a new task
export const createTask = async (taskData: {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  category?: string;
}): Promise<{ task: Task; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tasks = loadTasksFromStorage();
      const newTask: Task = {
        _id: Date.now().toString(),
        title: taskData.title,
        description: taskData.description || "",
        completed: false,
        priority: taskData.priority || "medium",
        dueDate: taskData.dueDate,
        category: taskData.category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      tasks.unshift(newTask);
      saveTasksToStorage(tasks);
      resolve({
        task: newTask,
        message: "Task created successfully",
      });
    }, 200);
  });
};

// Description: Update an existing task
export const updateTask = async (
  taskId: string,
  taskData: Partial<Omit<Task, "_id" | "createdAt" | "updatedAt">>
): Promise<{ task: Task; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let tasks = loadTasksFromStorage();
      let updatedTask: Task | undefined;
      tasks = tasks.map((task) => {
        if (task._id === taskId) {
          updatedTask = {
            ...task,
            ...taskData,
            updatedAt: new Date().toISOString(),
          };
          return updatedTask;
        }
        return task;
      });
      saveTasksToStorage(tasks);
      resolve({
        task: updatedTask!,
        message: "Task updated successfully",
      });
    }, 200);
  });
};

// Description: Delete a task
export const deleteTask = async (
  taskId: string
): Promise<{ message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let tasks = loadTasksFromStorage();
      tasks = tasks.filter((task) => task._id !== taskId);
      saveTasksToStorage(tasks);
      resolve({
        message: "Task deleted successfully",
      });
    }, 200);
  });
};

// Description: Get task statistics
// Endpoint: GET /api/tasks/stats
// Request: {}
// Response: { stats: TaskStats }
export const getTaskStats = async (): Promise<{ stats: TaskStats }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tasks = loadTasksFromStorage();
      const total = tasks.length;
      const completed = tasks.filter((t) => t.completed).length;
      const pending = total - completed;
      resolve({
        stats: {
          total,
          completed,
          pending,
        },
      });
    }, 300);
  });
};
