'use client';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter, Check, X, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

type FilterOptions = {
  priority?: string[];
  status?: string[];
  labels?: string[];
};

interface TaskFiltersProps {
  availableLabels: string[];
  filters: FilterOptions;
  onFilterChange: (type: keyof FilterOptions, value: string) => void;
  onClearFilters: () => void;
}

export function TaskFilters({
  availableLabels,
  filters,
  onFilterChange,
  onClearFilters,
}: TaskFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const activeFiltersCount = [
    ...(filters.priority || []),
    ...(filters.status || []),
    ...(filters.labels || []),
  ].length;

  const toggleFilter = (type: keyof FilterOptions, value: string) => {
    const currentValues = filters[type] || [];
    if (currentValues.includes(value)) {
      onFilterChange(type, value);
    } else {
      onFilterChange(type, value);
    }
  };

  const filterItems = (items: string[]) => {
    return items.filter(item =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="flex items-center gap-2 mr-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="relative">
            <Filter className="mr-2 h-4 w-4" />
            Filter
            {activeFiltersCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 p-0 mr-4">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search filters..."
                className="pl-9 h-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="h-[300px]">
            <div className="p-2 space-y-4">
              {/* Priority Filter */}
              <div>
                <h3 className="text-sm font-medium mb-2 px-2">Priority</h3>
                <div className="space-y-1">
                  {filterItems(['LOW', 'MEDIUM', 'HIGH']).map((priority) => (
                    <div
                      key={priority}
                      className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-pointer"
                      onClick={() => toggleFilter('priority', priority)}
                    >
                      <Check
                        className={`h-4 w-4 ${
                          filters.priority?.includes(priority)
                            ? 'opacity-100'
                            : 'opacity-0'
                        }`}
                      />
                      <span>{priority}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <h3 className="text-sm font-medium mb-2 px-2">Status</h3>
                <div className="space-y-1">
                  {filterItems(['TODO', 'IN_PROGRESS', 'DONE']).map((status) => (
                    <div
                      key={status}
                      className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-pointer"
                      onClick={() => toggleFilter('status', status)}
                    >
                      <Check
                        className={`h-4 w-4 ${
                          filters.status?.includes(status)
                            ? 'opacity-100'
                            : 'opacity-0'
                        }`}
                      />
                      <span>{status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Labels Filter */}
              {availableLabels.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2 px-2">Labels</h3>
                  <div className="space-y-1">
                    {filterItems(availableLabels).map((label) => (
                      <div
                        key={label}
                        className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-pointer"
                        onClick={() => toggleFilter('labels', label)}
                      >
                        <Check
                          className={`h-4 w-4 ${
                            filters.labels?.includes(label)
                              ? 'opacity-100'
                              : 'opacity-0'
                          }`}
                        />
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground"
              onClick={() => {
                onClearFilters();
                setSearchTerm('');
              }}
            >
              Clear all filters
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Active filters display with horizontal scrolling */}
      <div className="relative flex-1 max-w-[400px]">
        <ScrollArea className="w-full">
          <div className="flex justify-center gap-2 pb-4">
            {filters.priority?.map((priority) => (
              <Badge
                key={`priority-${priority}`}
                variant="secondary"
                className="flex items-center gap-1 flex-shrink-0"
              >
                {priority}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => onFilterChange('priority', priority)}
                />
              </Badge>
            ))}
            {filters.status?.map((status) => (
              <Badge
                key={`status-${status}`}
                variant="secondary"
                className="flex items-center gap-1 flex-shrink-0"
              >
                {status}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => onFilterChange('status', status)}
                />
              </Badge>
            ))}
            {filters.labels?.map((label) => (
              <Badge
                key={`label-${label}`}
                variant="secondary"
                className="flex items-center gap-1 flex-shrink-0"
              >
                {label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => onFilterChange('labels', label)}
                />
              </Badge>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {activeFiltersCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onClearFilters();
            setSearchTerm('');
          }}
          className="text-muted-foreground flex-shrink-0"
        >
          Clear all
        </Button>
      )}
    </div>
  );
}