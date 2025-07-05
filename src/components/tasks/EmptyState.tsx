import { Plus, CheckSquare, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  type: 'no-tasks' | 'no-results' | 'no-completed' | 'no-pending';
  onCreateTask?: () => void;
  searchQuery?: string;
}

export function EmptyState({ type, onCreateTask, searchQuery }: EmptyStateProps) {
  const getEmptyStateContent = () => {
    switch (type) {
      case 'no-tasks':
        return {
          icon: CheckSquare,
          title: 'No tasks yet',
          description: 'Create your first task to get started with organizing your work.',
          action: onCreateTask && (
            <Button
              onClick={onCreateTask}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Task
            </Button>
          )
        };
      case 'no-results':
        return {
          icon: Search,
          title: 'No tasks found',
          description: searchQuery
            ? `No tasks match "${searchQuery}". Try adjusting your search terms.`
            : 'No tasks match your current filters.',
          action: null
        };
      case 'no-completed':
        return {
          icon: CheckSquare,
          title: 'No completed tasks',
          description: 'Complete some tasks to see them here. Keep up the great work!',
          action: null
        };
      case 'no-pending':
        return {
          icon: CheckSquare,
          title: 'All tasks completed!',
          description: 'Congratulations! You\'ve completed all your tasks. Time to add some new ones.',
          action: onCreateTask && (
            <Button
              onClick={onCreateTask}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Task
            </Button>
          )
        };
      default:
        return {
          icon: CheckSquare,
          title: 'No tasks',
          description: 'Nothing to show here.',
          action: null
        };
    }
  };

  const { icon: Icon, title, description, action } = getEmptyStateContent();

  return (
    <Card className="border-dashed border-2 border-muted-foreground/25">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="mb-4 p-3 rounded-full bg-muted/50">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
        {action}
      </CardContent>
    </Card>
  );
}