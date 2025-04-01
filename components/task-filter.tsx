import { useState, useEffect, JSX } from 'react';
import { Check, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label, TaskPriority, TaskStatus } from '@/lib/db';
import { useLabelsApi } from '@/hooks/use-labels-api';
import { useLabelUpdates } from '@/hooks/use-label-updates';
import { TaskFilterOptions } from '@/hooks/use-tasks-api';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface TaskFilterProps {
  onFilterChange: (filters: TaskFilterOptions) => void;
  activeFilters: TaskFilterOptions;
  resetTrigger?: number;
}
/**
 * TaskFilter component for filtering tasks in the navigation header
 * @param props - Component props
 * @returns JSX element with the filter UI
 */
export function TaskFilter({
  onFilterChange,
  activeFilters,
  resetTrigger = 0,
}: TaskFilterProps): JSX.Element {
  const { labels, fetchLabels, isLoading: isLabelsLoading } = useLabelsApi();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | null>(
    activeFilters.priority || null
  );
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | null>(
    activeFilters.status || null
  );
  const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);
  const [sortBy, setSortBy] = useState<string>(activeFilters.sortBy || 'dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(activeFilters.sortOrder || 'asc');
  useEffect(() => {
    fetchLabels().catch(console.error);
  }, [fetchLabels]);
  useLabelUpdates(() => {
    fetchLabels().catch(console.error);
  });
  useEffect(() => {
    if (activeFilters.labelIds && activeFilters.labelIds.length > 0 && labels.length > 0) {
      const filteredLabels = labels.filter(label => activeFilters.labelIds?.includes(label.id));
      setSelectedLabels(filteredLabels);
    } else {
      setSelectedLabels([]);
    }
    setSelectedPriority(activeFilters.priority || null);
    setSelectedStatus(activeFilters.status || null);
    setSortBy(activeFilters.sortBy || 'dueDate');
    setSortOrder(activeFilters.sortOrder || 'asc');
  }, [activeFilters, labels]);
  useEffect(() => {
    if (resetTrigger > 0) {
      setSelectedPriority(null);
      setSelectedStatus(null);
      setSelectedLabels([]);
      setSortBy('dueDate');
      setSortOrder('asc');
    }
  }, [resetTrigger]);
  const applyFilters = (): void => {
    const newFilters: TaskFilterOptions = {
      priority: selectedPriority,
      status: selectedStatus,
      labelIds: selectedLabels.map(label => label.id),
      sortBy,
      sortOrder,
    };
    onFilterChange(newFilters);
    setIsOpen(false);
  };
  const clearFilters = (): void => {
    setSelectedPriority(null);
    setSelectedStatus(null);
    setSelectedLabels([]);
    setSortBy('dueDate');
    setSortOrder('asc');
    onFilterChange({});
    setIsOpen(false);
  };
  const toggleLabel = (label: Label): void => {
    setSelectedLabels(prev => {
      const isSelected = prev.some(l => l.id === label.id);
      if (isSelected) {
        return prev.filter(l => l.id !== label.id);
      } else {
        return [...prev, label];
      }
    });
  };
  const activeFilterCount =
    (selectedPriority ? 1 : 0) +
    (selectedStatus ? 1 : 0) +
    selectedLabels.length +
    (sortBy !== 'dueDate' ? 1 : 0) +
    (sortOrder !== 'asc' ? 1 : 0);
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-2 lg:px-3 relative"
          aria-label="Filter tasks"
        >
          <Filter className="h-4 w-4 lg:mr-2" />
          <span className="hidden lg:inline">Filter</span>
          {activeFilterCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="end">
        <Command>
          <CommandInput placeholder="Search labels..." />
          <CommandList>
            <CommandGroup heading="Priority">
              <CommandSeparator />
              {Object.values(TaskPriority).map(priority => (
                <CommandItem
                  key={priority}
                  onSelect={() =>
                    setSelectedPriority(
                      selectedPriority === priority ? null : (priority as TaskPriority)
                    )
                  }
                  className="flex items-center justify-between"
                >
                  <span>{priority}</span>
                  {selectedPriority === priority && <Check className="h-4 w-4" />}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Status">
              <CommandSeparator />
              {Object.values(TaskStatus).map(status => (
                <CommandItem
                  key={status}
                  onSelect={() =>
                    setSelectedStatus(selectedStatus === status ? null : (status as TaskStatus))
                  }
                  className="flex items-center justify-between"
                >
                  <span>{status.replace('_', ' ')}</span>
                  {selectedStatus === status && <Check className="h-4 w-4" />}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Labels">
              <CommandSeparator />
              {isLabelsLoading ? (
                <CommandItem disabled>Loading labels...</CommandItem>
              ) : labels.length === 0 ? (
                <CommandItem disabled>No labels available</CommandItem>
              ) : (
                labels.map(label => (
                  <CommandItem
                    key={label.id}
                    onSelect={() => toggleLabel(label)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className="h-3 w-3 rounded-full mr-2"
                        style={{ backgroundColor: label.color }}
                      />
                      <span>{label.name}</span>
                    </div>
                    {selectedLabels.some(l => l.id === label.id) && <Check className="h-4 w-4" />}
                  </CommandItem>
                ))
              )}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Sort">
              <CommandSeparator />
              <div className="flex items-center justify-between p-2">
                <span className="text-sm">Sort by:</span>
                <Select value={sortBy} onValueChange={value => setSortBy(value)}>
                  <SelectTrigger className="w-[140px] h-8">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="dueDate">Due Date</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="createdAt">Created At</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between p-2">
                <span className="text-sm">Order:</span>
                <Select
                  value={sortOrder}
                  onValueChange={value => setSortOrder(value as 'asc' | 'desc')}
                >
                  <SelectTrigger className="w-[140px] h-8">
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CommandGroup>
          </CommandList>
          <div className="flex items-center justify-between p-3 border-t">
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-8">
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
            <Button
              size="sm"
              onClick={applyFilters}
              className={`text-xs h-8 ${activeFilterCount === 0 ? 'ml-auto' : ''}`}
            >
              Apply Filters
            </Button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
