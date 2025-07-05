import { useState, useEffect, useMemo } from 'react';
import { Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/contexts/AuthContext';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskFilters, FilterType, SortType } from '@/components/tasks/TaskFilters';
import { TaskStats } from '@/components/tasks/TaskStats';
import { EmptyState } from '@/components/tasks/EmptyState';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
  Task
} from '@/api/tasks';

export function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('created');

  useEffect(() => {
    loadTasks();
    loadStats();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const response = await getTasks();
      setTasks(response.tasks);
      console.log('Tasks loaded successfully:', response.tasks.length);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tasks. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await getTaskStats();
      setStats(response.stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleCreateTask = async (taskData: any) => {
    try {
      const response = await createTask(taskData);
      setTasks(prev => [response.task, ...prev]);
      setStats(prev => ({ ...prev, total: prev.total + 1, pending: prev.pending + 1 }));
      toast({
        title: 'Success',
        description: 'Task created successfully!',
      });
      console.log('Task created:', response.task.title);
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to create task. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateTask = async (taskData: any) => {
    if (!editingTask) return;

    try {
      const response = await updateTask(editingTask._id, taskData);
      setTasks(prev => prev.map(task => 
        task._id === editingTask._id ? response.task : task
      ));
      toast({
        title: 'Success',
        description: 'Task updated successfully!',
      });
      console.log('Task updated:', response.task.title);
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    try {
      const response = await updateTask(taskId, { completed });
      setTasks(prev => prev.map(task => 
        task._id === taskId ? { ...task, completed } : task
      ));
      setStats(prev => ({
        ...prev,
        completed: completed ? prev.completed + 1 : prev.completed - 1,
        pending: completed ? prev.pending - 1 : prev.pending + 1,
      }));
      toast({
        title: 'Success',
        description: completed ? 'Task marked as completed!' : 'Task marked as pending!',
      });
      console.log('Task toggled:', taskId, completed);
    } catch (error) {
      console.error('Error toggling task:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTask = async () => {
    if (!deletingTaskId) return;

    try {
      await deleteTask(deletingTaskId);
      const taskToDelete = tasks.find(t => t._id === deletingTaskId);
      setTasks(prev => prev.filter(task => task._id !== deletingTaskId));
      setStats(prev => ({
        total: prev.total - 1,
        completed: taskToDelete?.completed ? prev.completed - 1 : prev.completed,
        pending: taskToDelete?.completed ? prev.pending : prev.pending - 1,
      }));
      toast({
        title: 'Success',
        description: 'Task deleted successfully!',
      });
      console.log('Task deleted:', deletingTaskId);
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeletingTaskId(null);
    }
  };

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    switch (activeFilter) {
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      case 'pending':
        filtered = filtered.filter(task => !task.completed);
        break;
      default:
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'created':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [tasks, searchQuery, activeFilter, sortBy]);

  const taskCounts = useMemo(() => {
    const searchFiltered = searchQuery
      ? tasks.filter(task =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.category?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : tasks;

    return {
      all: searchFiltered.length,
      completed: searchFiltered.filter(task => task.completed).length,
      pending: searchFiltered.filter(task => !task.completed).length,
    };
  }, [tasks, searchQuery]);

  const getEmptyStateType = (): 'no-tasks' | 'no-results' | 'no-completed' | 'no-pending' => {
    if (tasks.length === 0) return 'no-tasks';
    if (filteredAndSortedTasks.length === 0) {
      if (activeFilter === 'completed') return 'no-completed';
      if (activeFilter === 'pending') return 'no-pending';
      return 'no-results';
    }
    return 'no-tasks';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-6 border backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
            <User className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.email || 'User'}!</h1>
        </div>
        <p className="text-muted-foreground">
          Stay organized and productive with your personal task management dashboard.
        </p>
      </div>

      {/* Task Statistics */}
      <TaskStats stats={stats} />

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex-1 w-full sm:w-auto">
          <TaskFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            taskCounts={taskCounts}
          />
        </div>
        <Button
          onClick={() => {
            setEditingTask(null);
            setIsFormOpen(true);
          }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Task
        </Button>
      </div>

      {/* Tasks Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : filteredAndSortedTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={(task) => {
                setEditingTask(task);
                setIsFormOpen(true);
              }}
              onDelete={setDeletingTaskId}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          type={getEmptyStateType()}
          onCreateTask={() => {
            setEditingTask(null);
            setIsFormOpen(true);
          }}
          searchQuery={searchQuery}
        />
      )}

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingTaskId} onOpenChange={() => setDeletingTaskId(null)}>
        <AlertDialogContent className="bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTask}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}