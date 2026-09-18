import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function PageHeader({ title, subtitle, onAdd, addLabel }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {onAdd && (
        <Button onClick={onAdd} className="rounded-xl gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          {addLabel || 'Add new'}
        </Button>
      )}
    </div>
  );
}
