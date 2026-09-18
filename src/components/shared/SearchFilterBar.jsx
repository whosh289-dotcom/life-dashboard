import React from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export default function SearchFilterBar({
  search, onSearch,
  filterValue, onFilter, filterOptions, filterPlaceholder,
  sortByExpiry, onToggleSortByExpiry,
}) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <div className="relative flex-1 min-w-[180px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search by name or reference..."
          className="pl-9 rounded-xl"
        />
      </div>

      {filterOptions && (
        <Select value={filterValue} onValueChange={onFilter}>
          <SelectTrigger className="w-44 rounded-xl">
            <SelectValue placeholder={filterPlaceholder || 'Filter by type'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {filterOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {onToggleSortByExpiry && (
        <Button
          variant={sortByExpiry ? 'default' : 'outline'}
          onClick={onToggleSortByExpiry}
          className="rounded-xl gap-2 shrink-0"
          size="sm"
        >
          <ArrowUpDown className="w-4 h-4" />
          Sort by expiry
        </Button>
      )}
    </div>
  );
}
