import { useState } from 'react';
import { format } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Circle,
  AlertCircle,
  Flag
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Task } from '@/api/tasks';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
}

export function TaskCard({ task, onEdit, onDelete, onToggleComplete }: TaskCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleComplete = async () => {
    setIsLoading(true);
    try {
      await onToggleComplete(task._id, !task.completed);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-3 w-3" />;
      case 'medium':
        return <Flag className="h-3 w-3" />;
      case 'low':
        return <Circle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <Card className={cn(
      "group transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
      task.completed && "opacity-75",
      isOverdue && "border-red-200 dark:border-red-800"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={task.completed}
              onCheckedChange={handleToggleComplete}
              disabled={isLoading}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-semibold text-base leading-tight",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
              {task.description && (
                <p className={cn(
                  "text-sm text-muted-foreground mt-1 line-clamp-2",
                  task.completed && "line-through"
                )}>
                  {task.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="h-8 w-8 p-0"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task._id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className={getPriorityColor(task.priority)}>
              {getPriorityIcon(task.priority)}
              <span className="ml-1 capitalize">{task.priority}</span>
            </Badge>
            {task.category && (
              <Badge variant="outline" className="text-xs">
                {task.category}
              </Badge>
            )}
            {isOverdue && (
              <Badge variant="destructive" className="text-xs">
                Overdue
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(task.dueDate), 'MMM dd')}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{format(new Date(task.createdAt), 'MMM dd')}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}