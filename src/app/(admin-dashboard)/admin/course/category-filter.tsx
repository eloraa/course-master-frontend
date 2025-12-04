'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface CategoryFilterProps {
  category?: string;
  onChange?: (category: string | undefined) => void;
}

// Common course categories - can be extended based on your API
const COMMON_CATEGORIES = ['Web Development', 'Mobile Development', 'Data Science', 'Machine Learning', 'Cloud Computing', 'DevOps', 'Security', 'Design', 'Business', 'Other'];

export const CategoryFilter = ({ category, onChange }: CategoryFilterProps) => {
  const [searchInput, setSearchInput] = useState('');

  const filteredCategories = COMMON_CATEGORIES.filter(cat => cat.toLowerCase().includes(searchInput.toLowerCase()));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          Category
          {category && <span className="text-xs font-semibold truncate max-w-20">{category}</span>}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2">
          <Input placeholder="Search categories..." value={searchInput} onChange={e => setSearchInput(e.target.value)} className="h-8 text-sm" />
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-48 overflow-y-auto">
          {filteredCategories.map(cat => (
            <DropdownMenuCheckboxItem key={cat} checked={category === cat} onCheckedChange={() => onChange && onChange(category === cat ? undefined : cat)}>
              {cat}
            </DropdownMenuCheckboxItem>
          ))}
        </div>
        {category && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked={false} onCheckedChange={() => onChange && onChange(undefined)}>
              Clear Filter
            </DropdownMenuCheckboxItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
