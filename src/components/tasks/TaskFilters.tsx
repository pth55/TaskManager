import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type FilterType = 'all' | 'completed' | 'pending';
export type SortType = 'created' | 'dueDate' | 'priority' | 'title';

interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  sortBy: SortType;
  onSortChange: (sort: SortType) => void;
  taskCounts: {
    all: number;
    completed: number;
    pending: number;
  };
}

export function TaskFilters({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  sortBy,
  onSortChange,
  taskCounts
}: TaskFiltersProps) {
  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All Tasks', count: taskCounts.all },
    { key: 'pending', label: 'Pending', count: taskCounts.pending },
    { key: 'completed', label: 'Completed', count: taskCounts.completed },
  ];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-background/50 backdrop-blur-sm"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.key}
            variant={activeFilter === filter.key ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(filter.key)}
            className={`transition-all duration-200 ${
              activeFilter === filter.key
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                : 'hover:bg-accent'
            }`}
          >
            {filter.label}
            <Badge 
              variant="secondary" 
              className="ml-2 text-xs bg-background/20 text-current"
            >
              {filter.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px] bg-background/50 backdrop-blur-sm">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created">Date Created</SelectItem>
            <SelectItem value="dueDate">Due Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}